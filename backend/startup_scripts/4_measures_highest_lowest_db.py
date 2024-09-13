import mysql.connector
import math
import time

print("RUNNING SCRIPT 4_measures_highest_lowest_db.py", flush=True)

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

###
### ASSIGNING SCALED MEASURES
###

print("Adding highest, lowest and average measures to database", flush=True)

cursor.execute("DROP TABLE IF EXISTS MeasuresHighestLowest;")

cursor.execute('''CREATE TABLE MeasuresHighestLowest (
    id INT AUTO_INCREMENT,
    metric_id INT,
    max_value FLOAT,
    min_value FLOAT,
    avg_value FLOAT,
            
    PRIMARY KEY (id),
    FOREIGN KEY (metric_id) REFERENCES Metrics(id)
);''')

PATH = "startup_scripts"

query = """
  INSERT INTO MeasuresHighestLowest (metric_id, max_value, min_value, avg_value)
  VALUES (%s, %s, %s, %s);
"""

with open(f"{PATH}/measures_highest_lowest.txt", "r") as f:
  
  curr = 1
  values_list = []

  for line in f:
    line = line.strip()
    elems = line.split("|")

    metric_id = int(elems[0])
    max_value = float(elems[1])
    min_value = float(elems[2])
    avg_value = float(elems[3])

    params = (metric_id, max_value, min_value, avg_value)

    values_list.append(params)

  cursor.executemany(query, values_list)


###
### CLEANUP
###

print("Finished adding highest, lowest and average measures to database", flush=True)

db.commit()

if cursor:
  cursor.close()
if db:
  db.close()