from pymongo import MongoClient

class usersDatabase:
    def __init__(self, client: MongoClient):
        self.db = client['userDB']
        self.users_collection = self.db['users']

    def add_user(self, username: str, password: str) -> bool:
        if self.__query_user(username):
            print("User already exists!")
            return False
        new_user = {
            'username': username,
            'password': password,
            'projects': []
        }
        self.users_collection.insert_one(new_user)
        print("User added successfully!")
        return True

    def __query_user(self, username: str):
        return self.users_collection.find_one({'username': username})

    def get_user(self, username: str):
        return self.__query_user(username)

    def add_project_to_user(self, username: str, project_id: str) -> bool:
        result = self.users_collection.update_one(
            {'username': username},
            {'$addToSet': {'projects': project_id}}
        )
        return result.modified_count > 0
    
    def add_project_to_user(self, username: str, project_id: str, initial_hardware=None) -> bool:
        if initial_hardware is None:
            initial_hardware = {'HWSet1': 0, 'HWSet2': 0}
        
        result = self.users_collection.update_one(
            {'username': username},
            {'$addToSet': {'projects': {'projectId': project_id, 'hardware': initial_hardware}}}
        )
        return result.modified_count > 0
    
    def update_user_hardware(self, username, project_id, hw_set_name, quantity, operation):
        user = self.get_user(username)
        for project in user['projects']:
            if project['projectId'] == project_id:
                if operation == 'checkout':
                    project[hw_set_name] += quantity
                elif operation == 'checkin':
                    project[hw_set_name] -= quantity
                self.users_collection.update_one(
                    {'username': username},
                    {'$set': {'projects': user['projects']}}
                )
                break

    def get_user_hardware_quantity(self, username, project_id, hw_set_name):
        user = self.get_user(username)
        for project in user['projects']:
            if project['projectId'] == project_id:
                return project.get(hw_set_name, 0)
        return 0
