import net from 'net';
let config = require('./conf/config.js');
import * as hl7 from './app/tools/parser/hl7.js';
import * as validate from './app/tools/validate/validate.js';
import * as ack from './app/tools/ack/ack.js';

let errors = []; //Arreglo de errores
let dataString = ""; //Buffer String

//Servidor TCP para recepcion de mensajes
let Server = net.createServer((socket) => {
    console.log('CONNECTED: ' + socket.remoteAddress + ':' + socket.remotePort);

    socket.on('data', (data) => {
        dataString += data; // Autoincrementa el stream para obtener todo el mensaje HL7
        hl7.validateStream(dataString) //valido que llegue el mensaje completo
            .then(hl7.parse) // Parseo el mensaje
            .then(validate.validate) // Valido en el ris
            .then(ack.buildAck) //Creo ACK con mensaje customizado
            .then((ack) => {
                //Guardo log...Se supone
                validate.logData.insertLog(validate.logData.calendar, validate.logData.messageNative, ack, 'success');
                console.log("Sending ACK");
                socket.write(ack); // Envio ACK Success
                dataString = "";
            })
            .catch(ack.buildAck) // Construyo el ACK pero con error
            .then((ackError) => {
                validate.logData.insertLog(validate.logData.calendar, validate.logData.messageNative, ackError, 'error');
                socket.write(ackError);
                console.log('ACK error sended!');
                dataString = "";
            });
    });
});
console.log("Listening for HL7 MLLP on " + config.ip + ":" + config.port);

Server.listen(config.port, config.ip);
