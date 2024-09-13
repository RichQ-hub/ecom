from mysql.connector import Error

from src.db_interface import get_db_connection, db_cleanup
from src.exceptions import DBError

def obtain_industries():
  """
  Obtain all the industries across the companies.

  Arguments: None

  Exceptions: No exceptions raised.

  Returns: The names of all the industries.
  """
  try:
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    query = "SELECT DISTINCT industry FROM Companies"

    cursor.execute(query)

    res = cursor.fetchall()

    industries = list(map(lambda tup: tup["industry"], res))
    industries = list(filter(lambda industry : industry is not None, industries))
  
    db_cleanup(conn, cursor)

    return {
      "industries": industries,
    }

  except Error as e:
    raise DBError(description=str(e))