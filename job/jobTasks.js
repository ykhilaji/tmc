"use strict";

const fs = require("fs");

const ajax = require("../util/ajax");
const ADDRESS = require("../util/const");
var array = require("../util/array");


function getTasksToPrint(cookieJar, data) {

    var parametersRefresh = 3000;
    ajax.call({
        url: ADDRESS.SERVER_LOCAL + "/api/desktop/tasks",
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        json: data || {},
        jar: cookieJar
    }, function (json, response) {
        if (response.statusCode === 204 || !json) {
            getTasksToPrint(cookieJar, {});
        }
        else {
            var etiquettes = json.etiquettes;
            if (etiquettes && etiquettes.length > 0) {
                console.log('Will print', etiquettes.length, 'etiquettes');
                var etiquettesSorted = array.takeRight(etiquettes, 1)[0].lineNumber !== null
                    ? array.sorted(etiquettes, { by: function (t) { return t.lineNumber; } }) : etiquettes;


                var printingResultPromise = etiquettesSorted.reduce(function (promise, etiquette) {
                    return promise.then(function (results) {
                        return printFromTask(etiquette)
                            .then(function (printResult) { return results.concat(printResult); })
                            .then(delayedResult(500));
                    });
                }, Promise.resolve([]));


                printingResultPromise.then(function (printingResultJson) {
                    console.log('print results', printingResultJson);
                    var lastTaskId = array.takeRight(etiquettesSorted, 1)[0].taskId;
                    var lastTaskLineNumber = array.takeRight(etiquettesSorted, 1)[0].lineNumber !== null ?
                        array.takeRight(etiquettesSorted, 1)[0].lineNumber : undefined;
                    var body = {
                        'lastTaskId': lastTaskId,
                        "lastTaskLineNumber": lastTaskLineNumber,
                        'printingResult': printingResultJson
                    };
                    getTasksToPrint(cookieJar, body);
                })["catch"](function (error) {
                    console.error('error while printing tasks', error);
                    setTimeout(function () { getTasksToPrint(cookieJar); }, parametersRefresh);
                });
            }
            else {
                console.log('Nothing to print : ', response.statusCode);
                setTimeout(function () { getTasksToPrint(cookieJar); }, parametersRefresh);
            }
        }
    }, function (error, response) {
        console.error('Error while getting tasks', error, response && response.statusCode);
        var errorWait = 400;
        setTimeout(function () { getTasksToPrint(cookieJar) }, errorWait);
    });

}

function printFromTask(etiquette) {
    var printResult = new Map();

    //var _a = paramsJob.params.printerParams, bonLivraisonModel = _a.bonLivraisonModel, cn23Printer = _a.cn23Printer, centreRemboursementModel = _a.centreRemboursementModel, douanierModel = _a.douanierModel, defaultPrinter = _a.defaultPrinter, bordereauPrinter = _a.bordereauPrinter;
    //var printerType = (!etiquette.isRetour && defaultPrinter) || (etiquette.isRetour && bordereauPrinter);
    //var enablePrint = isDocumentToPrint(etiquette.isRetour ? "Bordereau" : "Default", etiquette).enablePrint;
    var promiseResult = printThermiqueMock(etiquette, true);
    return promiseResult.then(function (proFormatStatus) {
        var status = { document: "Default", printer: "", status: "Successful", connectionType: "usb" };
        printResult.set("Default", status);
        return getAllPrintResult(printResult, etiquette);
    });
}

function printThermiqueMock(etiquette, options) {
    return new Promise(function (resolve, reject) {
        var status = printMock(etiquette, options);
        resolve(status);
    });
}

function getAllPrintResult(printResult, etiquette) {
    var allPrintStatus = Array.from(printResult.values()).filter(function (value) { return value.status !== undefined; });
    var allStatus = allPrintStatus.map(function (value) { return value.status; });
    var finalStatus = array.find(allStatus, function (status) { return status === 'TechnicalError'; }) || 'Successful';
    console.log('all printed', allPrintStatus, ' with finalStatus : ', finalStatus);
    return {
        taskId: etiquette.taskId,
        id: etiquette.id,
        forcePDFcn23: etiquette.forcePDFcn23,
        status: finalStatus,
        allPrintStatus: allPrintStatus,
        colisId: etiquette.colisId,
        isCmdTask: etiquette.isCmdTask,
        cmdId: etiquette.cmdId
    };
}

function printMock(etiquette, options) {
    console.log(etiquette);
    console.log("Printing task: " + etiquette.taskId);
    console.log("size: " + etiquette.length);
    console.log("with options", options);
    return Promise.resolve('Successful');
}

function delayedResult(ms) {
    return function (res) { return new Promise(function (resolve) { return setTimeout(function () { return resolve(res); }, ms); }); };
    ;
}

exports.start = getTasksToPrint;