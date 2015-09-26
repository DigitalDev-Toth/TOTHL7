
let config = require('../../../conf/config.js');

export function buildAck(messages) {
    let hl7 = messages[0];
    let custom_message = messages[1];
    return new Promise((resolve, reject) => {
        let fieldsep = hl7.substring(3, 4);
        let compsep = hl7.substring(4, 5);
        let runtime_errors = [];

        //let msh = "MSH" + fieldsep;
        let msh = `MSH${fieldsep}`;
        let oldMsh = "";

        let segments = hl7.split("\r");

        for (let value of segments) {
            if (value.startsWith("MSH")) {
                // found msh
                oldMsh = value;
                runtime_errors = [];
                break;
            } else {
                runtime_errors.push("ERROR: HL7 no contiene segmento MSH");
            }
        }

        // create new string array
        let oldMshArray = oldMsh.split(fieldsep);
        /*
        reorder fields in MSH, and add the correct msg type
        Reordena campos en HL7 y los agrega correctamente.
         Array values:
         0 - MSH
         1 - Encoding characters
         2 - Sending Application
         3 - Sending Facility
         4 - Receiving Application
         5 - Receiving Facility
         6 - Date/Time of Message
         7 - Security
         8 - Message Type
         9 - Message Control ID
         10 - Processing ID
         11 - Version ID
         */
        let newMshArr = ["MSH", oldMshArray[1], oldMshArray[4], oldMshArray[5], oldMshArray[2], oldMshArray[3], oldMshArray[6], "", "ACK" + compsep + "O01", oldMshArray[9], oldMshArray[10], oldMshArray[11]];
        msh = newMshArr.join(fieldsep);

        // Agrega segmento MSA
        let msa = `MSA${fieldsep}AA${fieldsep}${oldMshArray[9]}|${custom_message}`;
        let ack = msh + "\r" + msa;

        // Agrega frame de inicio y fin al mensaje ACK
        ack = config.startFrame + ack + config.endFrame;
        if (runtime_errors.length === 0) {
            resolve(ack);
        } else {
            reject(runtime_errors);
        }
    });
}
