import requests
from constants import BASE_URL, OK

from auth_helpers import check_register_success, create_token_header, auth_delete_account

name = "Alice"
email = "alice123@gmail.com"
password = "alicepassword123"

def approx_equal(num1, num2):
  SMALL = 0.005
  if abs(num1 - num2) < SMALL:
    return True
  
  return False

def obtain_framework_id_from_name(token, framework_name):
  url = f"{BASE_URL}/framework/list-all"
  prms = {
    "search_query": framework_name,
  }

  res = requests.get(url, params=prms, headers=create_token_header(token))

  assert res.status_code == OK
  
  frameworks = res.json()["frameworks"]

  assert len(frameworks) >= 1

  return int(frameworks[0]["framework_id"])

def obtain_esg_scores(token, framework_name, perm_id):
  framework_id = obtain_framework_id_from_name(token, framework_name)
  url = f"{BASE_URL}/framework/scores/{framework_id}/{perm_id}"
  
  res = requests.get(url, headers=create_token_header(token))

  assert res.status_code == OK

  return res.json()["framework"], res.json()["scores"]

def obtain_yearly_scores(token, framework_name, perm_id):
  framework_id = obtain_framework_id_from_name(token, framework_name)
  url = f"{BASE_URL}/framework/livescores/{framework_id}/{perm_id}"
  
  res = requests.get(url, headers=create_token_header(token))

  assert res.status_code == OK

  return res.json()["scores"]

def found_metric_weighting(metric_data, metric_weightings):
  for metric in metric_weightings:
    found = (
      metric["name"] == metric_data["name"] and
      metric["category"] == metric_data["category"] and 
      approx_equal(metric["weight"], metric_data["weight"]) and
      metric["unit"] == metric_data["unit"] and
      approx_equal(metric["value"], metric_data["value"]) and
      approx_equal(metric["scaled_value"], metric_data["scaled_value"])
    )
    if found:
      return True
    
  return False

def find_score_for_year_and_category(scores, year, category):
  for score_data in scores[category]:
    if score_data["year"] == year:
      return score_data["score"]
  
  return None

def test_esg_scores():
  token = check_register_success(email, name, password)

  framework_name = "IFRS S1"
  perm_id = 4295856021

  framework_data, scores = obtain_esg_scores(token, framework_name, perm_id)
  
  category_weightings = framework_data["categoryWeightings"]
  metric_weightings = framework_data["metricWeightings"]

  expected_category_weights = {
    "environmental": 0.4,
    "social": 0.3,
    "governance": 0.3,
  }

  expected_metric_1 = {
    "name": "ENERGYUSETOTAL",
    "category": "E",
    "weight": 0.05,
    "unit": "GJ",
    "value": 49470.97,
    "scaled_value": 73.93,
  }

  expected_metric_2 = {
    "name": "GRIEVANCE_REPORTING_PROCESS",
    "category": "S",
    "weight": 0.05,
    "unit": "Yes/No",
    "value": 1.0,
    "scaled_value": 100.0,
  }

  assert framework_data["name"] == framework_name
  
  for c in ["environmental", "social", "governance"]:
    assert approx_equal(expected_category_weights[c], category_weightings[c])
  
  assert found_metric_weighting(expected_metric_1, metric_weightings)
  assert found_metric_weighting(expected_metric_2, metric_weightings)

  expected_total_score = 55.2
  expected_env_score = 88.0
  expected_industry_mean_social = 70.56

  assert approx_equal(scores["total"], expected_total_score)
  assert approx_equal(scores["environmental"]["value"], expected_env_score)
  assert approx_equal(scores["social"]["industryMean"], expected_industry_mean_social)

  auth_delete_account(token)

def test_yearly_esg_scores():
  token = check_register_success(email, name, password)

  framework_name = "IFRS S1"
  perm_id = 4295856021

  scores = obtain_yearly_scores(token, framework_name, perm_id)

  expected_score_2018_E = 86.97
  expected_score_2020_S = 50.0
  expected_score_2023_total = 30.0

  score_2018_E = find_score_for_year_and_category(scores, 2018, "environmental")
  score_2020_S = find_score_for_year_and_category(scores, 2020, "social")
  score_2023_total = find_score_for_year_and_category(scores, 2023, "total")


  assert approx_equal(score_2018_E, expected_score_2018_E)
  assert approx_equal(score_2020_S, expected_score_2020_S)
  assert approx_equal(score_2023_total, expected_score_2023_total)

  auth_delete_account(token)