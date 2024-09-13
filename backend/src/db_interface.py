import mysql.connector
from datetime import datetime

# MySQL Configuration
db_name = 'db'
db_host = 'db'
db_user = 'root'
db_password = '23erf23'

class DatabaseConnectionException(Exception):
    pass

class DatabaseInterfaceException(Exception):
    pass

def get_db_connection():
    """
    Connects to the MySQL database.

    Arguments: No Arguments

    Exceptions:
        DatabaseConnectionException - Occurs when the database connection was unsuccessful.

    Returns: A database connection instance.
    """
    try:
        return mysql.connector.connect(
            host=db_host,
            user=db_user,
            password=db_password,
            database=db_name
        )
    except:
        raise DatabaseConnectionException("Could not connect to the database")


def db_cleanup(conn, cursor):
    """
    Performs cleanup operations before ending a connection to the MySQL database.

    Arguments:
        conn (MySQL connection object) - A connection instance to the database
        cursor (MySQL cursor object) - A cursor to the database connection.

    Exceptions: No exceptions raised.

    Returns: No return value.
    """
    conn.commit()
    cursor.close()
    conn.close()

