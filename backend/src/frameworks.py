from mysql.connector import Error
from datetime import datetime
import src.db_interface as db

from src.exceptions import DBError, AccessError, InputError
from src.scaled_scores import find_scaled_value, industry_mean_for_category

def framework_categories_metrics_helper(cursor, framework_id, c_weightings, m_weightings):
    """
    Helper function for creating / updating a framework given a user, framework name, category weightings and metric weightings.

    Arguments:
        cursor (MySQL cursor) - The current cursor for MySQL (Must have dictionary=True set).
        framework_id (int) - The id of the framework.
        c_weightings (list of dicts) - The category weightings.
        m_weightings (list of dicts) - The metric weightings.

    Exceptions: 
        DatabaseInterfaceException - Occurs when:
            - The format of the category or metric weights is incorrect.

    Returns: No return value.
    """
    categories = ('E','S','G')

    delete_qry = "DELETE FROM Category_Weightings WHERE framework_id = %s;"
    cursor.execute(delete_qry, (framework_id,))
    
    insert_qry = "INSERT INTO Category_Weightings (category, weight, framework_id) VALUES (%s, %s, %s);"
    for c in c_weightings:
        if c["category"] not in categories:
            raise db.DatabaseInterfaceException(f"All categories must be 'E', 'S', or 'G'")
        params = (c["category"], c["weight"] , framework_id)
        cursor.execute(insert_qry, params)

    cursor.execute("SELECT id FROM Metrics;")
    metric_ids = set([r["id"] for r in cursor.fetchall()])

    delete_qry = "DELETE FROM Metric_Weightings WHERE framework_id = %s;"
    cursor.execute(delete_qry, (framework_id,))

    insert_qry = "INSERT INTO Metric_Weightings (metric_id, weight, framework_id) VALUES (%s, %s, %s);"
    for m in m_weightings:
        if m["metric_id"] not in metric_ids:
            raise db.DatabaseInterfaceException(f"{m['metric_id']} is an invalid metric_id")
        params = (m["metric_id"], m["weight"] , framework_id)
        cursor.execute(insert_qry, params)


def create_framework(user_id, name, c_weightings, m_weightings):
    """
    Creates a framework given a user, framework name, category weightings and metric weightings.

    Arguments:
        user_id (int) - The id of the user.
        name (string) - The name of the framework.
        c_weightings (list of dicts) - The category weightings.
        m_weightings (list of dicts) - The metric weightings.

    Exceptions: 
        DatabaseInterfaceException - Occurs when:
            - A framework with the provided name already exists.

    Returns: The id of the new framework.
    """
    conn = db.get_db_connection()
    cursor = conn.cursor(dictionary=True)
    dt = datetime.now()

    # Check if framework name is already taken.
    qry = '''
        SELECT * 
        FROM ESG_Frameworks
        WHERE name = %s AND (user_id = %s OR is_user_created = false);
    '''
    params = (name, user_id)
    cursor.execute(qry, params)
    if cursor.fetchall():
        raise db.DatabaseInterfaceException(f"ESG Framework with name '{name}' already exists")

    params = (user_id, name, True, dt, dt)
    qry = '''INSERT INTO ESG_Frameworks (user_id, name, is_user_created, date_created, date_last_updated)
            VALUES (%s, %s, %s, %s, %s);'''
    cursor.execute(qry, params)
    framework_id = cursor.lastrowid

    framework_categories_metrics_helper(cursor, framework_id, c_weightings, m_weightings)

    conn.commit()
    cursor.close()
    conn.close()
    return framework_id


