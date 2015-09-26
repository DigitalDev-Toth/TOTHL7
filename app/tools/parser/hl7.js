
import parser from 'L7';
let config = require('../../../conf/config.js');

export function parse(messageNative) {
    let runtime_errors = [];
    return new Promise((resolve, reject) => {
        let parsedMessage = parser.parse(messageNative);
        if( parsedMessage.length === 0 ) { // Se creo el array con mensajes
            //TODO: parsedMessage contiene una variable error
            runtime_errors.push('ERROR: Imposible parsear el mensaje');
            reject(runtime_errors);
        }else {
            var messages = [parsedMessage, messageNative];

            resolve(messages);
        }
    });
}
export function validateStream(dataString) {
    return new Promise((resolve, reject) => {
        let posStart = dataString.indexOf(config.startFrame);
        let posEnd = dataString.indexOf(config.endFrame);

        while (posStart > -1 && posEnd > -1) {
            if (posStart > -1 && posEnd > -1) {
                // Aqui deberia estar todo el mensaje
                if (posEnd < posStart) {
                    //Si entra aca es porque se perdio parte del mensaje... Se borra
                    dataString = dataString.substring(posEnd + config.endFrame.length);
                    reject('ERROR: Mensaje Incompleto!');
                } else {
                    let msg = dataString.substring(posStart + posStart.length, posEnd).trim();
                    resolve(msg);
                    dataString = dataString.substring(posEnd + config.endFrame.length);
                }
            }

            posStart = dataString.indexOf(config.startFrame);
            posEnd = dataString.indexOf(config.endFrame);
        }
    });
}