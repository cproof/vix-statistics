const https = require('https');
const fs = require('fs');
const date = new Date();

const urls = {
    "daily": "https://www.vix.at/typo3conf/ext/vix_public/Classes/Resource/Traffic/Daily.php",
    "weekly": "https://www.vix.at/typo3conf/ext/vix_public/Classes/Resource/Traffic/Weekly.php",
    "monthly": "https://www.vix.at/typo3conf/ext/vix_public/Classes/Resource/Traffic/Monthly.php",
    "yearly": "https://www.vix.at/typo3conf/ext/vix_public/Classes/Resource/Traffic/Yearly.php"
};

const target = './images/';

//let filenames contain dates
const dateStr = date.toISOString().substring(0, 13);;

//download images from the links above
Object.keys(urls).forEach((key) => {
    const url = urls[key];
    const dest = target + dateStr + "_" + key + ".png";
    const file = fs.createWriteStream(dest);
    https.get(url, function (response) {
        response.pipe(file);
        file.on('finish', function () {
            console.log("created file " + dest);
            file.close();  // close() is async, call cb after close completes.
        });
    }).on('error', function (err) { // Handle errors
        console.log("error on file " + dest + " " + err);
        fs.unlink(dest); // Delete the file async. (But we don't check the result)
    });
});

console.log("finished update");