def update_framework(user_id, framework_id, name, c_weightings, m_weightings):
    """
    Updates a framework given a user, framework id and name, category weightings and metric weightings.

    Arguments:
        user_id (int) - The id of the user.
        framework_id (int) - The id of the framework.
        name (string) - The name of the framework.
        c_weightings (list of dicts) - The category weightings.
        m_weightings (list of dicts) - The metric weightings.

    Exceptions: 
        DatabaseInterfaceException - Occurs when:
            - A framework with the given id does not exist.
            - The user attempts to modify a default framework.
            - The user attempts to modify a framework belonging to another user.

    Returns: No return value.
    """
    conn = db.get_db_connection()
    cursor = conn.cursor(dictionary=True)

    qry = "SELECT * FROM ESG_Frameworks WHERE id = %s;"
    cursor.execute(qry, (framework_id,))
    x = cursor.fetchall()
    
    if not x:
        raise db.DatabaseInterfaceException(f"ESG Framework with id '{framework_id}' does not exist")
    framework = x[0]

    if not framework["is_user_created"]:
        raise db.DatabaseInterfaceException(f"Cannot modify default frameworks")

    if framework["user_id"] != user_id:
        raise db.DatabaseInterfaceException(f"Cannot modify framework belonging to another user")

    # Check if new framework name is already taken.
    qry = '''
    SELECT *
    FROM ESG_Frameworks
    WHERE name = %s AND id != %s AND (user_id = %s OR is_user_created = false);
    '''
    params = (name, framework_id, user_id)
    cursor.execute(qry,params)

    if cursor.fetchall():
        raise db.DatabaseInterfaceException(f"You already have a framework with the name '{name}'.")

    qry = "UPDATE ESG_Frameworks SET name = %s, date_last_updated = %s WHERE id = %s;"
    params = (name, datetime.now(), framework_id)
    cursor.execute(qry,params)

    framework_categories_metrics_helper(cursor, framework_id, c_weightings, m_weightings)
    
    conn.commit()
    cursor.close()
    conn.close()


def remove_framework(user_id, framework_id):
    """
    Removes a framework.

    Arguments:
        user_id (int) - The id of the user.
        framework_id (int) - The id of the framework.

    Exceptions: 
        DatabaseInterfaceException - Occurs when there is an error from the MySQL database.

    Returns: No return value.
    """
    conn = db.get_db_connection()
    cursor = conn.cursor(dictionary=True)

    # Get the framework.
    qry = "SELECT * FROM ESG_Frameworks WHERE id = %s"
    cursor.execute(qry, (framework_id,))
    framework = cursor.fetchone()
    if not framework:
        raise db.DatabaseInterfaceException(f"Framework ID invalid")
    if framework["user_id"] != user_id:
        raise db.DatabaseInterfaceException(f"Framework does not belong to user")

    # Delete all category and metric weightings.
    qry1 = "DELETE FROM Category_Weightings WHERE framework_id = %s;"
    qry2 = "DELETE FROM Metric_Weightings WHERE framework_id = %s;"
    qry3 = "DELETE FROM ESG_Frameworks where id = %s;"
    params = (framework_id,)

    cursor.execute(qry1, params)
    cursor.execute(qry2, params)
    cursor.execute(qry3, params)
    conn.commit()
    cursor.close()
    conn.close()


def list_frameworks(user_id, search_query):
    """
    List all the default frameworks and frameworks created by a specific user and match a provided search query.

    Arguments:
        user_id (int) - The id of the user.
        search_query (string) - The user's search query.
    
    Exceptions: No exceptions raised.

    Returns: A list of the matching frameworks and their details.
    """
    conn = db.get_db_connection()
    cursor = conn.cursor(dictionary=True)

    qry = '''
    SELECT id AS framework_id, name, is_user_created as type, date_created
    FROM ESG_Frameworks 
    WHERE name LIKE %s AND (user_id = %s OR is_user_created = FALSE);
    '''
    params = ("%"+search_query.strip()+"%", user_id)
    cursor.execute(qry,params)
    result = cursor.fetchall()
    for row in result:
        if row["type"]:
            row["type"] = "SAVED"
        else:
            row["type"] = "DEFAULT"

        row["date_created"] = str(row["date_created"])
    
    return result

