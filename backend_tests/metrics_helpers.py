import requests
from constants import BASE_URL, OK

def metric_name_matches(metric, name):
  if "name" in metric:
    return metric["name"] == name
  if "metric_name" in metric:
    return metric["metric_name"] == name
  return False

def check_metric_exists(metrics, name, pillar):
  assert any(metric_name_matches(m, name) and m["pillar"] == pillar for m in metrics)
  

def obtain_all_metrics():
  url = f"{BASE_URL}/metrics"
  res = requests.get(url, params={})

  assert res.status_code == OK

  metrics = res.json()["metrics"]

  return metrics

def obtain_metrics_by_category(category):
  category = "E"
  url = f"{BASE_URL}/metrics/{category}"
  res = requests.get(url, params={})

  assert res.status_code == OK

  metrics = res.json()["metrics"]

  return metrics