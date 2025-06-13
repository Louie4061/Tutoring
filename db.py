import sqlite3

conn = sqlite3.connect("mydatabase.db")
cursor = conn.cursor()
cursor.execute("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)")
conn.commit()
conn.close()