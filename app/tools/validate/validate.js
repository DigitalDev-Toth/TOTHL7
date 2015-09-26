
import * as db from '../../db/db.js';

export function test(messages) {
    let messageParsed = messages[0];
    let messageNative = messages[1];
    return new Promise((resolve, reject) => {
        let base64 = messageParsed.query('OBX[5]');
        db.doSql("UPDATE patient SET name = 'SIMPLICIO ARNALDO' WHERE rut='16.836.159-9'")
            .then((data) => {
                console.log(data);
                let ackMessageReturn = 'Message validated!';
                let messages = [messageNative, ackMessageReturn];
                resolve(messages);
            })
            .catch((err) => {
                reject(err);
            });
    });
}
