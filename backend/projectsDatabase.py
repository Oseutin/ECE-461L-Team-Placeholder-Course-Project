# Import necessary libraries and modules
from pymongo import MongoClient

import hardwareDatabase

'''
Structure of Project entry:
Project = {
    'projectName': projectName,
    'projectId': projectId,
    'description': description,
    'hwSets': {HW1: 0, HW2: 10, ...},
    'users': [user1, user2, ...]
}
'''

# Function to query a project by its ID
def queryProject(client, projectId):
    # Query and return a project from the database
    # accessing projectDB and projects collection
    db = client['projectDB']
    project_collection = db['projects']
    
    return project_collection.find_one({'projectId': projectId})

# Function to create a new project
def createProject(client, projectName, projectId, description):
    # Create a new project in the database
    # accessing projectDB and projects collection
    db = client['projectDB']
    project_collection = db['projects']
    
    # creating doc
    project = {
        'projectName': projectName,
        'projectId': projectId,
        'description': description,
        'hwSets': {},  # Hardware usage starts empty
        'users': []    # No users at the start
    }
    
    # inserting new project into the collection
    project_collection.insert_one(project)

# Function to add a user to a project
def addUser(client, projectId, username):
    # Add a user to the specified project
    # accessing projectDB and projects collection
    db = client['projectDB']
    project_collection = db['projects']
    
    # this is where user gets added to the project
    result = project_collection.update_one(
        {'projectId': projectId},
        {'$addToSet': {'users': username}}  #$addToSet avoids duplicates
    )

    # returning true if user was added
    return result.modified_count > 0

# Function to update hardware usage in a project
def updateUsage(client, projectId, hwSetName, qty):
    # Update the usage of a hardware set in the specified project
    # accessing projectDB and projects collection
    db = client['projectDB']
    project_collection = db['projects']
    
    # this is where usage of the hardware set in the project gets updated
    result = project_collection.update_one(
        {'projectId': projectId},
        {'$set': {f'hwSets.{hwSetName}': qty}}
    )
    
    # returning true if update was successful
    return result.modified_count > 0

# Function to check out hardware for a project
def checkOutHW(client, projectId, hwSetName, qty, username):
    # Check out hardware for the specified project and update availability
    # does project and hardware set exist?
    project = queryProject(client, projectId)
    if (project == None):
        return False  # project not found

    # requesting space
    if hardwareDatabase.requestSpace(client, hwSetName, qty): # successful
        # updating the project's usage
        current_qty = project['hwSets'].get(hwSetName, 0)
        new_qty = current_qty + qty
        updateUsage(client, projectId, hwSetName, new_qty)
        
        return True
    else:
        return False  # not enough hardware available or hardware set not found

# Function to check in hardware for a project
def checkInHW(client, projectId, hwSetName, qty, username):
    # Check in hardware for the specified project and update availability
    # does project and hardware set exist?
    project = queryProject(client, projectId)
    if (project == None):
        return False  # project not found
    
    # checking if project has enough hardware checked out
    current_qty = project['hwSets'].get(hwSetName, 0)
    if current_qty < qty:
        return False  # can't check in more hardware than checked out
    
    # updating hardware availability
    hardwareDatabase.updateAvailability(client, hwSetName, current_qty + qty)
    
    # updating project's hardware usage
    new_qty = current_qty - qty
    updateUsage(client, projectId, hwSetName, new_qty)
    
    return True