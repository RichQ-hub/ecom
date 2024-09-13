from auth_helpers import check_register_success, check_register_fail
from auth_helpers import check_login_success, check_login_fail
from auth_helpers import check_auth_profile_success, check_auth_profile_fail
from auth_helpers import check_auth_reset_password_success, check_auth_reset_password_fail
from auth_helpers import auth_delete_account

name1 = "Alice"
name2 = "Ben"
name3 = "Cathy"
name4 = "David"

email1 = "alice123@gmail.com"
email2 = "ben123@gmail.com"
email3 = "cathy123@gmail.com"
email4 = "david123@gmail.com"

password1 = "alicepassword123"
password2 = "benpassword123"
password3 = "cathypassword123"
password4 = "davidpassword123"

newpassword = "newpassword123"
randompassword = "randompassword123"

randomtoken = "2oi34uv12)(*()!@)"

def test_auth_1():
  token1 = check_register_success(email1, name1, password1)
  token2 = check_register_success(email2, name2, password2)
  token1b = check_login_success(email1, name1, password1)
  token2b = check_login_success(email2, name2, password2)

  check_auth_profile_success(token1, name1, email1)
  check_auth_profile_success(token1b, name1, email1)
  check_auth_profile_success(token2, name2, email2)
  check_auth_profile_success(token2b, name2, email2)

  auth_delete_account(token1)
  auth_delete_account(token2)

def test_register_duplicate_email():
  token1 = check_register_success(email1, name1, password1)
  check_register_fail(email1, name2, password2)

  auth_delete_account(token1)

def test_login_incorrect_password():
  token1 = check_register_success(email1, name1, password1)
  check_login_fail(email1, password2)

  auth_delete_account(token1)

def test_login_email_no_account():
  check_login_fail(email1, password1)

def test_auth_profile_incorrect_token():
  check_auth_profile_fail(randomtoken)

def test_reset_password_success():
  check_register_success(email1, name1, password1)
  check_login_success(email1, name1, password1)

  check_auth_reset_password_success(email1, name1, password1, newpassword)
  
  token1b = check_login_success(email1, name1, newpassword)
  check_login_fail(email1, password1)

  auth_delete_account(token1b)

def test_reset_password_fail():
  token1 = check_register_success(email1, name1, password1)
  check_auth_reset_password_fail(email1, password2, newpassword)

  auth_delete_account(token1)