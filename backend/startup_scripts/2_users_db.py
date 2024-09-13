import mysql.connector
import time

print("RUNNING SCRIPT 2_users_table.py", flush=True)

db = None

attempts = 1
connected = False
sleep_time = 3

while attempts <= 100 and (not connected):
  try:
    db = mysql.connector.connect(
        database="db",
        host="db",
        user="root",
        password="23erf23"
    )
    connected = True
    print("Successfully connected to database", flush=True)
  except:
     print("Could not connect to database, trying again", flush=True)
     attempts += 1
     time.sleep(sleep_time)

cursor = db.cursor()

print("Creating users table", flush=True)

cursor.execute("DROP TABLE IF EXISTS Users;")

cursor.execute('''CREATE TABLE Users (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,

    PRIMARY KEY (id)
);''')

###
### CLEANUP
###

print("Finished creating users tables", flush=True)

db.commit()

if cursor:
  cursor.close()
if db:
  db.close()