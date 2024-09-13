from flask import Flask, request
from flask_cors import CORS
from json import dumps

from src.db_interface import DatabaseConnectionException, DatabaseInterfaceException

from src.exceptions import InputError, AccessError

from src.auth import auth_register, auth_login, auth_profile, auth_reset_password, auth_delete_account
from src.auth import check_token_valid

from src.industries import obtain_industries
from src.obtain_metrics import obtain_all_metrics, obtain_metrics_alphabetical

from src.search_companies import search_companies, count_companies, obtain_company_details
from src.search_companies import search_companies_comparison, obtain_company_countries

from src.single_mode import company_single_mode
import src.pdf_report_single as pdf_single
import src.excel_report_single as excel_single

from src.comparison_mode import comparison
import src.pdf_report_comp as pdf_comp
import src.excel_report_comp as excel_comp

import src.frameworks as frameworks

def defaultHandler(err):
    response = err.get_response()
    print("response", err, err.get_response())
    response.data = dumps({
        "code": err.code,
        "name": "System Error",

        # Remove paragraph tags from the beginning and end
        "message": err.get_description().replace("<p>", "").replace("</p>", ""),
    })
    response.content_type = 'application/json'
    return response

app = Flask(__name__)

app.config["DEBUG"] = True

CORS(app, resources={r"/*": {"origins": "*"}}) 

app.config["TRAP_HTTP_EXCEPTIONS"] = True
app.register_error_handler(Exception, defaultHandler)   


#################################### HELPER FUNCTIONS ####################################

def obtain_auth_token(request):
    """
    Obtain the authentication token from the HTTP request.
    """
    auth_header = request.headers.get("Authorization")

    if not auth_header or not auth_header.startswith("Bearer "):
        raise AccessError("No token or invalid token format")
    
    _, token = auth_header.split(' ', 1)

    return token

#################################### ROUTES ####################################

### AUTHENTICATION ###

@app.route("/auth/register", methods=["POST"])
def register():
    """
    Registers a new account for a user with email, name and password.
    """
    email = request.json["email"]
    name = request.json["name"]
    password = request.json["password"]

    res = auth_register(name, email, password)

    return dumps(res)

@app.route("/auth/login", methods=["POST"])
def login():
    """
    Logs in a user using their email and password.
    """
    email = request.json["email"]
    password = request.json["password"]

    res = auth_login(email, password)

    return dumps(res)

@app.route("/auth/profile", methods=["GET"])
def profile():
    """
    Obtains user profile information.
    """
    token = obtain_auth_token(request)
    user_id = check_token_valid(token)["user_id"]
    
    res = auth_profile(user_id)

    return dumps(res)

@app.route("/auth/reset_password", methods=["POST"])
def reset_password():
    """
    Resets a user's password.
    """
    email = request.json["email"]
    old_password = request.json["old_password"]
    new_password = request.json["new_password"]

    res = auth_reset_password(email, old_password, new_password)

    return dumps(res)

@app.route("/auth/delete_account", methods=["POST"])
def delete_account():
    """
    Deletes a user's account.
    """
    token = obtain_auth_token(request)
    user_id = check_token_valid(token)["user_id"]

    res = auth_delete_account(user_id)

    return dumps(res)

### COMPANIES AND SINGLE MODE ###

@app.route("/companies", methods=["GET"])
def companies():
    """
    Obtains the companies matching a user's search parameters (search text, countries, industries).
    """
    search_query = request.args.get("search_query")
    
    sort = request.args.get("sort", type=int)
    if not sort:
        sort = 0

    headquarter_countries = request.args.getlist("country")
    if not headquarter_countries:
        headquarter_countries = []

    industries = request.args.getlist("industry")
    if not industries:
        industries = []

    LIMIT = 50
    
    page_num = request.args.get("offset", type=int)
    offset = page_num * LIMIT

    res = search_companies(search_query, sort, headquarter_countries, industries, LIMIT, offset)

    return dumps(res)

@app.route("/companies/count", methods=["GET"])
def companies_count():
    """
    Counts the number of companies matching a user's search parameters (search text, countries, industries).
    """
    search_query = request.args.get("search_query")
    
    headquarter_countries = request.args.getlist("country")
    if not headquarter_countries:
        headquarter_countries = []

    industries = request.args.getlist("industry")
    if not industries:
        industries = []

    res = count_companies(search_query, headquarter_countries, industries)

    return dumps(res)

