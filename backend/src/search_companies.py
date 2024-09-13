from mysql.connector import Error

from src.db_interface import get_db_connection, db_cleanup
from src.exceptions import InputError, DBError

ALPHABETICAL_SORT = 0
DESC_OBSERVATIONS_SORT = 1
ASC_OBSERVATIONS_SORT = 2
ALL_SORTS = [ALPHABETICAL_SORT, DESC_OBSERVATIONS_SORT, ASC_OBSERVATIONS_SORT]

def obtain_company_countries():
  """
  Obtains all the countries that some company is headquartered in.

  Arguments: No arguments.

  Exceptions: No exceptions raised.

  Returns: A list of countries.
  """
  try:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT DISTINCT country FROM Companies ORDER BY country;")

    res = cursor.fetchall()

    db_cleanup(conn, cursor)

    return [row[0] for row in res][1:]
  
  except Error as e:
    raise DBError(description=str(e))


def update_company_dict(company):
  """
  Given the current dictionary of company details, update it to match the required HTTP response format.

  Arguments:
      company (dict) - A dictionary of details for a company.

  Exceptions: No exceptions raised.

  Returns: The updated company dictionary.
  """

  company["isin_codes"] = []
  if company["industry"] is None:
    company["industry"] = ""

  return company

def obtain_companies_query_order_by(sort):
    """
    Returns the MySQL query string part based on the value of "sort" when querying for companies.

    Arguments:
        sort (int) - The sorting option provided by the user.

    Exceptions: No exceptions raised.

    Returns: A MySQL query string part for sorting.
    """

    if sort == ALPHABETICAL_SORT:
      return "ORDER BY name ASC"
    elif sort == DESC_OBSERVATIONS_SORT:
      return "ORDER BY nb_points_of_observations DESC"
    elif sort == ASC_OBSERVATIONS_SORT:
      return "ORDER BY nb_points_of_observations ASC"
    else:
      return "ORDER BY name ASC"
    
def create_db_tuple_section(search_query_escaped, headquarter_countries, industries):
  """
  Form part of the tuple for an SQL query for searching for companies based on the search query, the headquarter countries and the industries.

  Arguments:
    seach_query_escaped (string) - The escaped search query.
    headquarter_countries (list of strings) - The headquarter countries provided by the user.
    industries (string) - The industries provided by the user.
  
  Exceptions: No exceptions raised.

  Returns: A tuple section for the SQL query values.
  """
  values = None

  if len(headquarter_countries) > 0 and len(industries) > 0:
    values = (search_query_escaped,) + tuple(headquarter_countries) + tuple(industries)
  elif len(headquarter_countries) > 0 and len(industries) == 0:
    values = (search_query_escaped,) + tuple(headquarter_countries)
  elif len(headquarter_countries) == 0 and len(industries) > 0:
    values = (search_query_escaped,) + tuple(industries)
  else:
    values = (search_query_escaped,)
  
  return values

    