def get_framework_weightings(framework_id, user_id):
    """
    Obtain the category and metric weightings of a framework.

    Arguments:
        framework_id (int) - The id of the framework.
        user_id (int) - The id of the user.
    
    Exceptions: 
        DatabaseInterfaceException: Occurs when
            - The framework id is invalid.
            - The framework was created by different user.

    Returns: A dictionary containing the category and metric weights of the framework.
    """
    conn = db.get_db_connection()
    cursor = conn.cursor(dictionary=True)

    query = "SELECT user_id, is_user_created, id AS framework_id, name FROM ESG_Frameworks WHERE id = %s "

    cursor.execute(query, (framework_id,))
    framework = cursor.fetchone()

    if not framework:
        raise db.DatabaseInterfaceException("Invalid framework id")
    if framework["user_id"] != user_id and framework['is_user_created']:
        raise db.DatabaseInterfaceException(f"Framework {user_id} does not belong to user")
    
    query = "SELECT category, weight FROM Category_Weightings WHERE framework_id = %s;"

    cursor.execute(query, (framework_id,))
    categories = cursor.fetchall()

    query = '''
    SELECT metric_id, weight, category as pillar, name as metric_name FROM Metric_Weightings
    JOIN Metrics on Metrics.id = Metric_Weightings.metric_id
    WHERE framework_id = %s;
    '''

    cursor.execute(query, (framework_id,))
    metrics = cursor.fetchall()

    del framework["user_id"]
    del framework["is_user_created"]

    return {"categories": categories, "metrics": metrics} | framework


def fork(user_id, old_framework_id, name):
    """
    Forks an existing framework.

    Arguments:
        user_id (int) - The id of the user.
        old_framework_id (int) - The id of the existing framework.
        name (string) - The name of the new framework.

    Exceptions: 
        DatabaseInterfaceException: Occurs when
            - The framework id is invalid.
            - The framework was created by different user.
            - The name chosen for the new framework exists among either default frameworks or 
            other frameworks created by the same user.

    Returns: No return value.
    """
    conn = db.get_db_connection()
    cursor = conn.cursor(dictionary=True)

    qry = "SELECT * FROM ESG_Frameworks WHERE id = %s AND (user_id = %s OR is_user_created = false);"
    params1 = (old_framework_id, user_id)
    cursor.execute(qry,params1)
    
    if not cursor.fetchall():
        raise db.DatabaseInterfaceException("Framework belongs to another user or does not exist.")

    qry = '''
    SELECT * FROM ESG_Frameworks WHERE name = %s AND user_id = %s
    UNION
    SELECT * FROM ESG_Frameworks WHERE name = %s AND is_user_created = false;
    '''
    params2 = (name, user_id, name)
    cursor.execute(qry, params2)

    if cursor.fetchall():
        raise db.DatabaseInterfaceException("Name taken")
    
    # Create the new framework.
    dt = datetime.now()
    params3 = (user_id, name, True, dt, dt)
    qry = '''INSERT INTO ESG_Frameworks (user_id, name, is_user_created, date_created, date_last_updated)
            VALUES (%s, %s, %s, %s, %s);'''
    cursor.execute(qry,params3)
    new_id = cursor.lastrowid

    # Copy the metric and category weightings over to the new framework.

    qry = '''
    INSERT INTO Metric_Weightings (framework_id, metric_id, weight)
    SELECT %s, metric_id, weight
    FROM Metric_Weightings
    WHERE framework_id = %s;
    '''
    params4 = (new_id, old_framework_id)
    cursor.execute(qry, params4)

    qry = '''
    INSERT INTO Category_Weightings (framework_id, category, weight)
    SELECT %s, category, weight
    FROM Category_Weightings
    WHERE framework_id = %s;
    '''
    cursor.execute(qry, params4)

    conn.commit()
    conn.close()

