module.exports = {
    port: 2576,
    ip: "192.168.0.170",
    // Frames inicio y fin de mensaje MLP
    startFrame: String.fromCharCode(11),
    endFrame: String.fromCharCode(28) + String.fromCharCode(13),
    pathPdf: "/Users/siarcarse/Sites/sanlorenzo/reports/"
};
/*
 add startsWith to string to help with checking for correct segment
*/
if (typeof String.prototype.startsWith !== 'function') {
    String.prototype.startsWith = (str) => {
        return this.indexOf(str) === 0;
    };
}
