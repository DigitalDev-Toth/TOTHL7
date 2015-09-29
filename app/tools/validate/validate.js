import * as db from '../../db/db.js';
import * as pdf from '../pdf/pdf.js';
import moment from 'moment';

export function validate([parsedMessage, messageNative]) {
    return new Promise((resolve, reject) => {
        let pdf_type,
            pdfData,
            errorArray = [],
            idExternal;
        if (parsedMessage.query('OBX|2') == 'ST') {
            pdf_type = 'url';
            pdfData = parsedMessage.query('OBX[5]')[0];
        } else if (parsedMessage.query('OBX|2') == 'ED') {
            pdf_type = 'base64';
            pdfData = parsedMessage.query('OBX|5^4');

        } else {
            reject([messageNative, 'ERROR: Segmento OBX campo 2 incorrecto']);
            return;
        }
        let studyUID = parsedMessage.query('OBX[5]')[1];

        if(parsedMessage.query('ORC|2')) {
            idExternal = parsedMessage.query('ORC|2');    
        }else {
            reject([messageNative, 'ERROR: No se envia ID INFORME externo. Segmento ORC campo 2']);
            return;
        }
        
        let rut = parsedMessage.query('PID|2');
        db.findAccession([studyUID, idExternal])
            .then(db.validateCalendar)
            .then(db.createReport)
            .then((idReport) => {
                pdf.getPdf(pdfData, pdf_type, idReport)
                    .then((data) => {
                        let ackMessageReturn = 'Message validated!';
                        resolve([messageNative, ackMessageReturn]);
                    })
                    .catch((err) => {
                        errorArray.push(err);
                        reject([messageNative, errorArray.toString()]);
                    });
            })
            .catch((err) => {
                errorArray.push(err);
                reject([messageNative, errorArray.toString()]);
            });
    });
}