def obtain_category_weights(cursor, framework_id):
    """
    Obtain the category weights for a given framework.

    Arguments:
        cursor (MySQL cursor) - The current cursor for MySQL (Must have dictionary=True set).
        framework_id (int) - The id of the framework.

    Exceptions: No exceptions raised.

    Returns: A dictionary that contains the category weights for environmental, social and governance.
    """
    query = "SELECT category, weight from Category_Weightings WHERE framework_id = %s"
    values = (framework_id,)
    cursor.execute(query, values)

    res = cursor.fetchall()

    weightings = {
        "E": 0.0,
        "S": 0.0,
        "G": 0.0,
    }

    for tup in res:
        category = tup["category"]
        weightings[category] = tup["weight"]
    
    return weightings

def obtain_avg_measure_values_and_weights(cursor, company_id, framework_id, year):
    """
    Obtain the average measure values and weights for metrics based on the framework for a given company.

    Arguments:
        cursor (MySQL cursor) - The current cursor for MySQL (Must have dictionary=True set).
        company_id (int) - The id of the company.
        framework_id (int) - The id of the framework.
        year (int) - The year that the measures are taken from.

    Exceptions: No exceptions raised.

    Returns: A list of dictionaries containing the average measure values and weights.
    """

    query = """
    SELECT 
        AVG(ms.value) as average_value,
        met.category as category,
        met.id as metric_id,
        met.name as metric_name,
        met.unit as unit,
        mw.weight as weight
    FROM Measures ms
    JOIN Metrics met on ms.metric_id = met.id
    LEFT JOIN Metric_Weightings mw on met.id = mw.metric_id
    """

    if year is None:
        query += " WHERE perm_id = %s AND mw.framework_id = %s"
    else:
        query += " WHERE perm_id = %s AND mw.framework_id = %s AND ms.year = %s"
        
        
    query += " GROUP BY met.id, met.category, met.name, met.unit, mw.weight"

    values = None

    if year is None:
        values = (company_id, framework_id)
    else:
        values = (company_id, framework_id, year)

    cursor.execute(query, values)
    return cursor.fetchall()

def find_industry_means(cursor, company_id, framework_id, category):
    """
    Find the average industry ESG score means given a company, framework and category.

    Arguments:
        cursor (MySQL cursor) - The current cursor for MySQL (Must have dictionary=True set).
        company_id (int) - The id of the company.
        framework_id (int) - The id of the framework.
        category (string) - The category ('E', 'S' or 'G').

    Exceptions: No exceptions raised.

    Returns: The average industry ESG score.
    """

    query = "SELECT industry FROM Companies WHERE perm_id = %s"
    values = (company_id,)
    cursor.execute(query, values)

    res = cursor.fetchone()
    
    # The below function also handles the case of there being no industry.
    industry = res["industry"]
    return industry_mean_for_category(cursor, framework_id, industry, category)


