const Database = require('better-sqlite3');
const path = require('path');

const dbPath = process.env.VERCEL
  ? '/tmp/game.db'
  : path.join(__dirname, '..', 'game.db');
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    email      TEXT    UNIQUE NOT NULL,
    password   TEXT    NOT NULL,
    created_at TEXT    DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS scores (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id    INTEGER NOT NULL REFERENCES users(id),
    score      INTEGER NOT NULL,
    played_at  TEXT    DEFAULT (datetime('now'))
  );
`);

module.exports = db;
