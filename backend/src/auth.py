import hashlib
import jwt
import re
import secrets
from mysql.connector import Error

from src.db_interface import get_db_connection, db_cleanup
from src.exceptions import InputError, AccessError, DBError

JWT_SECRET = "h2D#(gM&)q+!F"

MIN_PASSWORD_LEN = 5
MAX_PASSWORD_LEN = 100
MIN_NAME_LEN = 1
MAX_NAME_LEN = 300

def check_email_address_register(email):
  """
  Checks whether the email used by a new user to register is valid. 
  The email must have valid format and must not be already used by another user.

  Arguments:
    email (string) - The email entered by the user to register.

  Exceptions:
    InputError - Occurs when the email has invalid format or a registered user already exists with the given email.

  Returns: No return value.
  """

  email_regex = r'^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$'

  if not re.fullmatch(email_regex, email):
    raise InputError(description="Email has invalid format.")

  try:
    conn = get_db_connection()
    cursor = conn.cursor()

    query = "SELECT EXISTS(SELECT 1 FROM Users WHERE email = %s)"

    cursor.execute(query, (email,))

    res = cursor.fetchone()[0]

    if res:
      raise InputError(description="A registered user with this email address already exists.")   

    
    db_cleanup(conn, cursor)

  except Error as e:
    raise DBError(description=str(e))

def check_password_length(password):
  """
  Checks that the password entered by a user has a length within the required range.

  Arguments:
      password (string) - The password entered by the user.

  Exceptions:
      InputError - Occurs when the password is not of the required length range.

  Returns: No return value.
  """
  if len(password) < MIN_PASSWORD_LEN or len(password) > MAX_PASSWORD_LEN:
      raise InputError(description="Password is not within the required length range to register.")

def check_name_length(name):
  """
  Checks that the name entered by a user has a length within the required range.

  Arguments:
      name (string) - The name entered by the user.

  Exceptions:
      InputError - Occurs when the name is not of the required length range.

  Returns: No return value.
  """
  if len(name) < MIN_NAME_LEN or len(name) > MAX_NAME_LEN:
      raise InputError(description="Name is not within the required length range to register.")

def get_password_hash(password):
  """
  Creates a password hash given a password and returns it.

  Arguments: 
    password (string) - The user's password.

  Exceptions: No exceptions raised.

  Returns: The password hash.
  """
  return hashlib.sha256(password.encode()).hexdigest()

def create_token(user_id):
  """
  Creates a JWT token for a user's logged in session. 

  Arguments: 
    user_id (int) - The id of the user.

  Exceptions: No exceptions raised.

  Returns: A dictionary containing the JWT token (string).
  """

  random_str = secrets.token_urlsafe(32)

  encoded_jwt = jwt.encode({"user_id": user_id, "random_str": random_str }, JWT_SECRET, algorithm="HS256")
  return encoded_jwt

def check_token_valid(token):
  """
  Checks if the user's JWT token is valid. If it is valid then returns the corresponding user id.

  Arguments: 
    token (string) - The user's token.

  Exceptions:
    Access Error - Occurs when:
      - The token cannot be decoded.
      - The user id in the decoded token is invalid.

  Returns: A dictionary containing the user id.
  """ 
  decoded_jwt = ""

  try:
    decoded_jwt = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
  except Exception as e:
    raise AccessError(description="User token cannot be decoded.") from e
  
  user_id = decoded_jwt["user_id"]

  try:
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    query = "SELECT id as user_id from Users where id = %s"
    values = (user_id,)

    cursor.execute(query, values)
    res = cursor.fetchone()

    if not res:
      raise AccessError(description="User token is invalid.")
    
    db_cleanup(conn, cursor)

    return {
      "user_id": user_id,
    }

  except Error as e:
    raise DBError(description=str(e)) 
  

