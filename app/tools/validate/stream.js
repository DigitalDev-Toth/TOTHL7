
let config = require('../../../conf/config.js');

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
