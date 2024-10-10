import pytest
from ..usersDatabase import usersDatabase  

# Mock MongoClient for testing
class MockMongoClient:
    def __init__(self):
        self.users = []

    def insert_one(self, user):
        if any(u['username'] == user['username'] for u in self.users):
            raise Exception("User already exists!")
        self.users.append(user)

    def find_one(self, query):
        return next((user for user in self.users if user['username'] == query['username']), None)

    def update_one(self, query, update):
        for user in self.users:
            if user['username'] == query['username']:
                user.update(update['$set'])
                return

class MockUsersDatabase(usersDatabase):
    def __init__(self, client):
        self.client = client

    def add_user(self, username, password):
        user = {"username": username, "password": password}
        try:
            self.client.insert_one(user)
            return True
        except Exception as e:
            return False

    def get_users_collection(self):
        return self.client

@pytest.fixture
def users_db():
    # Create a mock MongoClient instance
    client = MockMongoClient()
    db = MockUsersDatabase(client)
    return db

def test_add_user(users_db):
    assert users_db.add_user("new_user", "Password123!") is True
    assert len(users_db.get_users_collection().users) == 1  # Ensure user was added

def test_add_existing_user(users_db):
    users_db.add_user("existing_user", "Password123!")
    # Now try to add the same user again and expect a failure
    assert users_db.add_user("existing_user", "Password123!") is False  # Should fail

def test_add_multiple_users(users_db):
    # Add multiple users and ensure they are added correctly
    assert users_db.add_user("user1", "Password123!") is True
    assert users_db.add_user("user2", "Password123!") is True
    assert len(users_db.get_users_collection().users) == 2  # Two users should exist

def test_find_existing_user(users_db):
    users_db.add_user("test_user", "Password123!")
    user = users_db.get_users_collection().find_one({"username": "test_user"})
    assert user is not None  # User should be found
    assert user['username'] == "test_user"  # Usernames should match

def test_find_nonexistent_user(users_db):
    user = users_db.get_users_collection().find_one({"username": "nonexistent_user"})
    assert user is None  # No user should be found

def test_update_existing_user(users_db):
    users_db.add_user("updatable_user", "Password123!")
    assert users_db.get_users_collection().find_one({"username": "updatable_user"})['password'] == "Password123!"
    users_db.client.update_one({"username": "updatable_user"}, {"$set": {"password": "NewPassword456!"}})
    updated_user = users_db.get_users_collection().find_one({"username": "updatable_user"})
    assert updated_user['password'] == "NewPassword456!"  # Password should be updated

def test_update_nonexistent_user(users_db):
    result = users_db.client.update_one({"username": "nonexistent_user"}, {"$set": {"password": "SomePassword"}})
    # No exception should be raised, but nothing should be updated
    assert users_db.get_users_collection().find_one({"username": "nonexistent_user"}) is None



def test_username_case_sensitivity(users_db):
    # Check if usernames are case-sensitive
    users_db.add_user("CaseSensitive", "Password123!")
    assert users_db.add_user("casesensitive", "Password123!") is True  # Should allow different case
    assert len(users_db.get_users_collection().users) == 2  # Two users should exist
