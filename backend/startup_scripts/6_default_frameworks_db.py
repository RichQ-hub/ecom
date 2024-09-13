import mysql.connector
import time

print("RUNNING SCRIPT 6_default_frameworks_db.py", flush=True)

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
### DEFAULT FRAMEWORKS
###

print("Creating default frameworks", flush=True)

cursor.execute("DROP TABLE IF EXISTS Category_Weightings;")
cursor.execute("DROP TABLE IF EXISTS Metric_Weightings;")
cursor.execute("DROP TABLE IF EXISTS ESG_Frameworks;")

cursor.execute('''CREATE TABLE ESG_Frameworks (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT,
    name VARCHAR(255) NOT NULL,
    is_user_created BOOLEAN NOT NULL,
    date_created DATETIME,
    date_last_updated DATETIME,

    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES Users(id)
);''')

cursor.execute('''CREATE TABLE Category_Weightings (
    id INT NOT NULL AUTO_INCREMENT,
    category ENUM('E','S','G') NOT NULL,
    framework_id INT NOT NULL,
    weight FLOAT NOT NULL,

    PRIMARY KEY (id),
    FOREIGN KEY (framework_id) REFERENCES ESG_Frameworks(id)
);''')

cursor.execute('''CREATE TABLE Metric_Weightings (
    id INT NOT NULL AUTO_INCREMENT,
    metric_id INT NOT NULL,
    framework_id INT NOT NULL,
    weight FLOAT NOT NULL,

    PRIMARY KEY (id),
    FOREIGN KEY (metric_id) REFERENCES Metrics(id),
    FOREIGN KEY (framework_id) REFERENCES ESG_Frameworks(id)
);''')

def met_id_from_name(metric_name):
  query = "SELECT id from Metrics where name = %s"
  values = (metric_name,)
  cursor.execute(query, values)
  res = cursor.fetchone()
  if res is None or len(res) == 0:
    raise ValueError(f"Metric name {metric_name} is invalid")
  
  return res[0]


framework1 = {
  "name": "IFRS S1",
  "categories": [
    {"category": "E", "weight": 0.4},
    {"category": "S", "weight": 0.3},
    {"category": "G", "weight": 0.3},
  ],
  "metrics": [
    {"metric_id": met_id_from_name("BIODIVERSITY_IMPACT_REDUCTION"), "weight": 0.05},
    {"metric_id": met_id_from_name("POLICY_FORCED_LABOR"), "weight": 0.05},
    {"metric_id": met_id_from_name("POLICY_WATER_EFFICIENCY"), "weight": 0.05},
    {"metric_id": met_id_from_name("POLICY_CHILD_LABOR"), "weight": 0.05},
    {"metric_id": met_id_from_name("POLICY_BRIBERYAND_CORRUPTION"), "weight": 0.05},
    {"metric_id": met_id_from_name("POLICY_HUMAN_RIGHTS"), "weight": 0.05},
    {"metric_id": met_id_from_name("GRIEVANCE_REPORTING_PROCESS"), "weight": 0.05},
    {"metric_id": met_id_from_name("POLICY_DATA_PRIVACY"), "weight": 0.05},
    {"metric_id": met_id_from_name("ENERGYUSETOTAL"), "weight": 0.05},
    {"metric_id": met_id_from_name("ANALYTICNONEXECBOARD"), "weight": 0.05},
    {"metric_id": met_id_from_name("RENEWENERGYCONSUMED"), "weight": 0.05},
    {"metric_id": met_id_from_name("WATER_TECHNOLOGIES"), "weight": 0.05},
    {"metric_id": met_id_from_name("NOXEMISSIONS"), "weight": 0.05},
    {"metric_id": met_id_from_name("SOXEMISSIONS"), "weight": 0.05},
    {"metric_id": met_id_from_name("RENEWENERGYPURCHASED"), "weight": 0.05},
    {"metric_id": met_id_from_name("WASTE_RECYCLED"), "weight": 0.05},
    {"metric_id": met_id_from_name("WOMENEMPLOYEES"), "weight": 0.05},
    {"metric_id": met_id_from_name("EMPLOYEEFATALITIES"), "weight": 0.05},
    {"metric_id": met_id_from_name("ANNUAL_MEDIAN_COMPENSATION"), "weight": 0.05},
    {"metric_id": met_id_from_name("TARGETS_WATER_EFFICIENCY"), "weight": 0.01},
    {"metric_id": met_id_from_name("ANALYTICNOMINATIONCOMMIND"), "weight": 0.01},
    {"metric_id": met_id_from_name("TURNOVEREMPLOYEES"), "weight": 0.01},
    {"metric_id": met_id_from_name("BOARDMEETINGATTENDANCEAVG"), "weight": 0.01},
    {"metric_id": met_id_from_name("COMMMEETINGSATTENDANCEAVG"), "weight": 0.01},
  ]
}

