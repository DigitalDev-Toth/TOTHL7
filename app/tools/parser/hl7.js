import parser from 'L7';
let config = require('../../../conf/config.js');

export function parse(messageNative) {
    let runtime_errors = [];
    return new Promise((resolve, reject) => {
        let parsedMessage = parser.parse(messageNative);
        if (parsedMessage.length === 0) { // Se creo el array con mensajes
            //TODO: parsedMessage contiene una variable error
            runtime_errors.push('ERROR: Imposible parsear el mensaje');
            reject([messageNative, runtime_errors.toString()]);
        } else {
            resolve([parsedMessage, messageNative]);
        }
    });
}
export function validateStream(messageNative) {
    return new Promise((resolve, reject) => {
        let posStart = messageNative.indexOf(config.startFrame);
        let posEnd = messageNative.indexOf(config.endFrame);

        while (posStart > -1 && posEnd > -1) {
            if (posStart > -1 && posEnd > -1) {
                // Aqui deberia estar todo el mensaje
                if (posEnd < posStart) {
                    //Si entra aca es porque se perdio parte del mensaje... Se borra
                    messageNative = messageNative.substring(posEnd + config.endFrame.length);
                    reject([messageNative, 'ERROR: Mensaje Incompleto!']);
                } else {
                    let msg = messageNative.substring(posStart + posStart.length, posEnd).trim();
                    /* Limpio buffer para nueva recepcion */
                    messageNative = messageNative.substring(posEnd + config.endFrame.length);
                    posStart = messageNative.indexOf(config.startFrame);
                    posEnd = messageNative.indexOf(config.endFrame);
                    /* cumplo con mensaje bonito, todo me parece bonito */
                    resolve(msg);
                }
            }
        }
    });
}
