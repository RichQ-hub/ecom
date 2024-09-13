import os
import time
import mysql.connector

INIT_SLEEP_TIME = 7
EXTENDED_SLEEP_TIME = 100000
REBUILD_DB = False

time.sleep(INIT_SLEEP_TIME)

db = None

attempts = 1
connected = False
sleep_time = 3

build_db = False

while attempts <= 100 and (not connected):
  if attempts >= 6:
    sleep_time = 15
  elif attempts >= 5:
    sleep_time = 12
  elif attempts >= 4:
    sleep_time = 9
  elif attempts >= 3:
    sleep_time = 6
  try:
    db = mysql.connector.connect(
        host="db",
        user="root",
        password="23erf23"
    )
    connected = True
    print("Successfully connected to database", flush=True)
  except:
     if attempts % 4 == 0:
      print("Attempt to connect to the database", flush=True)
     attempts += 1
     time.sleep(sleep_time)


cursor = db.cursor()

try:
  cursor.execute("CREATE DATABASE db")
  build_db = True
  print("A new database db has been created", flush=True)
except:
  print("Database db was already created earlier", flush=True)
  if cursor:
      cursor.close()
  cursor = db.cursor()

if REBUILD_DB:
  build_db = True

if not build_db:
  try:
    cursor.execute("USE db")
    
    query = "SELECT * FROM Metrics"
    cursor.execute(query)
    res = cursor.fetchall()
    if len(res) < 100:
      print("Database does not have all the metrics", flush=True)
      build_db = True
    
    query = "SELECT * FROM Companies LIMIT 200"
    cursor.execute(query)
    res = cursor.fetchall()
    if len(res) < 200:
      print("Database does not have all the companies", flush=True)
      build_db = True


    query = "SELECT * FROM Measures LIMIT 200"
    cursor.execute(query)
    res = cursor.fetchall()
    if len(res) < 200:
      print("Database does not have all the measures", flush=True)
      build_db = True
    
    query = "SELECT * FROM IndustryMetricAverages LIMIT 50"
    cursor.execute(query)
    res = cursor.fetchall()
    if len(res) < 50:
      print("Database does not have all the industry metric averages", flush=True)
      build_db = True
    
  except:
    build_db = True
    if cursor:
      cursor.close()
    cursor = db.cursor()

if build_db:
  if cursor:
    cursor.close()
  if db:
    db.close()
  print("Build database (will take on average 10-20 min)", flush=True)
  script_dir = "startup_scripts"
  scripts = [
    "1_create_db.py",
    "2_users_db.py",
    "3_metrics_companies_measures_db.py",
    "4_measures_highest_lowest_db.py",
    "5_industry_means_db.py",
    "6_default_frameworks_db.py",
  ] 

  for script_name in scripts:
    os.system(f"python {script_dir}/{script_name}")
  
  print("FINISHED BUILDING DATABASE", flush=True)

print("Running Flask app app.py now", flush=True)
os.system("python app.py")

time.sleep(EXTENDED_SLEEP_TIME)