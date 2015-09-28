let pg = require('pg-promise')();
import * as config from './db.conf.js';
import moment from 'moment';

let conn = config.bioris.postgres;
let dbRis = pg(conn);

export function doSql(sql) {
    let results = [];
    sql = sql || '';
    return new Promise((resolve, reject) => {
        dbRis.query(sql, true)
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
export function insertLog(table, users, id, type, desc) {
    desc = desc || '';
    let time = moment().format("HH:mm");
    let date = moment().format("YYYY-MM-DD");
    let sql = `INSERT INTO logs(time, date, users, tablefrom, tableid, type, description, host) VALUES('${time}', '${date}', ${users}, '${table}', ${id}, '${type}', '${desc}', 'localhost')`;
    return new Promise((resolve, reject) => {
        if (table && Number.isSafeInteger(users) && Number.isSafeInteger(id) && type) {
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
    let sql = `SELECT id FROM patient WHEE rut=${rut} LIMIT 1`;
    return new Promise((resolve, reject) => {
        doSql(sql)
            .then((row) => {
                resolve(row);
            }, (err) => {
                reject(err);
            });
    });
}

