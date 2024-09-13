from werkzeug.exceptions import HTTPException

class AccessError(HTTPException):
  code = 403
  message = "Access Error"

class InputError(HTTPException):
  code = 400
  message = "Input Error"

class DBError(HTTPException):
  code = 500
  message = "Database Connection Error"
