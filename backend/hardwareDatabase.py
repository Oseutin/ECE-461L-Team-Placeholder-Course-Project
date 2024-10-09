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
    # constructor
    def __init__(self, client):
        self.__client = client
        self.__db = client['hardwareDB']
        self.__hardwareSet_collection = self.__db['hardwareSets']
        self.__hwName
        self.__capacity
        self.__initCapacity

    # Setters
    def set_hwName(self, hwSetName):
        self.__hwName = hwSetName

    def initialize_capacity(self, initCapacity):
        self.__initCapacity = initCapacity

    def set_capacity(self, capacity):
        self.__capacity = capacity

    # Getters
    def get_hwName(self):
        return self.__hwName

    def get_initcapacity(self):
        return self.__initCapacity

    def get_capacity(self):
        return self.__capacity
    
    # MongoDB related

    # Function to create a new hardware set
    def createHardwareSet(self, hwSetName, initCapacity):
        # Create a new hardware set in the database
        hardware_set = {
            'hwName': self.__hwName,
            'initCapacity': self.__initCapacity,
            'capacity': self.__capacity
        }

        self.__hardwareSet_collection.insert_one(hardware_set)

    # Function to query a hardware set by its name
    def queryHardwareSet(self, hwSetName):
        # Query and return a hardware set from the database
        return self.__hardwareSet_collection.find_one({'hwName': hwSetName})

    # Function to update the availability of a hardware set
    def updateAvailability(self, hwSetName, newAvailability):
        # Update the availability of an existing hardware set
        result = self.__hardwareSet_collection.update_one(
            {'hwName': hwSetName},
            {'$set': {'capacity': newAvailability}}
        )
        return result.modified_count > 0

    # Function to request space from a hardware set
    def requestSpace(self, hwSetName, amount):
        # Request a certain amount of hardware and update availability
        hardware_set = self.__hardwareSet_collection.find_one(
            {'hwName': hwSetName})
        if hardware_set and hardware_set['capacity'] >= amount:
            new_capacity = hardware_set['capacity'] - amount
            # Update capacity
            self.__hardwareSet_collection.update_one(
                {'hwName': hwSetName},
                {'$set': {'capacity': new_capacity}}
            )
            return True
        return False

    # Function to get all hardware set names
    def getAllHwNames(self):
        # Get and return a list of all hardware set names
        hardware_sets = self.__hardwareSet_collection.find({}, {'hwName': 1})
        return [hw['hwName'] for hw in hardware_sets]
