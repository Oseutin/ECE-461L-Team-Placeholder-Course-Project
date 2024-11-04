from pymongo import MongoClient
import hardwareDatabase



# Function to query a project by its ID
def queryProject(client, projectId):
    db = client['projectsDB']
    project_collection = db['projects']
    return project_collection.find_one({'projectId': projectId})

# Function to create a new project, ensuring uniqueness by projectId
def createProject(client, projectName, projectId, description,username):
    db = client['projectsDB']
    project_collection = db['projects']

    # Check if a project with the same projectId already exists
    if project_collection.find_one({'projectId': projectId}):
        print(f"A project with the ID '{projectId}' already exists.")
        return False

    project = {
        'projectName': projectName,
        'projectId': projectId,
        'description': description,
        'hwSets': {},  # Hardware usage starts empty
        'users': [username]   
    }
    project_collection.insert_one(project)
    print(f"Project '{projectName}' with ID '{projectId}' created successfully.")
    return True

# Function to add a user to a project
def addUser(client, projectId, username):
    db = client['projectsDB']
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
    
    # Check actual available quantity
    available_qty = hardware_db.getAvailableSpace(hwSetName)
    checkout_qty = min(qty, available_qty)

    if checkout_qty > 0:
        # Attempt to reserve as much as possible
        hardware_db.requestSpace(hwSetName, checkout_qty)

        # Update project's hardware usage with the checked-out quantity
        current_qty = project['hwSets'].get(hwSetName, 0)
        new_qty = current_qty + checkout_qty
        updateUsage(client, projectId, hwSetName, new_qty)

    # Return True if full quantity was available, otherwise False
    return checkout_qty == qty

# Function to check in hardware for a project
def checkInHW(client, projectId, hwSetName, qty, username):
    # Check if the project exists
    project = queryProject(client, projectId)
    if project is None:
        return False  # Project not found

    # Check if the project has enough hardware to return
    current_qty = project['hwSets'].get(hwSetName, 0)
    return_qty = min(qty, current_qty)

    # Create hardwareDatabase instance and update availability
    hardware_db = hardwareDatabase.hardwareDatabase(client)
    hardware_db.returnSpace(hwSetName, return_qty)

    # Update project's hardware usage with the returned quantity
    new_qty = current_qty - return_qty
    updateUsage(client, projectId, hwSetName, new_qty)

    # Return True if the full quantity was returned, otherwise False
    return return_qty == qty