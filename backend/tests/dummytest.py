import pytest
from app import app

#Setup, do not worry about this part
@pytest.fixture
def client():
    app.testing = True
    with app.test_client() as client:
        yield client

'''
This is a example test of the API endpoint. Whenever you guys on the backend team create a new endpoint,
I would go into ChatGPT and ask it to write a couple of new tests for you guys to make sure that it works
as expected. The way you run a test is to cd backend, python pytest FILENAME.py where filename
will be where the tests are located. Make sure to have pytest installed!
'''
#dummy test to dummy welcome API endpoint
def test_welcome_endpoint(client):
    response = client.get('/welcome') 
    assert response.status_code == 200  
    assert response.json == {"message": "Welcome to the API!"}  
