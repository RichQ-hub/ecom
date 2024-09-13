from metrics_helpers import obtain_all_metrics, obtain_metrics_by_category, check_metric_exists

def test_obtain_all_metrics():
  metrics = obtain_all_metrics()

  EXPECTED_NUM_METRICS = 105

  assert len(metrics) == EXPECTED_NUM_METRICS

  example_name = "POLICY_FORCED_LABOR"
  example_pillar = "S"

  check_metric_exists(metrics, example_name, example_pillar)

def test_metrics_by_category():
  category = "E"
  metrics = obtain_metrics_by_category(category)
  
  EXEPCTED_ENVIRONMENTAL_METRICS = 46

  assert len(metrics) == EXEPCTED_ENVIRONMENTAL_METRICS

  example_name = "VOC_EMISSIONS_REDUCTION"
  example_pillar = "E"

  check_metric_exists(metrics, example_name, example_pillar)


  