let pg = require('pg-promise')();
import * as config from './db.conf.js';
import moment from 'moment';

export function doSql(sql, server) {
    server = server || 'bioris'; // Por defecto consulto en el RIS
    sql = sql || '';
    let conn = config[server].postgres, // Consultas entre RIS y PACS
        db = pg(conn),
        results = [];
    return new Promise((resolve, reject) => {
        db.query(sql, true)
            .then((data) => {
                resolve(data);
            }, (err) => {
                reject(err);
            })
            .done(() => {
                pg.end();
            });
    });
}
export function insertLog(calendar, message, ack, status) {
    let date = moment().format("YYYY-MM-DD HH:mm:ss");
    status = status == 'success' ? 1 : 2; // Si es success status = 1 sino == 2 // Ver table status_log
    let sql = `INSERT INTO log_hl7 ( calendar, message, ack, date, status ) VALUES( ${calendar}, '${message}', '${ack}', '${date}', ${status} )`;
    return new Promise((resolve, reject) => {
        if (message && Number.isSafeInteger(calendar) && Number.isSafeInteger(status) && ack) {
            doSql(sql)
                .then((data) => {
                    resolve(data);
                }, (err) => {
                    reject(err);
                });
        } else {
            reject('InsertLog: Datos incorrectos o nulos');
        }
    });
}
export function findRut(rut) {
    let sql = `SELECT id FROM patient WHERE rut='${rut}' LIMIT 1`;
    return new Promise((resolve, reject) => {
        doSql(sql)
            .then((row) => {
                resolve(row);
            }, (err) => {
                reject(err);
            });
    });
}
export function findAccession(studyUID) {
    let sql = `SELECT accession_no FROM study WHERE study_iuid='${studyUID}'`;
    return new Promise((resolve, reject) => {
        doSql(sql, 'biopacs') //Uso configuracion para acceder al pacs
            .then((row) => {
                resolve(row);
            }, (err) => {
                reject(err);
            });
    });
}
