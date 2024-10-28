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

    # Function to get current available capacity for a specific hardware set
    def get_available_capacity(self, hwSetName):
        hw_set = self.__hardwareSet_collection.find_one({"hwName": hwSetName})
        return hw_set['available_capacity'] if hw_set else None

    # Function to request space from a specific hardware set
    def requestSpace(self, hwSetName, amount):
        # Get the hardware set's current available capacity
        hw_set = self.__hardwareSet_collection.find_one({"hwName": hwSetName})
        
        if hw_set and hw_set['available_capacity'] >= amount:
            new_capacity = hw_set['available_capacity'] - amount
            # Update available capacity in the database
            self.__hardwareSet_collection.update_one(
                {"hwName": hwSetName},
                {"$set": {"available_capacity": new_capacity}}
            )
            return True
        return False

    # Function to return hardware to a specific hardware set
    def returnSpace(self, hwSetName, amount):
        # Get the hardware set's current available capacity
        hw_set = self.__hardwareSet_collection.find_one({"hwName": hwSetName})
        
        if hw_set:
            new_capacity = hw_set['available_capacity'] + amount
            # Ensure we do not exceed the total capacity
            new_capacity = min(new_capacity, hw_set['total_capacity'])
            # Update available capacity in the database
            self.__hardwareSet_collection.update_one(
                {"hwName": hwSetName},
                {"$set": {"available_capacity": new_capacity}}
            )
            return True
        return False

    # Function to get all hardware set names (should return ["HWset1", "HWset2"])
    def getAllHwNames(self):
        hardware_sets = self.__hardwareSet_collection.find({}, {'hwName': 1})
        return [hw['hwName'] for hw in hardware_sets]
