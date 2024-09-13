import math

NEGATIVE_METRICS = [
  "HUMAN_RIGHTS_VIOLATION_PAI", "WATER_USE_PAI_M10", "BRIBERY_AND_CORRUPTION_PAI_INSUFFICIENT_ACTIONS",
  "NATURAL_RESOURCE_USE_DIRECT", "CO2INDIRECTSCOPE3", "HAZARDOUSWASTE", "ENERGYUSETOTAL",
  "ANALYTICESTIMATEDCO2TOTAL", "RENEWENERGYCONSUMED", "PARTICULATE_MATTER_EMISSIONS",
  "CO2INDIRECTSCOPE2", "CEO_ANNUAL_COMPENSATION", "NOXEMISSIONS", "RENEWENERGYPRODUCED",
  "SOXEMISSIONS", "WASTETOTAL", "CO2DIRECTSCOPE1", "RENEWENERGYPURCHASED", "VOCEMISSIONS",
  "WATERWITHDRAWALTOTAL", "EMPLOYEEFATALITIES", "TIRTOTAL", "CEO_PAY_RATIO_MEDIAN",
  "AIRPOLLUTANTS_INDIRECT", "TURNOVEREMPLOYEES", "ANALYTICCEO_CHAIRMAN_SEPARATION",
  "CALL_MEETINGS_LIMITED_RIGHTS", "AIRPOLLUTANTS_DIRECT", "LOSTWORKINGDAYS", 
  "ELECTRICITYPURCHASED", "ENERGYPURCHASEDDIRECT", "CO2_NO_EQUIVALENTS",
]

def is_metric_negative(cursor, metric_id):
  """
  Find whether or not a metric is "negative" (i.e. the larger the value of the metric, the less
  desirable it is).

  Arguments:
    cursor (MySQL cursor) - The current cursor for MySQL (Must have dictionary=True set).
    metric_id (int) - The id of the metric.
  
  Exceptions: No exceptions raised.

  Returns: A boolean value for whether or not the metric is negative.
  """
  query = "SELECT name from Metrics where id = %s"
  values = (metric_id,)
  cursor.execute(query, values)
  res = cursor.fetchone()

  metric_name = res["name"]

  if metric_name in NEGATIVE_METRICS:
    return True
  
  return False

def find_scaled_value(cursor, value, metric_id):
  """
  Obtain the scaled value of a measure given the raw value and metric id.

  Arguments:
      cursor (MySQL cursor) - The current cursor for MySQL (Must have dictionary=True set).
      value (float) - The value of the measure.
      metric_id (int) - The id of the metric.

  Exceptions: No exceptions raised.

  Returns: The scaled value of the measure.
  """
  
  query = "SELECT max_value as highest_value, min_value as lowest_value FROM MeasuresHighestLowest WHERE metric_id = %s"
  
  cursor.execute(query, (metric_id,))
  
  res = cursor.fetchone()
  highest_value = res["highest_value"]
  lowest_value = res["lowest_value"]

  scale_down = False

  MAX_SCALED_SCORE = 100.0

  SMALL = 0.005
  DECIMAL_PLACES_ROUND = 2
  
  SCALE_DOWN_THRESHOLD_HIGH = 3000
  SCALE_DOWN_THRESHOLD_MEDIUM = 200
  SCALE_DOWN_THRESHOLD_LOW = 60

  FINAL_POWER_SCALE = 1.8

  power_scale = 1

  if highest_value - lowest_value >= SCALE_DOWN_THRESHOLD_HIGH:
    scale_down = True
    power_scale = 0.4
  elif highest_value - lowest_value >= SCALE_DOWN_THRESHOLD_MEDIUM:
    scale_down = True
    power_scale = 0.5
  elif highest_value - lowest_value >= SCALE_DOWN_THRESHOLD_LOW:
    scale_down = True
    power_scale = 0.7


  score = 0.0
  
  if abs(highest_value - lowest_value) < 2 * SMALL:
    return MAX_SCALED_SCORE
  elif value >= highest_value - SMALL:
    score = MAX_SCALED_SCORE
  elif value <= lowest_value + SMALL:
    score = 0.0
  elif not scale_down:
    score = min(MAX_SCALED_SCORE * (value - lowest_value) / (highest_value - lowest_value), MAX_SCALED_SCORE)
  else:
    score = min(MAX_SCALED_SCORE * math.pow(value - lowest_value, power_scale) / math.pow(highest_value - lowest_value, power_scale), MAX_SCALED_SCORE)
  
  if is_metric_negative(cursor, metric_id):
    score = MAX_SCALED_SCORE - score

  score = math.pow((score / MAX_SCALED_SCORE), FINAL_POWER_SCALE) * MAX_SCALED_SCORE
  
  return round(score, DECIMAL_PLACES_ROUND)

