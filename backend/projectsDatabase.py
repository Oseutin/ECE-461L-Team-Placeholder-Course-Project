from pymongo import MongoClient
import hardwareDatabase

# Function to query a project by its ID
def queryProject(client, projectId):
    db = client['projectDB']
    project_collection = db['projects']
    return project_collection.find_one({'projectId': projectId})

# Function to create a new project
def createProject(client, projectName, description):
    db = client['projectDB']
    project_collection = db['projects']
    projectCount = project_collection.count_documents({})
    projectId = projectCount + 1
    project = {
        'projectName': projectName,
        'projectId': projectId,
        'description': description,
        'hwSets': {},  # Hardware usage starts empty
        'users': []    # No users at the start
    }
    project_collection.insert_one(project)

# Function to add a user to a project
def addUser(client, projectId, username):
    db = client['projectDB']
    project_collection = db['projects']
    result = project_collection.update_one(
        {'projectId': projectId},
        {'$addToSet': {'users': username}}
    )
    return result.modified_count > 0

# Function to update hardware usage in a project
def updateUsage(client, projectId, hwSetName, qty):
    db = client['projectDB']
    project_collection = db['projects']
    result = project_collection.update_one(
        {'projectId': projectId},
        {'$set': {f'hwSets.{hwSetName}': qty}}
    )
    return result.modified_count > 0

# Function to check out hardware for a project
def checkOutHW(client, projectId, hwSetName, qty, username):
    # Check if the project exists
    project = queryProject(client, projectId)
    if project is None:
        return False  # Project not found

    # Create hardwareDatabase instance and check availability
    hardware_db = hardwareDatabase.hardwareDatabase(client)
    if hardware_db.requestSpace(hwSetName, qty):
        # If successful, update the project's usage
        current_qty = project['hwSets'].get(hwSetName, 0)
        new_qty = current_qty + qty
        updateUsage(client, projectId, hwSetName, new_qty)
        return True
    return False  # Not enough hardware available

# Function to check in hardware for a project
def checkInHW(client, projectId, hwSetName, qty, username):
    # Check if the project exists
    project = queryProject(client, projectId)
    if project is None:
        return False  # Project not found
    
    # Check if the project has enough hardware to return
    current_qty = project['hwSets'].get(hwSetName, 0)
    if current_qty < qty:
        return False  # Can't check in more hardware than checked out

    # Create hardwareDatabase instance and update availability
    hardware_db = hardwareDatabase.hardwareDatabase(client)
    hardware_db.returnSpace(hwSetName, qty)
    
    # Update project's hardware usage
    new_qty = current_qty - qty
    updateUsage(client, projectId, hwSetName, new_qty)
    
    return True
