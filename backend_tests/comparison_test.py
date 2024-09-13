import requests
import pytest
import random
import string

def check_comparison_reports(companies, metrics, year):
    url_excel = "http://localhost:5555/comparison/report/excel"
    url_pdf = "http://localhost:5555/comparison/report/pdf"
    json = {
        "companies": companies, 
        "metrics": metrics,
        "year": year,
    }

    response_excel = requests.post(url_excel, json=json)
    response_pdf = requests.post(url_pdf, json=json)

    assert response_excel.status_code == 200
    assert response_pdf.status_code == 200

    excel_json = response_excel.json()
    pdf_json = response_pdf.json()

    assert "encoded_excel" in excel_json
    assert "filename" in excel_json

    assert "encoded_pdf" in pdf_json
    assert "filename" in pdf_json 

def test_comparison():
    response = requests.post (
        url = "http://localhost:5555/comparison/companies",
        json = {
            "companies":[4295857460, 4295857695],
            "metrics":[6,10,65],
            "year":2020
        }
    )
    assert response.status_code == 200

    x = response.json()
    assert x.get("comparison")
    comparison = x["comparison"]
    
    assert len(comparison) == 2
    assert comparison[0]["name"] == "Newcrest Mining Ltd"
    assert comparison[1]["name"] == "Computershare Ltd"
    
    metrics_names = ["HUMAN_RIGHTS_VIOLATION_PAI", "GLOBAL_COMPACT", "AIRPOLLUTANTS_INDIRECT"]
    pillars = ["S","G","E"]
    units = ["Number of breaches","Yes/No","USD (000)"]
    values = [[None,0,52399100], [None,0,6047750]]

    for i in (0,1):
        assert comparison[i].get("metrics")
        metrics = comparison[i]["metrics"]

        assert [m["unit"] for m in metrics] == units
        assert [m["pillar"] for m in metrics] == pillars
        assert [m["metric_name"] for m in metrics] == metrics_names
        assert [m["value"] for m in metrics] == values[i]
        
def test_comparison_reports():
    companies = [4295857460, 4295857695]
    metrics = [6,10,65]
    year = 2020

    check_comparison_reports(companies, metrics, year)