# Import necessary libraries and modules
from pymongo import MongoClient

'''
Structure of Hardware Set entry:
HardwareSet = {
    'hwName': hwSetName,
    'capacity': initCapacity,
    'availability': initCapacity
}
'''

class hardwareDatabase:
    def __init__(self, client):
        self.__client = client
        self.__db = client['hardwareDB']
        self.__hardwareSet_collection = self.__db['hardwareSets']

    # Function to initialize hardware sets in the database
    def initialize_hardware_sets(self, hwset1_capacity=500, hwset2_capacity=500):
        # Initialize HWset1 if it doesn't exist
        if not self.__hardwareSet_collection.find_one({"hwName": "HWset1"}):
            hwset1 = {
                "hwName": "HWset1",
                "total_capacity": hwset1_capacity,
                "available_capacity": hwset1_capacity
            }
            self.__hardwareSet_collection.insert_one(hwset1)

        # Initialize HWset2 if it doesn't exist
        if not self.__hardwareSet_collection.find_one({"hwName": "HWset2"}):
            hwset2 = {
                "hwName": "HWset2",
                "total_capacity": hwset2_capacity,
                "available_capacity": hwset2_capacity
            }
            self.__hardwareSet_collection.insert_one(hwset2)


    def updateUsage(client, projectId, hwSetName, qty):
        db = client['projectDB']
        project_collection = db['projects']
        result = project_collection.update_one(
            {'projectId': projectId},
            {'$set': {f'hwSets.{hwSetName}': qty}}
        )
        return result.modified_count > 0

    # Function to get current available capacity for a specific hardware set
    def get_available_capacity(self, hwSetName):
        hw_set = self.__hardwareSet_collection.find_one({"hwName": hwSetName})
        return hw_set['available_capacity'] if hw_set else None

    # Function to check out hardware for a project
    def checkInHW(self, projectId, hwSetName, qty, username):
        # Check if the project exists directly in the projects collection
        project = self.__project_collection.find_one({'projectId': projectId})
        if project is None:
            return False  # Project not found

        # Check if the project has enough hardware to return
        current_qty = project['hwSets'].get(hwSetName, 0)
        return_qty = min(qty, current_qty)

        # Update available capacity in hardware set
        self.returnSpace(hwSetName, return_qty)

        # Update project's hardware usage with the returned quantity
        new_qty = current_qty - return_qty
        self.__project_collection.update_one(
            {'projectId': projectId},
            {'$set': {f'hwSets.{hwSetName}': new_qty}}
        )

        # Return True if the full quantity was returned, otherwise False
        return return_qty == qty

    # Function to request space from a specific hardware set
    def requestSpace(self, hwSetName, amount):
        hw_set = self.__hardwareSet_collection.find_one({"hwName": hwSetName})
        if hw_set and hw_set['available_capacity'] >= amount:
            new_capacity = hw_set['available_capacity'] - amount
            self.__hardwareSet_collection.update_one(
                {"hwName": hwSetName},
                {"$set": {"available_capacity": new_capacity}}
            )
            return True
        return False

    # Function to return hardware to a specific hardware set
    def returnSpace(self, hwSetName, amount):
        hw_set = self.__hardwareSet_collection.find_one({"hwName": hwSetName})
        if hw_set:
            new_capacity = hw_set['available_capacity'] + amount
            new_capacity = min(new_capacity, hw_set['total_capacity'])
            self.__hardwareSet_collection.update_one(
                {"hwName": hwSetName},
                {"$set": {"available_capacity": new_capacity}}
            )
            return True
        return False