import pandas as pd
import base64 
import os

from src.comparison_mode import comparison

HEADINGS = ["Metric Name", "Pillar", "Unit", "Year", "Company", "Value"]

def generate_report(companies, metrics, year):
  """
  Create an Excel report for comparison mode.

  Arguments:
    companies (List of ints) - List of company ids.
    metrics (List of ints) - List of metric ids.
    year (int) - The year.

  Exceptions: No exceptions raised.

  Returns: A base64-encoded Excel file that contains the Excel report.
  """
  comparison_data = comparison(companies, metrics, year)
  rows = []

  for company in comparison_data:
    company_name = company["name"]
    company_metrics = company["metrics"]

    for metric in company_metrics:
      metric_name = metric["metric_name"]
      pillar = metric["pillar"]
      unit = metric["unit"]
      value = metric["value"]
      
      row = [metric_name, pillar, unit, year, company_name, value]
      rows.append(row)
  
  df = pd.DataFrame(rows, columns=HEADINGS)

  filename = f"comparison_report_{year}.xlsx"

  df.to_excel(filename, index=False)

  encoding = ""

  with open(filename, "rb") as f:
      contents = f.read()
      encoding = base64.b64encode(contents).decode('utf-8')
  
  os.remove(filename)

  return {
      "filename": filename,
      "encoded_excel": encoding,
  }