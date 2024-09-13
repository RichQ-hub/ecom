from mysql.connector import Error

from src.db_interface import get_db_connection, db_cleanup
from src.exceptions import DBError
from src.scaled_scores import find_scaled_value

def create_measurement_dict(cursor, tup):
  """
  Given an SQL query tuple, return a dictionary of the details for for a measurement.

  Arguments:
    tup (SQL query tuple) - The SQL query tuple.
  
  Exceptions: No exceptions raised.

  Returns: A dictionary of details for the measurement.
  """

  reported_date = ""

  if tup["reported_date"]:
    reported_date = tup["reported_date"].strftime("%Y-%m-%d %H:%M:%S")
  
  metric_id = tup["metric_id"]
  value = tup["value"]

  return {
    "measure_id": tup["measure_id"],
    "value": value,
    "reported_date": reported_date,
    "metric_year": tup["metric_year"],
    "disclosure": tup["disclosure"],
    "scaled_value": find_scaled_value(cursor, value, metric_id)
  }

def create_metric_dict(tup):
  """
  Given an SQL query tuple, return a dictionary of the details for the metric.

  Arguments:
    tup (SQL query tuple) - The SQL query tuple.
  
  Exceptions: No exceptions raised.

  Returns: A dictionary of details for the metric.
  """
  return {
    "metric_id": tup["metric_id"],
    "name": tup["name"],
    "description": tup["description"],
    "pillar": tup["pillar"],
    "data_provider": tup["data_provider"],
    "unit": tup["unit"],
    "measurements": [],
  }


def group_results_by_metric(cursor, res):
  """
  Group the query results for company measurements by metric.

  Arguments:
    res (list of SQL query tuples) - The list of company measures.
  
  Exceptions: No exceptions raised.

  Returns: A list where each element is a dictionary of details for each metric and contained in each
  dictionary is a list of measures for that metric.
  """
  metrics_list = []
  curr_index = -1

  for tup in res:
    if curr_index == -1:
      metric_dict = create_metric_dict(tup)
      curr_index = 0
      metrics_list.append(metric_dict)
    elif metrics_list[curr_index]["metric_id"] != tup["metric_id"]:
      # Start a new metric element.
      metric_dict = create_metric_dict(tup)
      curr_index += 1
      metrics_list.append(metric_dict)
    
    measurement_dict = create_measurement_dict(cursor, tup)
    metrics_list[curr_index]["measurements"].append(measurement_dict)
  
  return {
    "metrics": metrics_list,
  }

def company_single_mode(category, company_id):
  """
  Output a list of all metrics for a given company.

  Arguments:
    company_id (int) - The perm id of the company.  

  Exceptions: No exceptions raised.

  Returns: The list of dictionaries of the metrics for the given company.
  """

  try:
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    # NOTE - Ordering query results by metric id to make grouping easier.
    query = """
    SELECT
      ms.id as measure_id,
      ms.value as value,
      ms.reported_date as reported_date,
      ms.year as metric_year,
      ms.disclosure as disclosure,
      met.id as metric_id,
      met.name as name,
      met.description as description,
      met.category as pillar,
      met.data_provider as data_provider,
      met.unit as unit
    FROM Measures ms
    INNER JOIN Metrics met on ms.metric_id = met.id
    WHERE ms.perm_id = %s AND BINARY LOWER(met.category) = BINARY LOWER(%s)
    ORDER BY met.name, ms.year
    """

    values = (company_id, category)

    cursor.execute(query, values)

    res = cursor.fetchall()
  
    metrics_data = group_results_by_metric(cursor, res)

    db_cleanup(conn, cursor)

    return metrics_data


  except Error as e:
    raise DBError(description=str(e))