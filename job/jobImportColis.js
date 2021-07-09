"use strict";

const fs = require("fs");

const ajax = require("../util/ajax");
const ADDRESS = require("../util/const");


function start(cookieJar, folder) {
    fs.readdir(folder, function (err, folderFiles) {
        console.log("folderFiles:",folderFiles);
        folderFiles.forEach(function (file) {
            var filePath = folder + "/" + file;
            // console.log("file to hundle :", filePath);
            importFile(cookieJar, filePath, function () { console.log("------------------------FIN IMPORT FILE--------------") });
        });
    });
}

function importFile(cookieJar, filePath, onComplete) {
    if (onComplete === void 0) { onComplete = noop_1["default"]; }
    ajax.call({
        url: `${ADDRESS.SERVERQUALIF}/api/affrAuto/import?triggerPrint=true&saveErrors=false`,
        method: 'POST',
        jar: cookieJar,
        formData: {
            importColis: fs.createReadStream(filePath)
        }
    }, function (json) {
        console.info("Import file " + filePath + " success");
        onComplete(json);
    }, function (error, response) {
        console.error("Import file error: '" + response.statusCode + ": " + response.statusMessage + "'", response.body);
    });
}

exports.start = start;