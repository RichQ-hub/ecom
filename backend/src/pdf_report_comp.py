import base64
from xhtml2pdf import pisa
from jinja2 import Environment
import io
import mysql.connector
import json


try:
    import src.db_interface as db
    import src.scaled_scores as scores
except:
    import scaled_scores as scores

try:
    with open("src/templates/compare_template.html") as f:
        template = Environment().from_string(f.read())
except:
    with open("templates/compare_template.html") as f:
        template = Environment().from_string(f.read())

def get_data(perm_ids, metric_ids, year, is_test=False):
    """
    Obtains all the data required to generate the comparison PDF report.

    Arguments:
        perm_ids (list of ints) - A list of company ids.
        metric_ids (list of ints) - A list of metric ids.
        year (int) - The year provided for the comparison.
        is_test (bool) - Whether we are in testing mode or not.

    Exceptions: No exceptions raised.

    Returns: Data required to generate the comparison PDF report.
    """
    if is_test:
        conn = mysql.connector.connect(host="localhost",user="root",password="23erf23",database="db")
    else:
        conn = db.get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    company_data = {}
    for p in perm_ids:
        cursor.execute("SELECT name, industry FROM Companies WHERE perm_id = %s;", (p,));
        company_data[p] = cursor.fetchone() 
    
    metric_qry = "SELECT name, description, unit, category FROM  Metrics WHERE id = %s"
    value_qry = "SELECT value FROM Measures WHERE perm_id = %s and metric_id = %s and year = %s;"
    metrics = []
    for m in metric_ids:
        cursor.execute(metric_qry, (m,))
        metric = cursor.fetchone()

        companies = []
        for p in perm_ids:
            value_params = (p,m,year)
            cursor.execute(value_qry,value_params)
            result = cursor.fetchone()
            if not result:
                result = {"value": "-", "score": "-"}
            else:
                result = result | {"score": scores.find_scaled_value(cursor, result["value"], m)}

            company = company_data[p] | result
            companies.append(company)

        metric["companies"] = companies
        metrics.append(metric)

    e,s,g = [],[],[]
    for r in metrics:
        if r["category"] == 'E':
            e.append(r)
        if r["category"] == 'S':
            s.append(r)
        if r["category"] == 'G':
            g.append(r)

    return {"e_metrics": e, "s_metrics": s, "g_metrics": g, "year": year, "companies": company_data.values()}

def generate_report(perm_ids, metric_ids, year, is_test=False):
    """
    Generates a PDF report for the company comparison.

    Arguments:
        perm_ids (list of ints) - A list of company ids.
        metric_ids (list of ints) - A list of metric ids.
        year (int) - The year provided for the comparison.
        is_test (bool) - Whether we are in testing mode or not.

    Exceptions: No exceptions raised.

    Returns: A Base64-encoded PDF report.
    """
    args = get_data(perm_ids, metric_ids, year, is_test)
    text = template.render(args)

    if is_test:
        with open("compare.pdf","w+b") as file:
            pisa.CreatePDF(text,dest=file)
    else:
        pdf_buffer = io.BytesIO()
        pisa.CreatePDF(text, dest=pdf_buffer)
        encoded_pdf = base64.b64encode(pdf_buffer.getvalue()).decode('utf-8')
        return encoded_pdf

if __name__ == "__main__":
    generate_report([4295888632,4295889096,4295888496,4295894791,5048024162], [57,24,25,38,2,83,70,60], 2020, is_test=True)
