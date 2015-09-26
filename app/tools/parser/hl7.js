
import parser from 'L7';

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