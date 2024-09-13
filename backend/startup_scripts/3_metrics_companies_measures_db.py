import mysql.connector
import time
import csv
import os
from datetime import datetime

print("RUNNING SCRIPT 3_metrics_companies_measures_db.py", flush=True)

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
### COMPANIES AND MEASURES
###

print("Add companies and measures to database (will take ~ 10-15 min on average)", flush=True)

cursor.execute("DROP TABLE IF EXISTS Measures;")
cursor.execute("DROP TABLE IF EXISTS Metrics;")
cursor.execute("DROP TABLE IF EXISTS Companies;")

cursor.execute('''CREATE TABLE Companies (
    perm_id BIGINT,
    name VARCHAR(255),
    industry VARCHAR(255),
    country VARCHAR(255),
    nb_points_of_observations INT,
               
    PRIMARY KEY (perm_id)  
);''')

cursor.execute('''CREATE TABLE Metrics (
    id INT, 
    name VARCHAR(255),
    description TEXT,
    category ENUM('E','S','G'),
    data_provider VARCHAR(255),
    unit VARCHAR(255),
               
    PRIMARY KEY (id)
);''')

cursor.execute('''CREATE TABLE Measures (
    id INT AUTO_INCREMENT,
    perm_id BIGINT,
    metric_id INT,
    reported_date DATETIME,
    disclosure ENUM('R', 'A', 'C', 'E'),
    year INT,
    value FLOAT,
    
    PRIMARY KEY (id),
    FOREIGN KEY (perm_id) REFERENCES Companies(perm_id),
    FOREIGN KEY (metric_id) REFERENCES Metrics(id)
);''')


PATH = "startup_scripts"

### 
### METRICS
###

print("Adding metrics to database", flush=True)

with open(f"{PATH}/metrics_data.txt", "r") as f:
  for line in f:
    line = line.strip()
    elems = line.split("|")
    id = int(elems[0])
    name = elems[1]
    description = elems[2]
    category = elems[3]
    data_provider = elems[4]
    unit = elems[5]
    query = "INSERT INTO Metrics (id, name, description, category, data_provider, unit) VALUES (%s, %s, %s, %s, %s, %s);"
    params = (id, name, description, category, data_provider, unit)
    cursor.execute(query,params)

    if id % 40 == 0:
      print(f"Added metric {id} to database", flush=True)

print("Finished adding metrics to database", flush=True)

###
### COMPANIES
###

print("Adding companies to database", flush=True)

query = "INSERT INTO Companies (perm_id, name, industry, nb_points_of_observations, country) VALUES (%s, %s, %s, %s, %s);"

with open(f"{PATH}/companies_data.txt", "r") as f:
  
  curr = 1
  values_list = []

  for line in f:
    line = line.strip()
    elems = line.split("|")

    perm_id = int(elems[0])
    name = elems[1]
    industry = elems[2]
    if (not industry) or len(industry) == 0:
      industry = None
    
    country = elems[3]

    if (not country) or len(country) == 0:
      country = None
    
    nb_points_of_observations = elems[4]

    params = (perm_id, name, industry, nb_points_of_observations, country)

    values_list.append(params)

  cursor.executemany(query, values_list)

print("Finished adding companies to database", flush=True)

###
### MEASURES
###

print("Adding measures to database", flush=True)

curr_measure = 1

def process_measures_file(f, path):
  global curr_measure

  print(f"Adding measures from file {path}", flush=True)
  query = '''INSERT INTO Measures (perm_id, metric_id, reported_date, disclosure, year, value) 
                  VALUES (%s, %s, %s, %s, %s, %s);'''
  values_list = []

  perm_id = -1
  year = -1
  disclosure = ""
  month = -1
  day = -1
  reported_date = None
  metric_id = None
  value = None

  for line in f:
    line = line.strip()
    if line[0] == "p":
      perm_id = int(line[2:])
    elif line[0] == "y":
      year = 2000 + int(line[2:])
    elif line[0] == "c":
      disclosure = line[2]
    elif line[0] == "d" and "none" in line:
      day = None
      month = None
      reported_date = None
    elif line[0] == "d" and "n" in line:
      day = 31
      month = 12
      reported_date = datetime(year, month, day)
    elif line[0] == "d":
      month = int(line[2:4])
      day = int(line[5:7])
      reported_date = datetime(year, month, day)
    elif "|" in line:
      elems = line.split("|")
      metric_id = int(elems[0])
      value = float(elems[1])

      params = (perm_id, metric_id, reported_date, disclosure, year, value)
      values_list.append(params)

      if curr_measure % 150000 == 0:
        print(f"Up to measure {curr_measure}", flush=True)
      
      curr_measure += 1

  print(f"Execute bulk SQL query for file {path} (usually takes up to 1 min)", flush=True)
  cursor.executemany(query, values_list)


NUM_FILES = 13

for file_index in range(1, NUM_FILES + 1):
  path = f"{PATH}/measures_data_{file_index}.txt"
  with open(path, "r") as f:
    process_measures_file(f, path)


print("Finished adding measures to database", flush=True)


###
### CLEANUP
###

print("Finished adding metrics, companies, measures to database", flush=True)

db.commit()

if cursor:
  cursor.close()
if db:
  db.close()