import * as SQLite from 'expo-sqlite';

// We create a variable to hold the database instance
let db = null;

// This helper ensures we always have the database instance ready
const getDb = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync('datenbank.db');
  }
  return db;
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const init = async () => {
  const database = await getDb();
  try {
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // ACHTUNG: Nur zum Fixen! Löscht die alte Tabelle und erstellt sie neu.
    // Das löscht alle alten Testdaten auf dem Handy!
    //braucht nur aktiviert zu werden, wenn Probleme mit alter, geänderter Datenbank aufgetreten sind
    //await database.execAsync('DROP TABLE IF EXISTS datenbank;');

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // execAsync is used for one-off commands like creating tables
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS datenbank (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        ort TEXT NOT NULL, 
        grau TEXT NOT NULL, 
        gruen TEXT NOT NULL 
      );
    `);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const insertDatenbank = async (ort, grau, gruen) => {
  const database = await getDb();
  try {
    // runAsync is used for INSERT, UPDATE, DELETE
    const result = await database.runAsync(
      'INSERT INTO datenbank (ort, grau, gruen) VALUES (?, ?, ?);',
      [ort, grau, gruen],
    );
    return result;
  } catch (error) {
    console.error('Insert error:', error);
    throw error;
  }
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const fetchDatenbank = async () => {
  const database = await getDb();
  try {
    // getAllAsync returns an array of all rows found
    const allRows = await database.getAllAsync('SELECT * FROM datenbank');
    return allRows;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const deleteDatenbank = async () => {
  const database = await getDb();
  try {
    const result = await database.runAsync('DELETE FROM datenbank');
    return result;
  } catch (error) {
    console.error('Delete error:', error);
    throw error;
  }
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const updateDatenbank = async (ort, grau, gruen) => {
  const database = await getDb();
  try {
    const result = await database.runAsync(
      'UPDATE datenbank SET ort = ?, grau = ?, gruen = ? WHERE id = (SELECT id FROM datenbank LIMIT 1)',
      [ort, grau, gruen],
    );
    return result;
  } catch (error) {
    console.error('Update error:', error);
    throw error;
  }
};
