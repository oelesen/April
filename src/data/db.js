import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseAsync('datenbank.db');
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const init = async () => {
  //console.log('SQLite:', SQLite);

  //console.log('Database object:', db);
  const promise = new Promise((resolve, reject) => {
    if (!db) {
      console.error('Failed to open database');
      reject(new Error('Failed again to open database'));
      return;
    } else {
      //console.log('Database gibts');
    }

    db.transaction((tx) => {
      //console.log('Starting transaction');
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS datenbank (id INTEGER PRIMARY KEY NOT NULL, ort TEXT NOT NULL, grau TEXT NOT NULL, gruen TEXT NOT NULL, thema TEXT NOT NULL);',
        [],
        () => {
          resolve();
        },
        (_, err) => {
          reject(err);
        },
      );
    });
  });
  return promise;
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const insertDatenbank = (ort, grau, gruen, thema) => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO datenbank (ort,grau,gruen, thema) VALUES (?, ?, ?, ?);`,
        [ort, grau, gruen, thema],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          reject(err);
        },
      );
    });
  });
  return promise;
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const fetchDatenbank = () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM datenbank where id = 1',
        [],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          reject(err);
        },
      );
    });
  });
  return promise;
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const deleteDatenbank = () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM datenbank where id = 1',
        [],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          reject(err);
        },
      );
    });
  });
  return promise;
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const updateDatenbank = (ort, grau, gruen, thema) => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE datenbank SET ort = ? , grau = ?, gruen = ?, thema = ? WHERE id = ?',
        [ort, grau, gruen, thema, 1],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          reject(err);
        },
      );
    });
  });
  return promise;
};
