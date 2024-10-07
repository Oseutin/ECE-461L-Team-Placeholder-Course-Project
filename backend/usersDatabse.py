# Import necessary libraries and modules
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
    
    def __init__(self, client):
        self.client = client
        self.db = client['userDB']  # Create or access the user database
        self.users_collection = self.db['users']  # Collection to store user data
    
    # Function to add a new user
    def addUser(self, username, password):
        # Check if the user already exists
        if self.__queryUser(username):
            print("User already exists!")
            return False
        
        # Add a new user to the database
        user = {
            'username': username,
            'password': password,
            'projects': []
        }
        self.users_collection.insert_one(user)
        print("User added successfully!")
        return True
    
    # Helper function to query a user by username
    def __queryUser(self, username):
        # Query and return a user from the database
        user = self.users_collection.find_one({'username': username})
        return user
    
    # Function to log in a user
    def login(self, username, password):
        # Authenticate a user and return login status
        user = self.__queryUser(username)
        if user:
            if user['password'] == password:
                print("Login successful!")
                return True
            else:
                print("Incorrect password!")
        else:
            print("User not found!")
        return False
    
    # Function to add a user to a project
    def joinProject(self, projectId):
        # Verify if the user exists
        user = self.users_collection.find_one({'username': username})
        if not user:
            print("User not found!")
            return False
        
        # Verify if the project exists
        project = projectsDatabase.getProject(projectId)
        if not project:
            print("Project not found!")
            return False
        
        # Add the project to the user's project list if it's not already there
        if projectId not in user['projects']:
            self.users_collection.update_one(
                {'username': username},
                {'$push': {'projects': projectId}}
            )
            print(f"User {username} successfully added to project {projectId}.")
            return True
        else:
            print(f"User {username} is already part of the project {projectId}.")
            return False
    
    # Function to get the list of projects for a user
    def getUserProjectsList(self, username):
        # Get and return the list of projects a user is part of
        user = self.users_collection.find_one({'username': username})
        if not user:
            print("User not found!")
            return None
        return user.get('projects', [])
