import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), 'finance.db')


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL DEFAULT 'expense',
        amount REAL NOT NULL,
        category TEXT NOT NULL,
        payer TEXT NOT NULL,
        is_personal INTEGER DEFAULT 0,
        note TEXT,
        date TEXT NOT NULL,
        receipt_image TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        is_subscription_instance INTEGER DEFAULT 0
    )
    ''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS subscriptions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        amount REAL NOT NULL,
        category TEXT NOT NULL,
        payer TEXT NOT NULL,
        is_personal INTEGER DEFAULT 0,
        day_of_month INTEGER NOT NULL,
        is_active INTEGER DEFAULT 1,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
    ''')

    conn.commit()
    conn.close()
