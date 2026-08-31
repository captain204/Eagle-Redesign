import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Initialize in the root directory (outside src)
const dbPath = path.join(process.cwd(), 'raffle.sqlite');

// Singleton to prevent multiple connections in dev mode hot-reloads
let db: Database.Database;

if (!global.__raffleDb) {
  global.__raffleDb = new Database(dbPath);
  
  // Enable WAL mode for high concurrency
  global.__raffleDb.pragma('journal_mode = WAL');
  
  // Initialize tables
  global.__raffleDb.exec(`
    CREATE TABLE IF NOT EXISTS RaffleDistributorLocations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS RaffleCodes (
      code TEXT PRIMARY KEY,
      batchId TEXT NOT NULL,
      generatedBy TEXT NOT NULL,
      month TEXT NOT NULL,
      isUsed INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS RaffleSubmissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userEmail TEXT NOT NULL,
      userPhone TEXT,
      imageHash TEXT,
      imagePath TEXT,
      exifTimestamp TEXT,
      exifLatitude REAL,
      exifLongitude REAL,
      distance REAL,
      status TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

db = global.__raffleDb;

export default db;

// Add type declaration for global object to avoid TypeScript errors
declare global {
  var __raffleDb: Database.Database | undefined;
}
