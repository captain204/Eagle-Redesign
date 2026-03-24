const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./payload.db');

db.all("PRAGMA index_list('submissions')", (err, rows) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log('Indexes for submissions:', rows);

    db.all("PRAGMA table_info('submissions')", (err, columns) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log('Columns for submissions:', columns);
        db.close();
    });
});
