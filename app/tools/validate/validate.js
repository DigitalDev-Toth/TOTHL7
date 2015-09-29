
import * as db from '../../db/db.js';

export function validate(messages) {
    let messageParsed = messages[0];
    let messageNative = messages[1];
    let pdf_type;
    return new Promise((resolve, reject) => {
        if(messageParsed.query('OBX|2') == 'ST'){
            pdf_type = 'url';
        } else {
            pdf_type = 'base64';
        }
        let pdfData = messageParsed.query('OBX[5]')[0];
        let studyUID = messageParsed.query('OBX[5]')[1];
        let idZetta = messageParsed.query('ORC|2');
        console.log(studyUID, pdfData);
        let rut = messageParsed.query('PID|2');
        db.insertLog(16208, 'message', 'ack', 'success')
            .then((data) => {
                console.log(data);
                let ackMessageReturn = 'Message validated!';
                let messages = [messageNative, ackMessageReturn];
                resolve(messages);
            })
            .catch((err) => {
                reject(err);
            });
        // db.findAccession(studyUID)
        //     .then((data) => {
        //         console.log(data);
        //         let ackMessageReturn = 'Message validated!';
        //         let messages = [messageNative, ackMessageReturn];
        //         resolve(messages);
        //     })
        //     .catch((err) => {
        //         reject(err);
        //     });
    });
}
