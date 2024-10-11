import pytest
from unittest.mock import patch, MagicMock
from app import app  # Adjust this import based on your app structure

# Set up the Flask test client
@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

# Test for missing username or password
def test_add_user_missing_fields(client):
    response = client.post('/add_user', json={"username": "", "password": "testpass"})
    assert response.status_code == 400
    assert response.get_json() == {"error": "Username and password are required fields"}

    response = client.post('/add_user', json={"username": "testuser", "password": ""})
    assert response.status_code == 400
    assert response.get_json() == {"error": "Username and password are required fields"}

# Test for duplicate user addition
@patch('app.MongoClient')
@patch('app.usersDatabase.usersDatabase')
def test_add_user_duplicate_user(mock_users_db, mock_mongo_client, client):
    mock_mongo_client.return_value = MagicMock()
    mock_db_instance = MagicMock()
    mock_users_db.return_value = mock_db_instance
    mock_db_instance.add_user.return_value = False  # Simulate a duplicate user

    response = client.post('/add_user', json={"username": "testuser", "password": "testpass"})
    
    assert response.status_code == 400
    assert response.get_json() == {"error": "Failed to add user due to validation or duplicate issues"}

# Test for successful user addition
@patch('app.MongoClient')
@patch('app.usersDatabase.usersDatabase')
def test_add_user_success(mock_users_db, mock_mongo_client, client):
    mock_mongo_client.return_value = MagicMock()
    mock_db_instance = MagicMock()
    mock_users_db.return_value = mock_db_instance
    mock_db_instance.add_user.return_value = True  # Simulate successful user addition

    response = client.post('/add_user', json={"username": "testuser", "password": "testpass"})
    
    assert response.status_code == 201
    assert response.get_json() == {"message": "User added successfully"}
