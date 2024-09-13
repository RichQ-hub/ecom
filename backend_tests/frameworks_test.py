import requests
import pytest
import random
import string
import mysql.connector

def generate_user():
    name = ""
    for _ in range(random.randint(8,15)):
        name += random.choice(string.ascii_letters)
    
    response = requests.post(
        url="http://localhost:5555/auth/register",
        json={
            "email":name+"@email.com",
            "name":name,
            "password":"KDFJH498rnfd>-034,."
        }
    )
    return dict(response.json()) | {"name":name}

@pytest.fixture(scope='session')
def user1():
    return generate_user()

@pytest.fixture(scope='session')
def user2():
    return generate_user()

@pytest.fixture(scope='session')
def default():
    conn = mysql.connector.connect(host="localhost",user="root",password="23erf23",database="db")
    cursor = conn.cursor()
    cursor.execute("SELECT count(*) FROM ESG_Frameworks WHERE is_user_created = FALSE;")
    count = int(cursor.fetchone()[0])
    cursor.execute("SELECT name FROM ESG_Frameworks WHERE is_user_created = FALSE LIMIT 1;")
    example = cursor.fetchone()[0]
    
    return {"count":count,"example":example}

#---------------------------------------------------------------------------------------------------#

def route(x):
    return "http://localhost:5555/framework" + x


# test adding an empty one
def test_create_empty_framework(user1, user2, default):
    authorisation1 = "Bearer " + user1["token"]
    authorisation2 = "Bearer " + user2["token"]
    
    response = requests.post (
        url = route("/create"),
        json = {
            "name":"first",
            "metrics":[],
            "categories":[],
        },
        headers={"Authorization": authorisation1}
    )
    print(response.json())
    assert response.status_code == 200

    response = requests.post (
        url = route("/create"),
        json = {
            "name":"other first",
            "metrics":[],
            "categories":[],
        },
        headers={"Authorization": authorisation2}
    )
    assert response.status_code == 200
    
    # user1
    response = requests.get (
        url = route("/list-all"),
        headers={"Authorization": authorisation1}
    )
    assert response.status_code == 200
    frameworks = response.json()["frameworks"]
    assert len(frameworks) == (default["count"] + 1)

    # user2
    response = requests.get (
        url = route("/list-all"),
        headers={"Authorization": authorisation2}
    )
    assert response.status_code == 200
    frameworks = response.json()["frameworks"]
    assert len(frameworks) == (default["count"] + 1)
    

def testing_create_invalid_token():
    authorisation1 = "Bearer " + "not a valid token :)"
    
    response = requests.post (
        url = route("/create"),
        json = {
            "name": "a random name hopefully: )))",
            "metrics":[],
            "categories":[],
        },
        headers={"Authorization": authorisation1}
    )
    print(response.json())
    assert response.status_code == 403

def test_create_name_taken_by_user(user1):
    authorisation = "Bearer " + user1["token"]
    response = requests.post (
        url = route("/create"),
        json = {
            "name":"hello",
            "metrics":[],
            "categories":[],
        },
        headers={"Authorization": authorisation}
    )
    assert response.status_code == 200

    response = requests.post (
        url = route("/create"),
        json = {
            "name":"hello",
            "metrics":[],
            "categories":[],
        },
        headers={"Authorization": authorisation}
    )
    assert response.status_code == 400

def test_create_name_taken_by_default(user1,default):
    authorisation = "Bearer " + user1["token"]
    response = requests.post (
        url = route("/create"),
        json = {
            "name":default["example"],
            "metrics":[],
            "categories":[],
        },
        headers={"Authorization": authorisation}
    )
    assert response.status_code == 400

def test_create_name_used_by_other_user(user1, user2):
    authorisation1 = "Bearer " + user1["token"]
    authorisation2 = "Bearer " + user2["token"]
    
    response = requests.post (
        url = route("/create"),
        json = {
            "name":"yolo",
            "metrics":[],
            "categories":[],
        },
        headers={"Authorization": authorisation1}
    )
    assert response.status_code == 200

    response = requests.post (
        url = route("/create"),
        json = {
            "name":"yolo",
            "metrics":[],
            "categories":[],
        },
        headers={"Authorization": authorisation2}
    )
    assert response.status_code == 200

def test_adding_weightings_and_view(user1):
    authorisation = "Bearer " + user1["token"]

    metrics = [
        {"metric_id": 32, "weight": 91},
        {"metric_id": 12, "weight": 3}
    ]
    categories = [
        {"category": "E", "weight": 20},
        {"category": "G", "weight": 21}
    ]

    response = requests.post (
        url = route("/create"),
        json = {
            "name":"hectic",
            "metrics":metrics,
            "categories":categories,
        },
        headers={"Authorization": authorisation}
    )
    assert response.status_code == 200
    
    response = requests.get (
        url = route("/list-all"),
        headers={"Authorization": authorisation},
        params={"search_query":"hectic"}
    )
    assert response.status_code == 200
    frameworks = response.json()["frameworks"]
    assert len(frameworks) == 1

    fid = frameworks[0]["framework_id"]
    response = requests.get (
        url = route(f"/update_view/{fid}"),
        headers={"Authorization": authorisation},
    )
    print(response.json())
    assert response.status_code == 200
    info = response.json()
    assert info["name"] == "hectic"

    assert len(info["metrics"]) == 2
    for m in info["metrics"]:
        assert m["metric_id"] in (12,32)
        if m["metric_id"] == 12:
            assert m["weight"] == 3
        elif m["metric_id"] == 32:
            assert m["weight"] == 91
 

    assert len(info["categories"]) == 2
    for m in info["categories"]:
        assert m["category"] in "EG"
        if m["category"] == "E":
            assert m["weight"] == 20
        elif m["category"] == "G":
            assert m["weight"] == 21