def auth_register(name, email, password):
  """
  Attempts to register a new user who enters a name, email and password.

  Arguments:
    name (string) - The name entered by the user.
    email (string) - The email entered by the user.
    password (string) - The password entered by the user.

  Exceptions:
    InputError - Occurs when either:
      - The email address has invalid format.
      - The email address already exists among registered users.
      - The password does not meet the required format.
      - The name does not meet the required format.
  
  Returns: A dictionary containing the user's JWT token and name.
  """
  check_email_address_register(email)
  check_password_length(password)
  check_name_length(name)

  password_hash = get_password_hash(password)

  try:
    conn = get_db_connection()
    cursor = conn.cursor()

    query = "INSERT INTO Users (name, email, password_hash) VALUES (%s, %s, %s)"
    values = (name, email, password_hash)

    cursor.execute(query, values)

    user_id = cursor.lastrowid
    token = create_token(user_id)
    
    db_cleanup(conn, cursor)

    return {
      "token": token,
      "name": name,
    }

  except Error as e:
    raise DBError(description=str(e))

def auth_login(email, password):
  """
  Logs in a registered user given their email and password.

  Arguments:
    email (string) - The email entered by the user.
    password (string) - The password entered by the user. 

  Exceptions:
    InputError - Occurs when the email does not exist among registered users or the password is incorrect.
  
  Returns: A dictionary containing the user's JWT token and name.
  """
  password_hash = get_password_hash(password)

  try:
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    query = "SELECT id as user_id, name FROM Users WHERE email = %s AND password_hash = %s"
    values = (email, password_hash)

    cursor.execute(query, values)

    res = cursor.fetchone()
    
    if not res:
      raise InputError(description="Incorrect login details")

    user_id = res["user_id"]
    name = res["name"]

    token = create_token(user_id)
    
    db_cleanup(conn, cursor)

    return {
      "token": token,
      "name": name,
    }

  except Error as e:
    raise DBError(description=str(e))
  
def auth_profile(user_id):
  """
  Return user profile information given their user id.

  Arguments:
    user_id (int) - The id of the user.

  Exceptions: 
    InputError - Occurs when the user id is invalid.

  Returns: A dictionary containing the user's profile information.
  """
  try:
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    query = "SELECT name, email FROM Users WHERE id = %s"
    values = (user_id,)

    cursor.execute(query, values)

    res = cursor.fetchone()
    
    if not res:
      raise InputError(description="Could not find user details.")
    
    db_cleanup(conn, cursor)

    return {
      "name": res["name"],
      "email": res["email"],
    }

  except Error as e:
    raise DBError(description=str(e))

def auth_reset_password(email, old_password, new_password):
  """
  Resets a user's password.

  Arguments:
    email (string) - The user's email.
    old_password (string) - The user's old password.
    new_password (string) - THe user's new password.

  Exceptions: 
    InputError - Occurs when the email and old password do not match an existing account
    or the new password does not match the required format.

  Returns: A dictionary containing the user's JWT token and name.
  """

  old_password_hash = get_password_hash(old_password)
  check_password_length(new_password)
  new_password_hash = get_password_hash(new_password)

  try:
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    query = "SELECT id as user_id, name FROM Users WHERE email = %s AND password_hash = %s"
    values = (email, old_password_hash)

    cursor.execute(query, values)

    res = cursor.fetchone()
    
    if not res:
      raise InputError(description="The email and old password do not match an existing account.")
    
    user_id = res["user_id"]
    name = res["name"]

    query = "UPDATE Users SET password_hash = %s WHERE id = %s"
    values = (new_password_hash, user_id)

    cursor.execute(query, values)

    token = create_token(user_id)
    
    db_cleanup(conn, cursor)

    return {
      "token": token,
      "name": name,
    }

  except Error as e:
    raise DBError(description=str(e))

def auth_delete_account(user_id):
  """
  Deletes a user's account.

  Arguments:
    user_id (int) - The id of the user.

  Exceptions: 
    InputError - Occurs when the user id is invalid.

  Returns: An empty dictionary.
  """
  try:
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    query = "DELETE FROM Users WHERE id = %s"
    values = (user_id,)

    cursor.execute(query, values)
    
    db_cleanup(conn, cursor)

    return {}

  except Error as e:
    raise DBError(description=str(e))