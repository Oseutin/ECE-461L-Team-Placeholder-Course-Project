from pymongo import MongoClient

class hardwareDatabase:
    def __init__(self, client):
        self.db = client['hardwareDB']
        self.hardware_collection = self.db['hardwareSets']

    def initialize_hardware_sets(self, hwset1_capacity=100, hwset2_capacity=100):
        if not self.hardware_collection.find_one({"hwName": "HWset1"}):
            hwset1 = {
                "hwName": "HWset1",
                "total_capacity": hwset1_capacity,
                "available_capacity": hwset1_capacity
            }
            self.hardware_collection.insert_one(hwset1)

        if not self.hardware_collection.find_one({"hwName": "HWset2"}):
            hwset2 = {
                "hwName": "HWset2",
                "total_capacity": hwset2_capacity,
                "available_capacity": hwset2_capacity
            }
            self.hardware_collection.insert_one(hwset2)

    def get_available_capacity(self, hwSetName):
        hw_set = self.hardware_collection.find_one({"hwName": hwSetName})
        return hw_set['available_capacity'] if hw_set else None

    def request_space(self, hwSetName, amount):
        hw_set = self.hardware_collection.find_one({"hwName": hwSetName})
        if hw_set and hw_set['available_capacity'] >= amount:
            new_capacity = hw_set['available_capacity'] - amount
            self.hardware_collection.update_one(
                {"hwName": hwSetName},
                {"$set": {"available_capacity": new_capacity}}
            )
            return True, amount
        if hw_set:
            checkedOut = hw_set['available_capacity']
            self.hardware_collection.update_one(
                {"hwName": hwSetName},
                {"$set": {"available_capacity": 0}}
            )
            return False, checkedOut
        return False, 0

    def return_space(self, hwSetName, amount):
        hw_set = self.hardware_collection.find_one({"hwName": hwSetName})
        if hw_set:
            if hw_set['available_capacity'] + amount <= hw_set['total_capacity']:
                new_capacity = min(hw_set['available_capacity'] + amount, hw_set['total_capacity'])
                self.hardware_collection.update_one(
                    {"hwName": hwSetName},
                    {"$set": {"available_capacity": new_capacity}}
                )
                return True
        return False
    
    def get_user_hardware(self, username, projects):
        user_inventory = {}

        for project in projects:
            project_id = project['projectId']
            hardware_sets = {
                "HWset1": project.get('coamt1', 0),
                "HWset2": project.get('coamt2', 0)
            }
            user_inventory[project_id] = hardware_sets

        return user_inventory
    
    def get_hardware_for_project(self):
        # initialize if doesn't exist
        if not self.hardware_collection.find_one({"hwName": "HWset1"}):
            self.initialize_hardware_sets()

        return [
            {
                "hwName": "HWset1",
                "total_capacity": 100,
                "available_capacity": self.get_available_capacity("HWset1")
            },
            {
                "hwName": "HWset2",
                "total_capacity": 100,
                "available_capacity": self.get_available_capacity("HWset2")
            }
        ]

