import pandas as pd
import base64 
import os

from mysql.connector import Error

from src.db_interface import get_db_connection, db_cleanup
from src.exceptions import DBError
from src.scaled_scores import find_scaled_value

HEADINGS = ["Company", "Industry", "Metric Name", "Metric Description", "Pillar", "Measure Year", "Raw Value", "Unit", "ESG Score"]

def create_row_tuple(cursor, row_dict):
  """
  Create a row tuple for the company Excel document using the current MySQL row dictionary output for
  a company measure for some metric.

  Arguments:
    cursor (MySQL cursor) - The current cursor for MySQL (Must have dictionary=True set).
    row_dict (dictionary) - The current MySQL row dictionary for a company measure for some metric.

  Exceptions: No exceptions raised.

  Returns: A row tuple for the company Excel document.
  """

  scaled_value = find_scaled_value(cursor, row_dict["value"], row_dict["metric_id"])

  if row_dict["industry"] is None:
     row_dict["industry"] = ""

  return [
     row_dict["company"],
     row_dict["industry"],
     row_dict["metric_name"],
     row_dict["metric_description"],
     row_dict["pillar"],
     row_dict["year"],
     row_dict["value"],
     row_dict["unit"],
     scaled_value,
  ]

def generate_report(perm_id, year):
  """
  Create an Excel company report for all the measures taken for each metric over a given year.

  Arguments:
    perm_id (int) - The company id provided by the user.
    year (int) - The year provided by the user.

  Exceptions: No exceptions raised.

  Returns: A base64-encoded Excel file that contains the company report.
  """
  try:
    conn = get_db_connection()

    cursor = conn.cursor(dictionary=True)

    query = """
    SELECT 
      cp.name as company, 
      cp.industry as industry, 
      met.name as metric_name, 
      met.id as metric_id,
      met.description as metric_description, 
      met.category as pillar,
      ms.year as year,
      ms.value as value,
      met.unit as unit
    FROM Measures ms
    JOIN Metrics met on ms.metric_id = met.id
    JOIN Companies cp on ms.perm_id = cp.perm_id
    WHERE ms.perm_id = %s AND ms.year = %s
    ORDER BY met.name
    """

    values = (perm_id, year)
    
    cursor.execute(query, values)

    res = cursor.fetchall()
    company_data = list(map(lambda tup : create_row_tuple(cursor, tup), res))

    df = pd.DataFrame(company_data, columns=HEADINGS)

    filename = f"company_report_{perm_id}_{year}.xlsx"

    df.to_excel(filename, index=False)

    encoding = ""

    with open(filename, "rb") as f:
       contents = f.read()
       encoding = base64.b64encode(contents).decode('utf-8')
    
    os.remove(filename)

    db_cleanup(conn, cursor)

    return {
       "filename": filename,
       "encoded_excel": encoding,
    }

  except Error as e:
    raise DBError(description=str(e))


if __name__ == "__main__":
    pass