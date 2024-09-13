import requests
from constants import BASE_URL, OK

def register(email, name, password):
  url = f"{BASE_URL}/auth/register"
  json = {
    "email": email,
    "name": name,
    "password": password,
  }

  res = requests.post(url, json=json)

  return res

def check_register_success(email, name, password):
  res = register(email, name, password)
  assert res.status_code == OK

  json = res.json()
  token = json["token"]
  res_name = json["name"]

  assert res_name == name

  return token

def check_register_fail(email, name, password):
  res = register(email, name, password)
  assert res.status_code != OK

def login(email, password):
  url = f"{BASE_URL}/auth/login"
  json = {
    "email": email,
    "password": password,
  }

  res = requests.post(url, json=json)

  return res

def check_login_success(email, name, password):
  res = login(email, password)
  assert res.status_code == OK

  json = res.json()
  token = json["token"]
  res_name = json["name"]

  assert name == res_name

  return token

def check_login_fail(email, password):
  res = login(email, password)
  assert res.status_code != OK

def create_token_header(token):
  headers = {"Authorization": f"Bearer {token}"}
  return headers

def auth_profile(token):
  url = f"{BASE_URL}/auth/profile"
  res = requests.get(url, headers=create_token_header(token))
  return res

def check_auth_profile_success(token, name, email):
  res = auth_profile(token)
  assert res.status_code == OK

  json = res.json()
  res_name = json["name"]
  res_email = json["email"]

  assert res_name == name
  assert res_email == email

  return None

def check_auth_profile_fail(token):
  res = auth_profile(token)
  assert res.status_code != OK

def auth_reset_password(email, old_password, new_password):
  url = f"{BASE_URL}/auth/reset_password"
  json = {
    "email": email,
    "old_password": old_password,
    "new_password": new_password,
  }

  res = requests.post(url, json=json)

  return res

def check_auth_reset_password_success(email, name, old_password, new_password):
  res = auth_reset_password(email, old_password, new_password)
  assert res.status_code == OK

  json = res.json()
  token = json["token"]
  res_name = json["name"]

  assert res_name == name

  return token, name

def check_auth_reset_password_fail(email, old_password, new_password):
  res = auth_reset_password(email, old_password, new_password)
  assert res.status_code != OK

def auth_delete_account(token):
  url = f"{BASE_URL}/auth/delete_account"
  res = requests.post(url, headers=create_token_header(token))
  assert res.status_code == OK
  return res