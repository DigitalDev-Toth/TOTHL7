import download from 'download-pdf';
import fs from 'fs';
let config = require('..//../../conf/config.js');

export function getPdf(pdf, type, name) {
    return new Promise((resolve, reject) => {
        if (type == 'url') {
            pdf_url(pdf, name)
                .then((data) => {
                    resolve(data);
                })
                .catch((err) => {
                    reject(err);
                });
        }else {
            pdf_encapsulated(pdf, name)
                .then((data) => {
                    resolve(data);
                })
                .catch((err) => {
                    reject(err);
                });
        }
    });
}

function pdf_url(pdf, name) {
    return new Promise((resolve, reject) => {
        //directory: config.pathPdf,
        let options = {
            directory: "./pdfs/",
            filename: `${name}.pdf`
        };

        download(pdf, options, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve('INFO: PDF creado!');
            }
        });
    });
}

function pdf_encapsulated(pdf, name) {
    return new Promise((resolve, reject) => {
        let bitmap = new Buffer(pdf, 'base64');
        let file = `./pdfs/${name}.pdf`;
        //let file = `${config.pathPdf}${name}.pdf`;
        fs.writeFile(file, bitmap, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve('PDF CREADO!');
            }
        });
    });
}
