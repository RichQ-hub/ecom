import requests
import json
import pytest

BASE_URL = "http://localhost:5555"

# Status codes
OK = 200


# Just a test

def my_test():
  res1 = requests.get(f"{BASE_URL}/metrics", params={})

  assert res1.status_code == OK

  metrics = res1.json()["metrics"]
  print(metrics)

