from companies_helpers import check_company_info_valid, search_companies, check_sort_correct
from companies_helpers import companies_countries, company_details, check_company_reports

MAX_OFFSET = 50
NUM_SORTING_OPTIONS = 3

def test_companies_search_1():
  search_query = "elec"
  headquarter_country =  ["Australia", "United States"]
  industry = []
  offset = 0

  for sort in range(NUM_SORTING_OPTIONS):
    companies, count = search_companies(search_query, sort, headquarter_country, industry, offset)

    EXPECTED_NUM = 94

    print(f"count={count}")

    assert count == EXPECTED_NUM
    assert len(companies) <= MAX_OFFSET

    check_sort_correct(companies, sort)

    if sort == 0:
      c_perm_id = 4296354808
      c_name = "Basin Electric Power Cooperative"
      c_industry = "Commercial Banks"
      c_headquarter_country = "United States"
      c_nb_points_of_observations = 54

      check_company_info_valid(companies, c_perm_id, c_name, c_industry, c_headquarter_country, c_nb_points_of_observations)

def test_companies_search_2():
  search_query = "power"
  headquarter_country =  ["Canada", "Saudi Arabia", "Greece", "United States"]
  industry = ["Hardware", "Agricultural Products", "Real Estate Services"]
  offset = 0

  for sort in range(NUM_SORTING_OPTIONS):
    companies, count = search_companies(search_query, sort, headquarter_country, industry, offset)

    EXPECTED_NUM = 6

    assert count == EXPECTED_NUM
    assert len(companies) <= MAX_OFFSET

    check_sort_correct(companies, sort)

    print(companies)

    if sort == 0:
      c_perm_id = 5037818914
      c_name = "ACWA Power Co"
      c_industry = "Real Estate Services"
      c_headquarter_country = "Saudi Arabia"
      c_nb_points_of_observations = 175

      check_company_info_valid(companies, c_perm_id, c_name, c_industry, c_headquarter_country, c_nb_points_of_observations)

def test_companies_search_3():
  search_query = "ca"
  headquarter_country =  ["Canada", "Saudi Arabia", "Greece", "United States"]
  industry = ["Hardware", "Agricultural Products", "Real Estate Services"]
  offset = 1

  for sort in range(NUM_SORTING_OPTIONS):
    companies, count = search_companies(search_query, sort, headquarter_country, industry, offset)

    EXPECTED_NUM = 68

    assert count == EXPECTED_NUM
    assert len(companies) <= MAX_OFFSET

    check_sort_correct(companies, sort)

    print(companies)

    if sort == 0:
      c_perm_id = 5035172078
      c_name = "Queen's Road Capital Investment Ltd (Pre Reincorporation)"
      c_industry = "Agricultural Products"
      c_headquarter_country = "Canada"
      c_nb_points_of_observations = 6

      check_company_info_valid(companies, c_perm_id, c_name, c_industry, c_headquarter_country, c_nb_points_of_observations)

def test_companies_countries():
  countries = companies_countries()

  EXPECTED_COUNTRIES = [
        "Antigua and Barbuda",
        "Argentina",
        "Australia",
        "Austria",
        "Bahamas, The",
        "Bahrain",
        "Bangladesh",
        "Barbados",
        "Belgium",
        "Belize",
        "Benin",
        "Bermuda",
        "Bolivia",
        "Bosnia and Herzegovina",
        "Botswana",
        "Brazil",
        "British Virgin Islands",
        "Bulgaria",
        "Burkina Faso",
        "Burundi",
        "Cambodia",
        "Canada",
        "Cayman Islands",
        "Chile",
        "China",
        "Colombia",
        "Costa Rica",
        "Cote d'Ivoire",
        "Croatia",
        "Curacao",
        "Cyprus",
        "Czech Republic",
        "Denmark",
        "Ecuador",
        "Egypt, Arab Rep.",
        "Estonia",
        "Faroe Islands",
        "Finland",
        "France",
        "Gabon",
        "Georgia",
        "Germany",
        "Ghana",
        "Gibraltar",
        "Greece",
        "Guam",
        "Guatemala",
        "Honduras",
        "Hong Kong SAR, China",
        "Hungary",
        "Iceland",
        "India",
        "Indonesia",
        "Iraq",
        "Ireland",
        "Isle of Man",
        "Israel",
        "Italy",
        "Jamaica",
        "Japan",
        "Jordan",
        "Kazakhstan",
        "Kenya",
        "Korea, Rep.",
        "Kuwait",
        "Latvia",
        "Lebanon",
        "Liberia",
        "Liechtenstein",
        "Lithuania",
        "Luxembourg",
        "Macao SAR, China",
        "Malawi",
        "Malaysia",
        "Malta",
        "Marshall Islands",
        "Mauritius",
        "Mexico",
        "Monaco",
        "Mongolia",
        "Montenegro",
        "Morocco",
        "Namibia",
        "Netherlands",
        "New Zealand",
        "Niger",
        "Nigeria",
        "North Macedonia",
        "Norway",
        "Oman",
        "Pakistan",
        "Panama",
        "Papua New Guinea",
        "Paraguay",
        "Peru",
        "Philippines",
        "Poland",
        "Portugal",
        "Puerto Rico",
        "Qatar",
        "Romania",
        "Russian Federation",
        "Rwanda",
        "Samoa",
        "Saudi Arabia",
        "Senegal",
        "Serbia",
        "Singapore",
        "Slovak Republic",
        "Slovenia",
        "South Africa",
        "Spain",
        "Sri Lanka",
        "St. Lucia",
        "Sudan",
        "Sweden",
        "Switzerland",
        "Syrian Arab Republic",
        "Taiwan, China",
        "Tanzania",
        "Thailand",
        "Togo",
        "Trinidad and Tobago",
        "Tunisia",
        "Turkey",
        "Turks and Caicos Islands",
        "Uganda",
        "Ukraine",
        "United Arab Emirates",
        "United Kingdom",
        "United States",
        "Venezuela, RB",
        "Vietnam",
        "Virgin Islands (U.S.)",
        "West Bank and Gaza",
        "Zambia",
        "Zimbabwe",
  ]
    
  assert sorted(countries) == EXPECTED_COUNTRIES

def test_company_details_succes():
  perm_id = 4295856055
  expected_output = ('YPF SA', 'Commercial Banks', 'Argentina', 291)

  details = company_details(perm_id)

  assert (details["name"], details["industry"], details["headquarter_country"], details["nb_points_of_observations"]) == expected_output

def test_company_reports():
  perm_id = 4295856242
  year = 2020

  check_company_reports(perm_id, year)