framework2 = {
  "name": "IFRS S2",
  "categories": [
    {"category": "E", "weight": 1.0},
    {"category": "S", "weight": 0.0},
    {"category": "G", "weight": 0.0},
  ],
  "metrics": [
    {"metric_id": met_id_from_name("BIODIVERSITY_IMPACT_REDUCTION"), "weight": 0.10}, 
    {"metric_id": met_id_from_name("POLICY_EMISSIONS"), "weight": 0.10},
    {"metric_id": met_id_from_name("POLICY_WATER_EFFICIENCY"), "weight": 0.05},
    {"metric_id": met_id_from_name("NATURAL_RESOURCE_USE_DIRECT"), "weight": 0.10},
    {"metric_id": met_id_from_name("ENERGYUSETOTAL"), "weight": 0.10},
    {"metric_id": met_id_from_name("PARTICULATE_MATTER_EMISSIONS"), "weight": 0.10},
    {"metric_id": met_id_from_name("NOXEMISSIONS"), "weight": 0.10},
    {"metric_id": met_id_from_name("RENEWENERGYPRODUCED"), "weight": 0.10},
    {"metric_id": met_id_from_name("SOXEMISSIONS"), "weight": 0.10},
    {"metric_id": met_id_from_name("TARGETS_EMISSIONS"), "weight": 0.05},
    {"metric_id": met_id_from_name("VOC_EMISSIONS_REDUCTION"), "weight": 0.05},
    {"metric_id": met_id_from_name("E_WASTE_REDUCTION"), "weight": 0.05},
  ],
}

framework3 = {
  "name": "TNFD",
  "categories": [
    {"category": "E", "weight": 1.0},
    {"category": "S", "weight": 0.0},
    {"category": "G", "weight": 0.0},
  ],
  "metrics": [
    {"metric_id": met_id_from_name("BIODIVERSITY_IMPACT_REDUCTION"), "weight": 0.10}, 
    {"metric_id": met_id_from_name("NATURAL_RESOURCE_USE_DIRECT"), "weight": 0.10},
    {"metric_id": met_id_from_name("LABELED_WOOD"), "weight": 0.05},
    {"metric_id": met_id_from_name("HAZARDOUSWASTE"), "weight": 0.10},
    {"metric_id": met_id_from_name("ENERGYUSETOTAL"), "weight": 0.10},
    {"metric_id": met_id_from_name("WASTETOTAL"), "weight": 0.10},
    {"metric_id": met_id_from_name("WASTE_RECYCLED"), "weight": 0.10},
    {"metric_id": met_id_from_name("RENEWENERGYPRODUCED"), "weight": 0.10},
    {"metric_id": met_id_from_name("TOXIC_CHEMICALS_REDUCTION"), "weight": 0.10},
    {"metric_id": met_id_from_name("WASTE_REDUCTION_TOTAL"), "weight": 0.10},
    {"metric_id": met_id_from_name("E_WASTE_REDUCTION"), "weight": 0.05},
  ],
}

frameworks = [framework1, framework2, framework3]

def framework_categories_metrics_helper(framework_id, c_weightings, m_weightings):
     # categories
    categories = ('E','S','G')
    qry = "INSERT INTO Category_Weightings (category, weight, framework_id) VALUES (%s, %s, %s);"
    for c in c_weightings:
        if c["category"] not in categories:
            raise Exception(f"All categories must be 'E', 'C', or 'G'")
        params = (c["category"], c["weight"] , framework_id)
        cursor.execute(qry, params)

    # metrics
    cursor.execute("SELECT id FROM Metrics;")
    metric_ids = set([r[0] for r in cursor.fetchall()])
    qry = "INSERT INTO Metric_Weightings (metric_id, weight, framework_id) VALUES (%s, %s, %s);"
    for m in m_weightings:
        if m["metric_id"] not in metric_ids:
            raise Exception(f"{m['metric_id']} is an invalid metric_id")

        params = (m["metric_id"], m["weight"] , framework_id)
        cursor.execute(qry,params)


def create_framework(framework):
  name = framework["name"]
  c_weightings = framework["categories"]
  m_weightings = framework["metrics"]

  query = '''INSERT INTO ESG_Frameworks (name, is_user_created)
          VALUES (%s, %s);'''
  values = (name, False)

  cursor.execute(query, values)
  framework_id = cursor.lastrowid

  framework_categories_metrics_helper(framework_id, c_weightings, m_weightings)

num = 1

for framework in frameworks:
    create_framework(framework)
    print(f"Added default framework {num}", flush=True)
    num += 1

###
### CLEANUP
###

print("Finished creating default frameworks", flush=True)

db.commit()

if cursor:
  cursor.close()
if db:
  db.close()