from pymongo import MongoClient
import projectsDatabase

class usersDatabase:
    '''
    Structure of User entry:
    User = {
        'username': username,
        'password': password,
        'projects': [project1_ID, project2_ID, ...]
    }
    '''
    
    def __init__(self, client: MongoClient):
        # Private instance variables
        self._client = client
        self._db = self._client['userDB']  # Access the 'userDB' database
        self._users_collection = self._db['users']  # Collection for users

    # Getters and Setters for accessing private variables
    def get_client(self):
        return self._client

    def get_db(self):
        return self._db

    def get_users_collection(self):
        return self._users_collection

    # Function to add a new user
    def add_user(self, username: str, password: str) -> bool:
        if self.__query_user(username):
            print("User already exists!")
            return False

        new_user = {
            'username': username,
            'password': password,
            'projects': []
        }
        self._users_collection.insert_one(new_user)
        print("User added successfully!")
        return True

    # Helper function to query a user by username
    def __query_user(self, username: str):
        return self._users_collection.find_one({'username': username})

    # Getter for retrieving a user by username
    def get_user(self, username: str):
        user = self.__query_user(username)
        if not user:
            print(f"User {username} not found!")
            return None
        return user

    # Setter for updating user information
    def update_user_password(self, username: str, new_password: str) -> bool:
        if self.__query_user(username):
            self._users_collection.update_one(
                {'username': username},
                {'$set': {'password': new_password}}
            )
            print(f"Password for {username} updated successfully!")
            return True
        else:
            print(f"User {username} not found!")
            return False

    # Function to authenticate user login
    def login(self, username: str, password: str) -> bool:
        user = self.__query_user(username)
        if user and user['password'] == password:
            print("Login successful!")
            return True
        print("Incorrect password or user not found!")
        return False

    # Setter for adding a project to a user's project list
    def join_project(self, username: str, project_id: str) -> bool:
        user = self.__query_user(username)
        if not user:
            print(f"User {username} not found!")
            return False

        project = projectsDatabase.getProject(project_id)
        if not project:
            print(f"Project {project_id} not found!")
            return False

        if project_id not in user['projects']:
            self._users_collection.update_one(
                {'username': username},
                {'$push': {'projects': project_id}}
            )
            print(f"User {username} successfully added to project {project_id}.")
            return True
        else:
            print(f"User {username} is already part of the project {project_id}.")
            return False

    # Getter for retrieving the list of projects for a user
    def get_user_projects(self, username: str):
        user = self.__query_user(username)
        if not user:
            print(f"User {username} not found!")
            return None
        return user.get('projects', [])

    # Setter for updating the user's project list directly
    def set_user_projects(self, username: str, new_projects: list) -> bool:
        if self.__query_user(username):
            self._users_collection.update_one(
                {'username': username},
                {'$set': {'projects': new_projects}}
            )
            print(f"Projects for {username} updated successfully!")
            return True
        else:
            print(f"User {username} not found!")
            return False
