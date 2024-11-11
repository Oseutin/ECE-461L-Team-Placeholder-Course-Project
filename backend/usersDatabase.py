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
        project_data = {
            'projectId': project_id,
            'hardware': {
                'HWSet1': 0,
                'HWSet2': 0
            }
        }

        result = self.users_collection.update_one(
            {'username': username, 'projects.projectId': {'$ne': project_id}},
            {'$push': {'projects': project_data}}
        )

        return result.modified_count > 0
    
    def check_out_hardware(self, username: str, project_id: str, hw_set_name: str, quantity: int) -> bool:
        user = self.__query_user(username)
        if not user:
            print("User not found")
            return False

        # Find the project and hardware availability
        project = next((p for p in user['projects'] if p['projectId'] == project_id), None)
        if not project:
            print("Project not found for user")
            return False

        # Check if enough hardware is available for checkout
        available_qty = project['hardware'].get(hw_set_name, 0)
        if quantity > available_qty:
            print(f"Not enough {hw_set_name} available to check out")
            return False

        # # Update the quantity in the hardware set
        # self.users_collection.update_one(
        #     {'username': username, 'projects.projectId': project_id},
        #     {'$inc': {f'projects.$.hardware.{hw_set_name}': -quantity}}
        # )
        # Update the hardware quantity in the database
        update_result = self.users_collection.update_one(
            {'username': username, 'projects.projectId': project_id},
            {'$inc': {f'projects.$.hardware.{hw_set_name}': -quantity}}
        )
    
    # Check if the update was successful
        if update_result.modified_count == 0:
            print("Failed to update the hardware quantity in the database")
        return False

        print(f"Successfully checked out {quantity} units of {hw_set_name}")
        return True

    def check_in_hardware(self, username: str, project_id: str, hw_set_name: str, quantity: int) -> bool:
        """
        Adds the specified quantity back to the user's hardware availability for a project.
        """
        user = self.__query_user(username)
        if not user:
            print("User not found")
            return False

        # Find the project
        project = next((p for p in user['projects'] if p['projectId'] == project_id), None)
        if not project:
            print("Project not found for user")
            return False

        # Update the quantity in the hardware set
        self.users_collection.update_one(
            {'username': username, 'projects.projectId': project_id},
            {'$inc': {f'projects.$.hardware.{hw_set_name}': quantity}}
        )
