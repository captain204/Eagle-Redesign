const Database = require('drizzle-orm/better-sqlite3'); // wait maybe just 'better-sqlite3'
try {
    const db = require('better-sqlite3')('./payload.db');
    const cols = db.pragma('table_info(users)');
    console.log("USERS COLUMNS:", cols);
    const indices = db.pragma('index_list(users)');
    console.log("USERS INDICES:", indices);
} catch (e) {
    console.error(e);
}
