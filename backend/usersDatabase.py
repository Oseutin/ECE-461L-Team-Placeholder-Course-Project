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
