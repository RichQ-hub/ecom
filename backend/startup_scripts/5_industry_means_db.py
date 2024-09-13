import mysql.connector
import time

print("RUNNING SCRIPT 5_industry_means_db.py", flush=True)

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
### ADD INDUSTRY MEANS FOR MEASURES
###

print("Adding industry means for measures", flush=True)

cursor.execute("DROP TABLE IF EXISTS IndustryMetricAverages;")

cursor.execute('''CREATE TABLE IndustryMetricAverages (
    id INT AUTO_INCREMENT,
    metric_id INT,
    industry VARCHAR(255),
    avg_value FLOAT,
            
    PRIMARY KEY (id),
    FOREIGN KEY (metric_id) REFERENCES Metrics(id)
);''')

PATH = "startup_scripts"

query = "INSERT INTO IndustryMetricAverages (metric_id, industry, avg_value) VALUES (%s, %s, %s)"

with open(f"{PATH}/industry_metric_averages.txt", "r") as f:
  
  curr = 1
  values_list = []

  for line in f:
    line = line.strip()
    elems = line.split("|")

    metric_id = int(elems[0])
    industry = str(elems[1])
    avg_value = float(elems[2])

    params = (metric_id, industry, avg_value)

    values_list.append(params)

  cursor.executemany(query, values_list)

###
### CLEANUP
###

print("Finished adding industry means for measures", flush=True)

db.commit()

if cursor:
  cursor.close()
if db:
  db.close()