# test forking one
def test_fork(user1, user2):
    authorisation = "Bearer " + user2["token"]
    metrics = [
        {"metric_id": 8, "weight": 10},
        {"metric_id": 9, "weight": 11}
    ]
    response = requests.post (
        url = route("/create"),
        json = {
            "name":"tofork",
            "metrics":metrics,
            "categories":[],
        },
        headers={"Authorization": authorisation}
    )
    assert response.status_code == 200
    x = response.json()
    fid = x["framework_id"]

    response = requests.post (
        url = route(f"/fork/{fid}"),
        json = {
            "name":"forked",
        },
        headers={"Authorization": authorisation}
    )
    assert response.status_code == 200

    response = requests.get (
        url = route("/list-all"),
        headers={"Authorization": authorisation},
        params={"search_query":"forked"}
    )
    assert response.status_code == 200
    x = response.json()["frameworks"]
    assert len(x) == 1

    # fork failure. other user forking
    response = requests.post (
        url = route(f"/fork/{fid}"),
        json = {
            "name":"forked",
        },
        headers={"Authorization": "Bearer " + user1["token"]}
    )
    assert response.status_code == 400

def test_update(user1, user2):
    authorisation1 = "Bearer " + user1["token"]
    authorisation2 = "Bearer " + user2["token"]

    response = requests.post (
        url = route("/create"),
        json = {
            "name":"toupdate",
            "metrics":[{"metric_id": 8, "weight": 10}],
            "categories":[],
        },
        headers={"Authorization": authorisation1}
    )
    assert response.status_code == 200
    fid = response.json().get("framework_id")

    # wrong user try updating
    response = requests.put (
        url = route(f"/update/{fid}"),
        json = {
            "name":"toupdate",
            "metrics":[{"metric_id": 8, "weight": 10}],
            "categories":[],
        },
        headers={"Authorization": authorisation2}
    )
    assert response.status_code == 400


    response = requests.put (
        url = route(f"/update/{fid}"),
        json = {
            "name":"newname",
            "metrics":[],
            "categories":[{"category":"E","weight":9}],
        },
        headers={"Authorization": authorisation1}
    )
    print(response.json())
    assert response.status_code == 200

    response = requests.get (
        url = route(f"/update_view/{fid}"),
        headers={"Authorization": authorisation1},
    )
    x = response.json()
    assert x["name"] == "newname"
    assert len(x["categories"]) == 1
    assert x["categories"][0] == {"category":"E","weight":9}
    assert len(x["metrics"]) == 0


def test_remove(user1,user2,default):
    authorisation1 = "Bearer " + user1["token"]
    authorisation2 = "Bearer " + user2["token"]

    response = requests.get (
        url = route("/list-all"),
        headers={"Authorization": authorisation1}
    )
    assert response.status_code == 200
    frameworks = response.json()["frameworks"]
    length = len(frameworks)
    for f in frameworks:
        # valid remove
        print(f)
        fid = f["framework_id"]
        if f["type"] == "SAVED":
            # other user removeing it error
            response = requests.delete (
                url = route(f"/remove/{fid}"),
                headers={"Authorization": authorisation2}
            )
            assert response.status_code == 400
            #valid remove
            response = requests.delete (
                url = route(f"/remove/{fid}"),
                headers={"Authorization": authorisation1}
            )
            # now recheck
            response = requests.get (
                url = route("/list-all"),
                headers={"Authorization": authorisation1},
            )
            assert len(response.json().get("frameworks")) == length - 1
            length -= 1

            assert response.status_code == 200
            # remove twice
            response = requests.delete (
                url = route(f"/remove/{fid}"),
                headers={"Authorization": authorisation2}
            )
            assert response.status_code == 400
        else:
            # remove default
            response = requests.delete (
                url = route(f"/remove/{fid}"),
                headers={"Authorization": authorisation2}
            )
            assert response.status_code == 400
    
    assert length == default["count"]

    # now remove the others as well for cleanup
    response = requests.get (
        url = route("/list-all"),
        headers={"Authorization": authorisation2}
    )
    frameworks = response.json()["frameworks"]
    for f in frameworks:
        if f["type"] == "SAVED":
            # other user removeing it error
            response = requests.delete (
                url = route(f"/remove/{f['framework_id']}"),
                headers={"Authorization": authorisation2}
            )
            print(response.json())
            assert response.status_code == 200

def test_delete_users(user1,user2):
    authorisation1 = "Bearer " + user1["token"]
    authorisation2 = "Bearer " + user2["token"]

    response = requests.post (
        url = "http://localhost:5555/auth/delete_account",
        headers={"Authorization": authorisation1}
    )
    print(response.json())
    assert response.status_code == 200
    response = requests.post (
        url = "http://localhost:5555/auth/delete_account",
        headers={"Authorization": authorisation2}
    )
    print(response.json())
    assert response.status_code == 200