def obtain_framework_scores(user_id, framework_id, company_id, year=None):
    """
    Output the ESG scores given a framework and a company.

    Arguments:
        user_id (int) - The user id.
        framework_id (int) - The framework id.
        company_id (int) - The company id.
        year (int) - The year that the measures are taken from.

    Exceptions: 
        InputError - Occurs when a framework with the provided id either does not exist or belongs
        to another user.

    Returns: A dictionary giving the ESG scores for the company.
    """

    DECIMAL_PLACES_ROUND = 2

    try:
        conn = db.get_db_connection()
        cursor = conn.cursor(dictionary=True)

        query = "SELECT name FROM ESG_Frameworks WHERE id = %s AND (user_id = %s OR is_user_created = false);"
        values = (framework_id, user_id)
        cursor.execute(query, values)

        res = cursor.fetchone()
        if not res:
            raise AccessError(description="Framework with provided id either does not exist or belongs to another user.")

        framework_name = res["name"]

        measure_values_and_weights = obtain_avg_measure_values_and_weights(cursor, company_id, framework_id, year)
        category_weights = obtain_category_weights(cursor, framework_id)
        
        category_scores = {
            "E": 0.0,
            "S": 0.0,
            "G": 0.0,
        }

        # This is to account for the cases where measurements have not been taken
        # for every metric.
        total_weight_each_category = {
            "E": 0.0,
            "S": 0.0,
            "G": 0.0,
        }

        overall_score = 0.0

        metric_weightings = []

        for tup in measure_values_and_weights:
            average_value = tup["average_value"]
            category = tup["category"]
            metric_name = tup["metric_name"]
            metric_id = tup["metric_id"]
            unit = tup["unit"]
            metric_weight = tup["weight"]

            scaled_value = find_scaled_value(cursor, average_value, metric_id)
            
            category_scores[category] += metric_weight * scaled_value
            total_weight_each_category[category] += metric_weight

            metric_weighting_dict = {
                "name": metric_name,
                "category": category,
                "weight": round(metric_weight, DECIMAL_PLACES_ROUND),
                "unit": unit,
                "value": round(average_value, DECIMAL_PLACES_ROUND),
                "scaled_value": round(scaled_value, DECIMAL_PLACES_ROUND),
            }

            metric_weightings.append(metric_weighting_dict)

        for category in ["E", "S", "G"]:
            if total_weight_each_category[category] > 0.0:
                category_scores[category] = category_scores[category] / total_weight_each_category[category]

            overall_score += category_weights[category] * category_scores[category]
        
        industry_means = {}
        for category in ["E", "S", "G"]:
            industry_means[category] = find_industry_means(cursor, company_id, framework_id, category)
        
        if year is not None:
            return {
                "total": round(overall_score, DECIMAL_PLACES_ROUND),
                "environmental": round(category_scores["E"], DECIMAL_PLACES_ROUND),
                "social": round(category_scores["S"], DECIMAL_PLACES_ROUND),
                "governance": round(category_scores["G"], DECIMAL_PLACES_ROUND),
            }

        res = {
            "framework": {
                "name": framework_name,
                "categoryWeightings": {
                    "environmental": round(category_weights["E"], DECIMAL_PLACES_ROUND),
                    "social": round(category_weights["S"], DECIMAL_PLACES_ROUND),
                    "governance": round(category_weights["G"], DECIMAL_PLACES_ROUND),
                },
                "metricWeightings": metric_weightings,
            },
            "scores": {
                "total": round(overall_score, DECIMAL_PLACES_ROUND),
                "environmental": {
                    "value": round(category_scores["E"], DECIMAL_PLACES_ROUND), 
                    "industryMean": round(industry_means["E"], DECIMAL_PLACES_ROUND),
                },
                "social": {
                    "value": round(category_scores["S"], DECIMAL_PLACES_ROUND), 
                    "industryMean": round(industry_means["S"], DECIMAL_PLACES_ROUND),
                },
                "governance": {
                    "value": round(category_scores["G"], DECIMAL_PLACES_ROUND), 
                    "industryMean": round(industry_means["G"], DECIMAL_PLACES_ROUND),
                },
            }
        }

        db.db_cleanup(conn, cursor)

        return res


    except Error as e:
        raise DBError(description=str(e))
    
def framework_scores_by_year(framework_id, company_id, user_id):
    """
    Output the ESG scores given a framework and a company across several years.

    Arguments:
        framework_id (int) - The framework id.
        company_id (int) - The company id.
        user_id (int) - The user id.

    Exceptions: No exceptions raised.

    Returns: A list of ESG scores for the company and given framework over several years.
    """
    START_YEAR = 2014
    END_YEAR = 2024

    res = {
        "scores": {
            "environmental": [],
            "social": [],
            "governance": [],
            "total": [],
        }
    }

    for year in range(START_YEAR, END_YEAR + 1):
        scores_for_year = obtain_framework_scores(user_id, framework_id, company_id, year)
        for category in ["environmental", "social", "governance", "total"]:
            res["scores"][category].append({
                "year": year,
                "score": scores_for_year[category]
            })

    return res