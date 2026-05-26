CREATE TABLE IF NOT EXISTS clinic_days (
  key       TEXT PRIMARY KEY,
  date      TEXT NOT NULL,
  date_obj  TEXT NOT NULL,
  hours     REAL NOT NULL DEFAULT 0,
  t6        INTEGER NOT NULL DEFAULT 0,
  t3        INTEGER NOT NULL DEFAULT 0,
  cons      INTEGER NOT NULL DEFAULT 0,
  bonus     INTEGER NOT NULL DEFAULT 0,
  indem     INTEGER NOT NULL DEFAULT 0,
  gdc       INTEGER NOT NULL DEFAULT 0,
  start_time TEXT,
  end_time   TEXT,
  total     REAL NOT NULL DEFAULT 0
);
