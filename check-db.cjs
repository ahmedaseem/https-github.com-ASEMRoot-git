const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(
  '/root/my-site-app/instance/asem.db',
  sqlite3.OPEN_READONLY,
  (error) => {
    if (error) {
      console.error(error.message);
      process.exit(1);
    }
  }
);

db.all(
  "SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name",
  [],
  (error, tables) => {
    if (error) {
      console.error(error.message);
      return db.close();
    }

    let remaining = tables.length;

    for (const table of tables) {
      db.all(`PRAGMA table_info("${table.name}")`, [], (columnError, columns) => {
        console.log(`\nTABLE: ${table.name}`);

        if (!columnError) {
          console.log(
            columns.map((column) => `${column.name}: ${column.type}`).join(', ')
          );
        }

        db.get(
          `SELECT COUNT(*) AS total FROM "${table.name}"`,
          [],
          (countError, row) => {
            if (!countError) {
              console.log(`ROWS: ${row.total}`);
            }

            remaining -= 1;

            if (remaining === 0) {
              db.close();
            }
          }
        );
      });
    }

    if (remaining === 0) {
      db.close();
    }
  }
);
