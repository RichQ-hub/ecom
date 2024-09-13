from mysql.connector import Error

from src.db_interface import get_db_connection, db_cleanup
from src.exceptions import DBError

def update_metric_dict(metric):
  """
  Given the current dictionary of metric details, add new keys to it to match the required HTTP response format.

  Arguments:
      metric (dict) - A dictionary of details for a metric.

  Exceptions: No exceptions raised.

  Returns: The updated metric dictionary.
  """

  metric["measures"] = []
  return metric

def obtain_all_metrics(category=None):
  """
  Obtains all metrics of a given category (if no category is provided then obtains all metrics).

  Arguments:
      category (string) - The category of metrics to be returned (can be None).

  Exceptions: No exceptions raised.

  Returns: A list of metrics.
  """

  try:
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    query = ""
    values = None

    if category is None:
      query = "SELECT id as metric_id, name, description, category as pillar, unit FROM Metrics"
      cursor.execute(query)
    else:
      query = """
      SELECT
        id as metric_id, name, description, category as pillar, unit
      FROM Metrics
      WHERE BINARY LOWER(category) = BINARY LOWER(%s)
      """
      values = (category,)
      cursor.execute(query, values)

    res = cursor.fetchall()
    metrics_data = list(map(update_metric_dict, res))

    db_cleanup(conn, cursor)

    return {
      "metrics": metrics_data,
    }

  except Error as e:
    raise DBError(description=str(e))


def obtain_metrics_alphabetical():
  """
  Obtains all metrics and returns them in alphabetical order.

  Arguments: No arguments.

  Exceptions: No exceptions raised.

  Returns: A list of all the metrics in alphabetical order.
  """
  try:
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    query = "SELECT id as metric_id, name as metric_name, description, category as pillar, unit FROM Metrics ORDER BY name;"
    cursor.execute(query)
    metrics_data = cursor.fetchall()
  
    db_cleanup(conn, cursor)

    return {
      "metrics": metrics_data,
    }
  except Error as e:
    raise DBError(description=str(e))

