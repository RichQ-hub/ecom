import mysql.connector
import base64
from fpdf import FPDF, FontFace
import xhtml2pdf

try:
    import src.db_interface as db
    import src.scaled_scores as scores
except:
    import scaled_scores as scores

def get_scaled_scores(measures, cursor):
    for m in measures:
        m["score"] = scores.find_scaled_value(cursor, m["value"], m["metric_id"])

def get_data(perm_id, year, is_test=False):
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
    data = get_data(perm_id, year, is_test=True) if is_test else get_data(perm_id, year)
    
    pdf = FPDF()
    pdf.add_page()

    if is_test:
        pdf.add_font('Roboto', '', "/Users/rummanrauf/Library/Fonts/Roboto-Regular.ttf")
        pdf.add_font('Roboto', 'b', "/Users/rummanrauf/Library/Fonts/Roboto-Bold.ttf")
        pdf.add_font('Roboto', 'i', "/Users/rummanrauf/Library/Fonts/Roboto-Italic.ttf")
        pdf.add_font('Roboto', 'bi', "/Users/rummanrauf/Library/Fonts/Roboto-BoldItalic.ttf")
    else:
        pdf.add_font('Roboto', '', "/usr/share/fonts/truetype/Roboto-Regular.ttf")
        pdf.add_font('Roboto', 'b', "/usr/share/fonts/truetype/Roboto-Bold.ttf")
        pdf.add_font('Roboto', 'i', "/usr/share/fonts/truetype/Roboto-Italic.ttf")
        pdf.add_font('Roboto', 'bi', "/usr/share/fonts/truetype/Roboto-BoldItalic.ttf")
    

    pdf.set_font(family="Roboto", style="", size=40)
    pdf.write(text="ESG Report For:\n")
    pdf.write(text=data["company_name"] + "\n\n")

    pdf.set_font(family="Roboto", style="", size=13)
    pdf.write(text=f'Industry: {data["industry"]}\n\n')
    pdf.write(text=f'Year: {data["year"]}\n')

    pdf.write(text="\nThis ESG (Environmental, Social, and Governance) report provides a comprehensive overview of the company's performance and initiatives in three key areas: environmental sustainability, social responsibility, and corporate governance. It aims to inform stakeholders, including investors, customers, and regulators, about the company's impact and efforts in these areas, often highlighting both achievements and areas for improvement.")
    
    e = ("Environmental Metrics\n", "\nThe environmental pillar evaluates how a company impacts and manages the natural environment. It includes factors such as climate change policies, carbon footprint, and greenhouse gas emissions. Companies are assessed on their energy efficiency, use of renewable resources, and initiatives to reduce waste and pollution. Environmental considerations also cover how companies manage their water usage, biodiversity conservation, and their overall contribution to sustainability.\n\n", "e_metrics")
    s = ("Social Metrics\n", "\nThe social pillar examines how a company manages relationships with employees, suppliers, customers, and the communities in which it operates. This includes labor practices, employee health and safety, diversity and inclusion, and human rights. Social criteria also consider a company’s impact on the local community, product safety, and customer satisfaction. Companies are expected to foster positive relationships and contribute to the well-being of their stakeholders.\n\n", "s_metrics")
    g = ("Governance Metrics\n", "\nThe governance pillar involves the internal system of practices, controls, and procedures a company adopts to govern itself, make effective decisions, comply with the law, and meet the needs of external stakeholders. This includes board diversity and structure, executive compensation, transparency, ethics, and shareholder rights. Strong governance ensures accountability and helps prevent corruption and conflicts of interest, fostering long-term sustainability and trust with investors and the public.\n\n", "g_metrics")
    for x in (e,s,g):
        pdf.add_page()
        pdf.set_font(family="Roboto", style="bi", size=16)
        pdf.write(text=x[0])
        pdf.set_font(family="Roboto", style="", size=10)
        pdf.write(text=x[1])
        write_table(data[x[2]], pdf)

    if is_test:
        pdf.output("file.pdf")
    else:
        encoded_pdf = base64.b64encode(pdf.output()).decode('utf-8')
        return encoded_pdf
    

def write_table(metrics, pdf):
    pdf.set_font(family="Roboto", style="", size=9)
    
    headings_style = FontFace(emphasis="BOLD", fill_color=(232, 238, 246))
    metric_style = FontFace(emphasis="ITALICS")
    
    with pdf.table(headings_style=headings_style, text_align = "LEFT", line_height=4, col_widths=(70, 12, 11, 7)) as table:
        row = table.row()
        row.cell("Metric", padding= (1, 60))
        row.cell("Value", padding= (1, 6))
        row.cell("Unit", padding= (1, 6))
        row.cell("Score", padding= (1, 2))
        for metric in metrics:
            row = table.row()
            row.cell(f"{metric['name']} ({metric['metric_id']})\n{metric['description']}", padding= (1, 1), style=metric_style)
            row.cell(str(metric["value"]))
            row.cell(metric["unit"])
            row.cell(str(metric["score"]))


if __name__ == "__main__":
    generate_report(4295856049, 2020, is_test=True)


def company_years(company_id):
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