import requests
from constants import BASE_URL, OK

def obtain_company_names(companies):
  return [c["name"] for c in companies if c["name"][0].isupper()]

def obtain_company_observations(companies):
  return [c["nb_points_of_observations"] for c in companies]

def check_company_info_valid(companies, perm_id, name, industry, country, nb_points_of_observations):
  assert any(
    c["perm_id"] == perm_id and
    c["name"] == name and 
    c["industry"] == industry and 
    c["headquarter_country"] == country and
    c["nb_points_of_observations"] == nb_points_of_observations
    for c in companies
  )

def check_list_order(lst, is_asc):
  lst = lst[:5]
  if is_asc:
    return sorted(lst) == lst
  else:
    return sorted(lst, reverse=True) == lst
  

def check_sort_correct(companies, sort):
  ALPHABETICAL_SORT = 0
  DESC_OBSERVATIONS_SORT = 1
  ASC_OBSERVATIONS_SORT = 2

  company_names = obtain_company_names(companies)
  company_observations = obtain_company_observations(companies)

  if sort == ALPHABETICAL_SORT:
    assert check_list_order(company_names, True)
  elif sort == DESC_OBSERVATIONS_SORT:
    assert check_list_order(company_observations, False)
  elif sort == ASC_OBSERVATIONS_SORT:
    assert check_list_order(company_observations, True)
  else:
    assert check_list_order(company_names, True)

def search_companies(search_query, sort, headquarter_country, industry, offset):
  url = f"{BASE_URL}/companies"
  prms = {
    "search_query": search_query,
    "sort": sort,
    "country": headquarter_country,
    "industry": industry,
    "offset": offset,
  }
  
  res = requests.get(url, params=prms)

  assert res.status_code == OK

  companies = res.json()["companies"]
  count = companies_count(search_query, headquarter_country, industry)

  return companies, count

def companies_count(search_query, headquarter_country, industry):
  url = f"{BASE_URL}/companies/count"
  prms = {
    "search_query": search_query,
    "country": headquarter_country,
    "industry": industry,
  }
  
  res = requests.get(url, params=prms)

  assert res.status_code == OK

  count = res.json()["count"]

  return count

def companies_countries():
  url = f"{BASE_URL}/companies/countries"
  prms = {}
  
  res = requests.get(url, params=prms)

  assert res.status_code == OK

  countries = res.json()["countries"]

  return countries

def company_details(perm_id):
  url = f"{BASE_URL}/companies/{perm_id}"
  prms = {}
  
  res = requests.get(url, params=prms)

  assert res.status_code == OK

  return res.json()

def check_company_reports(perm_id, year):
  excel_url = f"{BASE_URL}/companies/report/excel/{perm_id}/{year}"
  pdf_url = f"{BASE_URL}/companies/report/pdf/{perm_id}/{year}"

  res_excel = requests.get(excel_url, params={})
  res_pdf = requests.get(pdf_url, params={})

  assert res_excel.status_code == OK
  assert res_pdf.status_code == OK

  excel_json = res_excel.json()
  pdf_json = res_pdf.json()

  assert "filename" in excel_json
  assert "encoded_excel" in excel_json

  assert "filename" in pdf_json
  assert "encoded_pdf" in pdf_json
