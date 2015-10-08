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
/* Guardo un log de las transacciones realizadas */
export function insertLog(calendar, message, ack, status) {
    console.log(message);
    let date = moment().format("YYYY-MM-DD HH:mm:ss");
    status = status == 'success' ? 1 : 2; // Si es success status = 1 sino == 2 // Ver table status_log
    let sql = `INSERT INTO log_hl7 ( calendar, message, ack, date, status ) VALUES( ${calendar}, '${message}', '${ack}', '${date}', ${status} )`;
    return new Promise((resolve, reject) => {
        if (message && calendar && Number.isSafeInteger(status) && ack) {
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
/* Valida que el paciente exista */
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
/* Busca id calendar a traves del studyUID */
export function findAccession([studyUID, idExternal]) {
    idExternal = idExternal || '';
    let sql = `SELECT accession_no FROM study WHERE study_iuid='${studyUID}'`;
    console.log(sql);
    return new Promise((resolve, reject) => {
        doSql(sql, 'biopacs') //Uso configuracion para acceder al pacs
            .then((row) => {
                if (row.length > 0) {
                    resolve([row[0].accession_no, idExternal]);
                } else {
                    reject('ERROR: StudyUID no se puede relacionar con el RIS. Verificar que contenga accession number');
                }
            }, (err) => {
                reject(err);
            });
    });
}
/* Busca id calendar a traves del studyUID */
export function assocTothWithExternal(history, external) {
    let sql = `UPDATE report_history SET external='${external} WHERE id=${history}'`;
    return new Promise((resolve, reject) => {
        doSql(sql, 'biopacs') //Uso configuracion para acceder al pacs
            .then((row) => {
                if (row.length > 0) {
                    resolve(row[0].accession_no);
                } else {
                    reject('ERROR: StudyUID no se puede relacionar con el RIS. Verificar que contyenga accession number');
                }
            }, (err) => {
                reject(err);
            });
    });
}
/* VERIFICA SI EXISTE EL CALENDAR */
export function validateCalendar([calendar, idExternal]) {
    idExternal = idExternal || null;
    let sql = `SELECT id FROM calendar WHERE id=${calendar}`;
    return new Promise((resolve, reject) => {
        doSql(sql)
            .then((row) => {
                if (row.length > 0) {
                    resolve([calendar, idExternal]);
                } else {
                    reject('ERROR: No existe registro en el RIS para este estudio');
                }
            }, (err) => {
                reject(err);
            });
    });
}
/* CREAR INFORME Y ASOCIAR a CALENDAR_EXAM*/
export function createReport([calendar, idExternal]) {
    idExternal = idExternal || null;
    let date = moment().format("YYYY-MM-DD");
    let sql = `INSERT INTO report_history (date, template, report, users, status, calendar, external) VALUES ('${date}', 102, 'Zetta Chile HL7', 45, 4, ${calendar}, ${idExternal}) RETURNING id`;
    return new Promise((resolve, reject) => {
        doSql(sql)
            .then((row) => {
                if (row.length > 0) {
                    let id = row[0].id;
                    doSql(`UPDATE calendar_exam SET history=${id}, exam_state='validado' WHERE calendar=${calendar}`)
                        .then((row) => {
                            doSql(`UPDATE calendar SET exam_state='validado' WHERE id=${calendar}`)
                                .then((row) => {
                                        resolve([id, calendar]);
                                }, (err) => {
                                    reject(err);
                                });
                        }, (err) => {
                            reject(err);
                        });
                } else {
                    reject('ERROR: No se ha podido crear informe');
                }
            }, (err) => {
                reject(err);
            });
    });
}
