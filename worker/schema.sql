CREATE TABLE IF NOT EXISTS clinic_days (
  key       TEXT PRIMARY KEY,
  clinic    TEXT NOT NULL DEFAULT 'harley',
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
  items_json    TEXT NOT NULL DEFAULT '[]',
  lab_cost      REAL NOT NULL DEFAULT 0,
  dd_amount     REAL NOT NULL DEFAULT 0,
  total     REAL NOT NULL DEFAULT 0
);