def search_companies(search_query, sort, headquarter_countries, industries, limit, offset):
  """
  Search for matching companies given a search query, headquarter countries and industries. Also sort
  the results according to the provided sort options and apply limits and offsets to the search results
  using the provided arguments.

  Arguments:
    search_query (string) - The search query entered by the user.
    sort (int) - The sorting option provided by the user.
    headquarter_countries (list of strings) - The headquarter countries provided by the user.
    industries (string) - The industries provided by the user.
    limit (int) - The upper limit provided by the user for companies to be returned.
    offset (int) - The offset provied by the user from which companies will be returned.

  Exceptions:
    InputError - Occurs when:
      - The value of sort is invalid.
      - The value of limit or offset is negative.

  Returns: A dictionary of the details of the matching companies.
  """

  if sort not in ALL_SORTS:
    raise InputError(description="The value of sort is invalid.")
  
  if limit < 0:
    raise InputError(description="The value of limit cannot be negative.")
  
  if offset < 0:
    raise InputError(description="The value of offset cannot be negative.")

  search_query = search_query.strip().lower()

  try:
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    search_query_escaped = f"%{search_query}%"
    countries_placeholder = ",".join(["%s"] * len(headquarter_countries))
    industries_placeholder = ",".join(["%s"] * len(industries))

    query = """
    SELECT perm_id, name, industry, country as headquarter_country, nb_points_of_observations
    FROM Companies
    WHERE
    LOWER(name) LIKE %s 
    """

    if len(headquarter_countries) > 0:
      query += (" AND country in (%s)" % countries_placeholder)
    
    if len(industries) > 0:
      query += (" AND industry in (%s)" % industries_placeholder)

    query += obtain_companies_query_order_by(sort)
    query += " LIMIT %s OFFSET %s "

    values = create_db_tuple_section(search_query_escaped, headquarter_countries, industries)
    values = values + (limit, offset)

    cursor.execute(query, values)

    res = cursor.fetchall()
    company_data = list(map(update_company_dict, res))
  
    db_cleanup(conn, cursor)

    return {
      "companies": company_data,
    }

  except Error as e:
    raise DBError(description=str(e))

def count_companies(search_query, headquarter_countries, industries):
  """
  Count the number of companies that match a search query, headquarter countries and the industries. 

  Arguments:
    search_query (string) - The search query entered by the user.
    sort (int) - The sorting option provided by the user.
    headquarter_countries (list of strings) - The headquarter countries provided by the user.
    industries (string) - The industries provided by the user.

  Exceptions: No exceptions raised.

  Returns: The number of companies that match the search query.
  """
  try:
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    search_query_escaped = f"%{search_query}%"
    countries_placeholder = ",".join(["%s"] * len(headquarter_countries))
    industries_placeholder = ",".join(["%s"] * len(industries))

    query = "SELECT COUNT(*) as count FROM Companies WHERE LOWER(name) LIKE %s"

    if len(headquarter_countries) > 0:
      query += " AND country in (%s)" % countries_placeholder
    
    if len(industries) > 0:
      query += " AND industry in (%s)" % industries_placeholder

    values = create_db_tuple_section(search_query_escaped, headquarter_countries, industries)
    
    cursor.execute(query, values)

    res = cursor.fetchone()
  
    db_cleanup(conn, cursor)

    return res

  except Error as e:
    raise DBError(description=str(e))
  
def obtain_company_details(company_id):
  """
  Obtains the details of a company given a company id.

  Arguments:
    company_id (int) - The id of the company.

  Exceptions: 
    Input Error - Occurs when the company id is invalid.

  Returns: A dictionary containing the company details.
  """
  try:
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    query = """
    SELECT
      name,
      industry,
      country as headquarter_country,
      nb_points_of_observations
    FROM Companies
    WHERE perm_id = %s
    """

    values = (company_id,)
    
    cursor.execute(query, values)

    res = cursor.fetchone()
    if not res:
      raise InputError(description="The company id provided is invalid.")
  
    db_cleanup(conn, cursor)

    if res["industry"] is None:
      res["industry"] = ""

    return res

  except Error as e:
    raise DBError(description=str(e))
  
def search_companies_comparison(search_query):
    """
    Obtain all companies that match a search query for comparison mode.

    Arguments:
      search_query (string) - The user's search query.

    Exceptions: No exceptions raised.

    Returns: A dictionary containing the company details.
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        query = """
        SELECT perm_id, name
        FROM Companies
        WHERE LOWER(name) LIKE %s
        ORDER BY name ASC
        LIMIT 3000
        """

        search_query = search_query.strip().lower()
        search_query_escaped = f"%{search_query.lower()}%"

        values = (search_query_escaped,)

        cursor.execute(query, values)

        res = cursor.fetchall()

        db_cleanup(conn, cursor)

        return [{"perm_id": str(row["perm_id"]), "name": row["name"]} for row in res]
    except Error as e:
        raise DBError(description=str(e)) 