@app.route("/companies/countries", methods=["GET"])
def company_countries():
    """
    Obtains all the countries that at least one company is headquartered in.
    """
    return dumps({"countries": obtain_company_countries()})

@app.route("/companies/<int:company_id>", methods=["GET"])
def company_details(company_id):
    """
    Obtains the details of a specific company.
    """
    res = obtain_company_details(company_id)
    return dumps(res)

@app.route("/companies/report/pdf/<int:perm_id>/<int:year>", methods=["GET"])
def pdf_report(perm_id, year):
    """
    Outputs a Base64-encoded PDF ESG report for a company for a given year.
    """
    try:
        encoded_pdf = pdf_single.generate_report(perm_id, year)
    except DatabaseConnectionException:
        raise AccessError("Could not connect to database")
    except DatabaseInterfaceException as e:
        raise InputError(description=str(e))
    
    return dumps({"encoded_pdf": encoded_pdf, "filename": f"company_report_{perm_id}_{year}.pdf"})

@app.route("/companies/report/excel/<int:perm_id>/<int:year>", methods=["GET"])
def excel_report(perm_id, year):
    """
    Outputs a Base64-encoded Excel ESG report for a company for a given year.
    """
    res = excel_single.generate_report(perm_id, year)
    return dumps(res)

@app.route("/companies/report/years/<int:company_id>", methods=["GET"])
def report_years(company_id):
    """
    Obtains a list of years for which PDF or Excel reports for a specific company can be downloaded.
    """
    try:
        years = pdf_single.company_years(company_id)
    except DatabaseConnectionException:
        raise AccessError("Could not connect to database")
    except DatabaseInterfaceException as e:
        raise InputError(description=str(e))
    return dumps({"years": years})

### INDUSTRIES ### 

@app.route("/industries", methods=["GET"])
def industries():
    """
    Obtains all the industries that at least one company belongs to.
    """
    res = obtain_industries()
    return dumps(res)

### METRICS ###

@app.route("/metrics", methods=["GET"])
def obtain_metrics():
    """
    Obtains all the ESG metrics that are evaluated.
    """
    res = obtain_metrics_alphabetical()
    return dumps(res)

@app.route("/metrics/<string:category>", methods=["GET"])
def obtain_metrics_by_category(category):
    """
    Obtains all the metrics belonging to a specific category (E, S or G).
    """
    res = obtain_all_metrics(category)
    return dumps(res)

@app.route("/metrics/<int:company_id>/<string:category>", methods=["GET"])
def company_metrics(category, company_id):
    """
    Obtains all the measures for a company for metrics belonging to a specific category.
    """
    res = company_single_mode(category, company_id)
    return dumps(res)

### COMPARISON MODE ###

@app.route("/comparison/companies", methods=["POST"])
def comparison_mode():
    """
    Outputs comparison data between different companies across specific metrics over a provided year.
    """
    companies = request.json["companies"]
    metrics = request.json["metrics"]
    year = request.json["year"]

    return dumps({"comparison": comparison(companies, metrics, year)})

@app.route("/comparison/search", methods=["GET"])
def comparison_search_companies():
    """
    Outputs companies matching a search query for comparison mode.
    """
    search_query = request.args.get("search_query")

    res = search_companies_comparison(search_query)

    return dumps({"companies": res})

@app.route("/comparison/report/pdf/", methods=["POST"])
def comparison_pdf():
    """
    Outputs a Base64-encoded PDF ESG report for comparison data for several companies.
    """
    companies = request.json["companies"]
    metrics = request.json["metrics"]
    year = request.json["year"]

    try:
        encoded_pdf = pdf_comp.generate_report(companies,metrics,year)
    except DatabaseConnectionException:
        raise AccessError("Could not connect to database")
    except DatabaseInterfaceException as e:
        raise InputError(description=str(e))
    
    return dumps({"encoded_pdf": encoded_pdf, "filename": f"comparison_report_{year}.pdf"})

@app.route("/comparison/report/excel/", methods=["POST"])
def comparison_excel():
    """
    Outputs a Base64-encoded Excel ESG report for comparison data for several companies.
    """
    companies = request.json["companies"]
    metrics = request.json["metrics"]
    year = request.json["year"]

    res = excel_comp.generate_report(companies, metrics, year)
    return dumps(res)

