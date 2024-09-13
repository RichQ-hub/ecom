import mysql.connector
import time

print("RUNNING SCRIPT 1_create_db.py", flush=True)

db = None

attempts = 1
connected = False
sleep_time = 3

while attempts <= 100 and (not connected):
  if attempts >= 5:
    sleep_time = 15
  elif attempts >= 3:
    sleep_time = 6
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

print("Dropping existing tables", flush=True)

cursor.execute("DROP TABLE IF EXISTS MeasuresHighestLowest;")
cursor.execute("DROP TABLE IF EXISTS IndustryMetricAverages;")

cursor.execute("DROP TABLE IF EXISTS Category_Weightings;")
cursor.execute("DROP TABLE IF EXISTS Metric_Weightings;")
cursor.execute("DROP TABLE IF EXISTS ESG_Frameworks;")

cursor.execute("DROP TABLE IF EXISTS Users;")


###
### CLEANUP
###

print("Finished dropping existing tables", flush=True)

db.commit()

if cursor:
  cursor.close()
if db:
  db.close()