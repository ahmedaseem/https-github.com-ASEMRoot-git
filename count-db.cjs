const sqlite3 = require('sqlite3').verbose();

const files = [
  '/root/my-site-app/instance/asem.db',
  '/root/my-site-app/asem.db'
];

const tables = [
  'countries',
  'cities',
  'businesses',
  'products',
  'tourism',
  'projects',
  'users'
];

function openDatabase(file) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(file, sqlite3.OPEN_READONLY, (error) => {
      if (error) reject(error);
      else resolve(db);
    });
  });
}

function countRows(db, table) {
  return new Promise((resolve) => {
    db.get(`SELECT COUNT(*) AS total FROM "${table}"`, (error, row) => {
      resolve(error ? 'غير موجود' : row.total);
    });
  });
}

(async () => {
  for (const file of files) {
    console.log(`\nDATABASE: ${file}`);

    try {
      const db = await openDatabase(file);

      for (const table of tables) {
        const total = await countRows(db, table);
        console.log(`${table}: ${total}`);
      }

      db.close();
    } catch {
      console.log('لا يمكن فتح قاعدة البيانات');
    }
  }
})();