### FRAMEWORKS ###

@app.route("/framework/create", methods=["POST"])
def create_framework():
    """
    Creates a framework given a framework name, category weightings and metric weightings.
    """
    token = obtain_auth_token(request)
    user_id = check_token_valid(token)["user_id"]

    name = request.json["name"]
    c_weightings = request.json["categories"]
    m_weightings = request.json["metrics"]

    try:
        framework_id = frameworks.create_framework(user_id, name, c_weightings, m_weightings)
    except DatabaseInterfaceException as e:
        raise InputError(description=str(e))
    
    return dumps({"framework_id": framework_id})
    

@app.route("/framework/remove/<int:framework_id>", methods=["DELETE"])
def remove_framework(framework_id):
    """
    Removes a framework of a given id.
    """
    token = obtain_auth_token(request)
    user_id = check_token_valid(token)["user_id"]

    try:
        frameworks.remove_framework(user_id, framework_id)
    except DatabaseConnectionException:
        raise AccessError("Could not connect to database")
    except DatabaseInterfaceException as e:
        raise InputError(description=str(e))
    
    return dumps({})
    

@app.route("/framework/list-all", methods=["GET"])
def list_frameworks():
    """
    Lists all the default frameworks and frameworks created by a specific user.
    """
    token = obtain_auth_token(request)
    user_id = check_token_valid(token)["user_id"]

    search_query = request.args.get("search_query")
    if search_query == None:
        search_query = ""

    try:
        f = frameworks.list_frameworks(user_id, search_query)
    except DatabaseConnectionException:
        raise AccessError("Could not connect to database")
    except DatabaseInterfaceException as e:
        raise InputError(description=str(e))
    
    return dumps({"frameworks": f})


@app.route("/framework/update/<int:framework_id>", methods=["PUT"])
def update_framework(framework_id):
    """
    Updates the details of a specific framework (name, category weightings, metric weightings).
    """
    token = obtain_auth_token(request)
    user_id = check_token_valid(token)["user_id"]

    name = request.json["name"]
    c_weightings = request.json["categories"]
    m_weightings = request.json["metrics"]
    
    try:
        frameworks.update_framework(user_id, framework_id, name, c_weightings, m_weightings)
    except DatabaseConnectionException:
        raise AccessError("Could not connect to database")
    except DatabaseInterfaceException as e:
        raise InputError(description=str(e))
    
    return dumps({})


@app.route("/framework/update_view/<int:framework_id>", methods = ["GET"])
def update_view(framework_id):
    """
    Obtains the category and metric weightings of a framework.
    """
    token = obtain_auth_token(request)
    user_id = check_token_valid(token)["user_id"]
    
    try:
        result = frameworks.get_framework_weightings(framework_id, user_id) | {"token": token}
    except DatabaseConnectionException:
        raise AccessError("Could not connect to database")
    except DatabaseInterfaceException as e:
        raise InputError(description=str(e))
    
    return dumps(result)

@app.route("/framework/fork/<int:framework_id>", methods=["POST"])
def fork_framework(framework_id):
    """
    Forks an existing framework.
    """
    token = obtain_auth_token(request)
    user_id = check_token_valid(token)["user_id"]

    name = request.json["name"]

    try:
        frameworks.fork(user_id, framework_id, name)
    except DatabaseConnectionException:
        raise AccessError("Could not connect to database")
    except DatabaseInterfaceException as e:
        raise InputError(description=str(e))
    
    return dumps({})

### ESG SCORES ###

@app.route("/framework/scores/<int:framework_id>/<int:company_id>", methods=["GET"])
def framework_scores(framework_id, company_id):
    """
    Obtain the ESG scores for a company using a given framework.
    """
    token = obtain_auth_token(request)
    user_id = check_token_valid(token)["user_id"]

    res = frameworks.obtain_framework_scores(user_id, framework_id, company_id)

    return dumps(res) 

@app.route("/framework/livescores/<int:framework_id>/<int:company_id>", methods=["GET"])
def live_framework_scores(framework_id, company_id):
    """
    Obtain the recent and previous years' scores for a company using a given framework.
    """
    token = obtain_auth_token(request)
    user_id = check_token_valid(token)["user_id"]

    res = frameworks.framework_scores_by_year(framework_id, company_id, user_id)

    return dumps(res)


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