def obtain_single_industry_avg_measures(cursor, framework_id, industry, category):
  """
  Obtain the industry mean ESG score for a given industry, category and framework.

  Arguments:
      cursor (MySQL cursor) - The current cursor for MySQL (Must have dictionary=True set).
      framework_id (int) - The id of the framework.
      industry (string) - The name of the industry.
      category (string) - The category in question ('E', 'S' or 'G').

  Exceptions: No exceptions raised.

  Returns: The average industry ESG score.
  """

  query = """
  SELECT 
      ima.avg_value as average_value,
      met.id as metric_id,
      mw.weight as weight
  FROM Metrics met
  LEFT JOIN IndustryMetricAverages ima on ima.metric_id = met.id
  LEFT JOIN Metric_Weightings mw on met.id = mw.metric_id
  WHERE met.category = %s AND mw.framework_id = %s AND ima.industry = %s
  """

  values = (category, framework_id, industry)
  cursor.execute(query, values)

  res = cursor.fetchall()
  return res

def obtain_all_industries_avg_measures(cursor, framework_id, category):
  """
  Obtain the mean ESG score for a given category and framework across all industries.

  Arguments:
      cursor (MySQL cursor) - The current cursor for MySQL (Must have dictionary=True set).
      framework_id (int) - The id of the framework.
      category (string) - The category in question ('E', 'S' or 'G').

  Exceptions: No exceptions raised.

  Returns: The average ESG score for the given category and framework.
  """

  query = """
  SELECT 
      mhl.avg_value as average_value,
      met.id as metric_id,
      mw.weight as weight
  FROM Metrics met
  LEFT JOIN MeasuresHighestLowest mhl on mhl.metric_id = met.id
  LEFT JOIN Metric_Weightings mw on met.id = mw.metric_id
  WHERE met.category = %s AND mw.framework_id = %s
  """

  values = (category, framework_id)
  cursor.execute(query, values)

  res = cursor.fetchall()
  return res
  

def industry_mean_for_category(cursor, framework_id, industry, category):
  """
  Obtain the industry mean ESG score for a given industry, category and framework.

  Arguments:
      cursor (MySQL cursor) - The current cursor for MySQL (Must have dictionary=True set).
      framework_id (int) - The id of the framework.
      industry (string) - The name of the industry.
      category (string) - The category in question ('E', 'S' or 'G').

  Exceptions: No exceptions raised.

  Returns: The average industry ESG score.
  """

  res = None

  if industry is not None:
    res = obtain_single_industry_avg_measures(cursor, framework_id, industry, category)
  else:
    res = obtain_all_industries_avg_measures(cursor, framework_id, category)
  

  if not res or len(res) == 0:
    return 0.0
  
  avg_esg_score = 0.0
  total_weight_in_category = 0.0

  for tup in res:
    avg_value = tup["average_value"]
    metric_id = tup["metric_id"]
    metric_weight = tup["weight"]
    
    scaled_value = find_scaled_value(cursor, avg_value, metric_id)
    avg_esg_score += scaled_value * metric_weight
    total_weight_in_category += metric_weight

  if total_weight_in_category > 0.0:
    avg_esg_score = avg_esg_score / total_weight_in_category

  return avg_esg_score

