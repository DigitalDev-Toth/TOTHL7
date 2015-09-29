module.exports = {
    port: 2575,
    ip: "127.0.0.1",
    // Frames inicio y fin de mensaje MLP
    startFrame: String.fromCharCode(11),
    endFrame: String.fromCharCode(28) + String.fromCharCode(13),
    pathPdf: "/var/www/html/sanlorenzo/reports/"
};
/*
 add startsWith to string to help with checking for correct segment
*/
if (typeof String.prototype.startsWith !== 'function') {
    String.prototype.startsWith = (str) => {
        return this.indexOf(str) === 0;
    };
}