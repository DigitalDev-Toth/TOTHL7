
let pg = require('pg-promise')();
import bioris from './db.conf.js';
import moment from 'moment';

let conn = bioris.postgres;
let db = pg(conn);

export function doSql(sql) {
    let results = [];
    sql = sql || '';
    return new Promise((resolve, reject) => {
        db.query(sql, true)
            .then(function(data) {
                resolve(data);
            }, function(err) {
                reject(err);
            })
            .done(function() {
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
