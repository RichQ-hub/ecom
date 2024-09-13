from mysql.connector import Error

from src.db_interface import get_db_connection, db_cleanup
from src.exceptions import DBError

def comparison(companies, metrics, year):
    """
    Outputs a comparison of companies for certain metrics and a given year.

    Arguments:
        companies (list of ints) - The list of company ids.
        metrics (list of ints) - The list of metric ids.
        year (int) - The provided year.

    Exceptions:
        DBError - Occurs when there is an issue with executing the SQL queries.

    Returns: A list of dictionaries of company data for each metric.
    """
    try:
      conn = get_db_connection()
      cursor = conn.cursor(dictionary=True)

      company_metrics = []
      for perm_id in companies:
          cursor.execute("SELECT name FROM Companies WHERE perm_id = %s", (perm_id,))
          name = cursor.fetchone()["name"]

          company = {"perm_id": str(perm_id), "name": name, "metrics": []}

          for metric_id in metrics:
              cursor.execute("SELECT name, category, unit FROM Metrics WHERE id = %s", (metric_id,))
              result = cursor.fetchone()

              metric = {"metric_id": str(metric_id), "metric_name": result["name"], "pillar": result["category"], "unit": result["unit"]}

              qry = "SELECT value FROM Measures WHERE metric_id = %s and perm_id = %s and year = %s"
              cursor.execute(qry, (metric_id, perm_id, year))
              value_result = cursor.fetchone()

              if value_result:
                  metric["value"] = value_result["value"]
              else:
                  metric["value"] = None

              company["metrics"].append(metric)

          company_metrics.append(company)
      
      db_cleanup(conn, cursor)
      
      return company_metrics
    except Error as e:
      raise DBError(description=str(e))
