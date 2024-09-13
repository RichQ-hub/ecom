import base64
from xhtml2pdf import pisa
from jinja2 import Environment
import io
import mysql.connector

try:
    import src.db_interface as db
    import src.scaled_scores as scores
except:
    import scaled_scores as scores

try:
    with open("src/templates/single_template.html") as f:
        template = Environment().from_string(f.read())
except:
    with open("templates/single_template.html") as f:
        template = Environment().from_string(f.read())

def get_scaled_scores(measures, cursor):
    """
    Obtain the scaled score for measures of certain metrics.

    Arguments:
        measures (list of dicts) - A list of measure values and their metric ids.
        cursor (MySQL cursor) - The current MySQL database cursor being used.

    Exceptions: No exceptions raised.

    Returns: No return value (updates the measures dictionary).
    """
    for m in measures:
        m["score"] = scores.find_scaled_value(cursor, m["value"], m["metric_id"])


def get_data(perm_id, year, is_test=False):
    """
    Obtains all the data required to generate the company PDF report.

    Arguments:
        perm_id (int) - The company id.
        year (int) - The year provided for the report.
        is_test (bool) - Whether we are in testing mode or not.

    Exceptions: 
        DatabaseInterfaceException: Occurs when the company id is invalid.

    Returns: Data required to generate the company PDF report.
    """
    if is_test:
        conn = mysql.connector.connect(host="localhost",user="root",password="23erf23",database="db")
    else:
        conn = db.get_db_connection()

    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT name, industry, country FROM Companies WHERE perm_id = %s", (perm_id,))
    x = cursor.fetchone()
    try:
        company_name = x["name"]
        industry = x["industry"]
        country = x["country"]
    except:
        raise db.DatabaseInterfaceException("Invalid Company id")
    
    qry = '''
    SELECT Metrics.id AS metric_id, Metrics.name AS name, Metrics.description AS description, 
        Metrics.category AS pillar,Measures.value AS value, Metrics.unit AS unit,
        Measures.disclosure AS disclosure, Companies.industry AS industry, 
        Companies.country as country
    FROM Measures JOIN Metrics ON Measures.metric_id = Metrics.id 
        JOIN Companies ON Measures.perm_id = Companies.perm_id
    WHERE Measures.perm_id = %s AND Measures.year = %s
    ORDER BY name;
    '''
    cursor.execute(qry, (perm_id,year))
    measures = cursor.fetchall()
    get_scaled_scores(measures,cursor)

    e,s,g = [],[],[]
    for r in measures:
        if r["pillar"] == 'E':
            e.append(r)
        if r["pillar"] == 'S':
            s.append(r)
        if r["pillar"] == 'G':
            g.append(r)

    return {"company_name": company_name, "e_metrics": e, "s_metrics": s, "g_metrics": g, 
            "industry": industry, "year": year, "country": country}


def generate_report(perm_id, year, is_test=False):
    """
    Generates a PDF report for the company.

    Arguments:
        perm_id (int) - The company id.
        year (int) - The year provided for the report.
        is_test (bool) - Whether we are in testing mode or not.

    Exceptions: No exceptions raised.

    Returns: A Base64-encoded PDF report.
    """
    args = get_data(perm_id, year, is_test)
    text = template.render(args)

    if is_test:
        print(text)
        with open("html.pdf","w+b") as file:
            pisa.CreatePDF(text, dest=file)
    else:
        pdf_buffer = io.BytesIO()
        pisa.CreatePDF(text, dest=pdf_buffer)
        encoded_pdf = base64.b64encode(pdf_buffer.getvalue()).decode('utf-8')
        return encoded_pdf

def company_years(company_id):
    """
    Returns the years for which a certain company has measures taken for metrics.

    Arguments:
        company_id (int) - The company id.

    Exceptions: 
        DatabaseInterfaceException - Occurs when no company with the provided id exists.

    Returns: A list of years.
    """
    conn = db.get_db_connection()
    cursor = conn.cursor()
    qry_check = "SELECT * FROM Companies WHERE perm_id = %s;"
    params = (company_id,)
    cursor.execute(qry_check,params)
    if not cursor.fetchall():
        raise db.DatabaseInterfaceException("No such company exists")

    qry = '''
    SELECT DISTINCT year
    FROM Companies JOIN Measures on Companies.perm_id = Measures.perm_id
    WHERE Companies.perm_id = %s
    ORDER BY year DESC;
    '''
    cursor.execute(qry,params)
    x = cursor.fetchall()
    return [n[0] for n in x]

if __name__ == "__main__":
    generate_report(4295888632, 2020, is_test=True)