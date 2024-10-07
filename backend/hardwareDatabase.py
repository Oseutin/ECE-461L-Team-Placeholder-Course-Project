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

class HardwareSet:
    # constructor
    def __init__(self):
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

    def get_capacity(self):
        return self.__initCapacity

    def get_capacity(self):
        return self.__capacity
    
    # MongoDB related
    def to_dict(self):
        return {
        'hwName': self.__hwName,
        'capacity': self.__capacity,
        'initCapacity': self.__initCapacity
        }

    # Function to create a new hardware set
    def createHardwareSet(client, hwSetName, initCapacity):
        # Create a new hardware set in the database
        db = client['hardware_inventory']
        collection = db['hardware_sets']
        
        # Create the hardware set
        hardware_set = HardwareSet(hwSetName, initCapacity, initCapacity)
        
        # Insert into MongoDB
        collection.insert_one(hardware_set.to_dict())
        #pass

    # Function to query a hardware set by its name
    def queryHardwareSet(client, hwSetName):
        # Query and return a hardware set from the database
        db = client['hardware_inventory']
        collection = db['hardware_sets']
        
        # Find the hardware set by name
        return collection.find_one({'hwName': hwSetName})
        #pass

    # Function to update the availability of a hardware set
    def updateAvailability(client, hwSetName, newAvailability):
        # Update the availability of an existing hardware set
        db = client['hardware_inventory']
        collection = db['hardware_sets']
        
        # Update the availability in the database
        result = collection.update_one(
            {'hwName': hwSetName},
            {'$set': {'availability': newAvailability}}
        )
        return result.modified_count > 0
        #pass

    # Function to request space from a hardware set
    def requestSpace(client, hwSetName, amount):
        # Request a certain amount of hardware and update availability
        db = client['hardware_inventory']
        collection = db['hardware_sets']
        
        # Find the hardware set
        hardware_set = collection.find_one({'hwName': hwSetName})
        if hardware_set and hardware_set['availability'] >= amount:
            new_availability = hardware_set['availability'] - amount
            
            # Update availability
            collection.update_one(
                {'hwName': hwSetName},
                {'$set': {'availability': new_availability}}
            )
            return True
        else:
            return False
        #pass

    # Function to get all hardware set names
    def getAllHwNames(client):
        # Get and return a list of all hardware set names
        db = client['hardware_inventory']
        collection = db['hardware_sets']
        
        # Get all the hardware set names
        hardware_sets = collection.find({}, {'hwName': 1})
        return [hw['hwName'] for hw in hardware_sets]
        #pass