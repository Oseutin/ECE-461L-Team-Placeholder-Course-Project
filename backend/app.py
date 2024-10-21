# Import necessary libraries and modules
from bson.objectid import ObjectId
from flask import Flask, request, jsonify
from flasgger import Swagger
from flask_swagger import swagger
from pymongo import MongoClient
from pymongo.server_api import ServerApi

# Import custom modules for database interactions
import usersDatabase
import projectsDatabase
import hardwareDatabase

# Define the MongoDB connection string
MONGODB_SERVER = "mongodb+srv://amybae:abcdefg@placeholdercluster.odsig.mongodb.net/?retryWrites=true&w=majority&appName=PlaceholderCluster"

# Initialize a new Flask web application
app = Flask(__name__)
swagg = Swagger(app)

##########################################################################################################################################
# IGNORE UNTIL FURTHER NOTICE I WILL EXPLAIN NEXT WEEK DURING RECITATION


@app.route('/welcome', methods=['GET'])
def welcome():
    """
    Welcome endpoint.
    ---
    responses:
      200:
        description: Returns a welcome message.
        examples:
          message: Welcome to the API!
    """
    return jsonify({"message": "Welcome to the API!"})


@app.route("/spec")
def spec():
    return jsonify(swagger(app))
#########################################################################################################################################

def serialize_user(user):
    user['_id'] = str(user['_id'])  # Convert ObjectId to string
    return user

# Route for user login
@app.route('/login', methods=['POST'])
def login():
    # Extract data from request
    user_data = request.get_json()
    username = user_data.get('username')
    password = user_data.get('password')

    if not username or not password:
        return jsonify({"error": "Username and password are required fields"}), 400

    # Connect to MongoDB
    client = MongoClient(MONGODB_SERVER, server_api=ServerApi('1'))
    # Send a ping to confirm a successful connection
    try:
        client.admin.command('ping')
        print("Pinged your deployment. You successfully connected to MongoDB!")
    except Exception as e:
        print(e)
        client.close()  # Close the client in case of connection failure
        return jsonify({"error": "Could not connect to the database"}), 500
    
    # Attempt to add the user using the usersDB module
    db = usersDatabase.usersDatabase(client)
    user_info = db.login(username, password)
    if user_info is None:
        client.close()  # Close the client after login fails
        return jsonify({"error": "Failed to add user due to validation or duplicate issues"}), 400
    # Close the client after successful login
    user_info = serialize_user(user_info)
    client.close()  
    return jsonify({
        "message": "User logged in successfully",
        "user": user_info  # Include user data in the response
    }), 200


# Route for the main page (Work in progress)


@app.route('/main')
def mainPage():
    # Extract data from request

    # Connect to MongoDB

    # Fetch user projects using the usersDB module

    # Close the MongoDB connection

    # Return a JSON response
    return jsonify({})

# Route for joining a project


@app.route('/join_project', methods=['POST'])
def join_project():
    # Extract data from request

    # Connect to MongoDB

    # Attempt to join the project using the usersDB module

    # Close the MongoDB connection

    # Return a JSON response
    return jsonify({})


# Route for adding a new user
@app.route('/add_user', methods=['POST'])
def add_user():
    # Extract data from request
    user_data = request.get_json()
    username = user_data.get('username')
    password = user_data.get('password')

    if not username or not password:
        return jsonify({"error": "Username and password are required fields"}), 400

    # Connect to MongoDB
    client = MongoClient(MONGODB_SERVER, server_api=ServerApi('1'))
    # Send a ping to confirm a successful connection
    try:
        client.admin.command('ping')
        print("Pinged your deployment. You successfully connected to MongoDB!")
    except Exception as e:
        print(e)
        client.close()  # Close the client in case of connection failure
        return jsonify({"error": "Could not connect to the database"}), 500
    
    # Attempt to add the user using the usersDB module
    db = usersDatabase.usersDatabase(client)
    if not db.add_user(username, password):
        client.close()  # Close the client if user addition fails
        return jsonify({"error": "Failed to add user due to validation or duplicate issues"}), 400

    # Close the client after successful operation
    client.close()  
    return jsonify({"message": "User added successfully"}), 201



# Route for getting the list of user projects
@app.route('/get_user_projects_list', methods=['POST'])
def get_user_projects_list():
    try:
        # Extract data from request
        user_id = request.json.get('user_id')
        if not user_id:
            return jsonify({'error': 'User ID is required'}), 400

        # Connect to MongoDB
        client = MongoClient(MONGODB_SERVER, server_api=ServerApi('1'))
        user_db = usersDatabase(client)
        project_db = projectsDatabase(client)

        # Fetch the user's projects
        user = user_db.get_user(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404

        projects = project_db.get_projects_by_user(user_id)
        project_list = [project for project in projects]

        # Close the MongoDB connection
        client.close()

        # Return a JSON response with the projects list
        return jsonify({'projects': project_list}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Route for creating a new project


@app.route('/create_project', methods=['POST']) 
def create_project():
    try:
        # Extract data from request
        user_id = request.json.get('user_id')
        project_data = request.json.get('project_data')
        
        if not user_id or not project_data:
            return jsonify({'error': 'User ID and project data are required'}), 400

        # Connect to MongoDB
        client = MongoClient(MONGODB_SERVER, server_api=ServerApi('1'))
        project_db = projectsDatabase(client)

        # Create a new project
        project_id = project_db.create_project({
            'user_id': user_id,
            **project_data
        })

        # Close the MongoDB connection
        client.close()

        # Return a JSON response with the result
        return jsonify({"success": True, "message": "Project created successfully", "result": result}), 200

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

# Route for getting project information


@app.route('/get_project_info', methods=['POST'])
def get_project_info():
    try:
        # Extract data from request
        project_id = request.get_json().get('project_id')

        # Connect to MongoDB
        client = MongoClient("mongodb://localhost:27017/")
        db = client["your_db_name"]

        # Fetch project information using the projectsDB module
        project_info = projectsDatabase.get_project_info(db, project_id)

        # Close the MongoDB connection
        client.close()

        # Return a JSON response with the project information
        return jsonify({"success": True, "project_info": project_info}), 200

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

# Route for getting all hardware names


@app.route('/get_all_hw_names', methods=['POST'])
def get_all_hw_names():
    try:
        # Connect to MongoDB
        client = MongoClient("mongodb://localhost:27017/")
        db = client["your_db_name"]

        # Fetch all hardware names using the hardwareDB module
        hw_names = hardwareDatabase.get_all_hw_names(db)

        # Close the MongoDB connection
        client.close()

        # Return a JSON response with the hardware names
        return jsonify({"success": True, "hardware_names": hw_names}), 200

    # error handling
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

# Route for checking out hardware


@app.route('/check_out', methods=['POST'])
def check_out():
    try:
        # Extract data from request
        checkout_data = request.get_json()

        # Connect to MongoDB
        client = MongoClient("mongodb://localhost:27017/")
        db = client["your_db_name"]

        # Attempt to check out the hardware using the projectsDB module
        result = projectsDatabase.check_out_hardware(db, checkout_data)

        # Close the MongoDB connection
        client.close()

        # Return a JSON response with the result
        return jsonify({"success": True, "message": "Hardware checked out successfully", "result": result}), 200

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

# Route for checking in hardware


@app.route('/check_in', methods=['POST'])
def check_in():
    try:
        # Extract data from request
        checkin_data = request.get_json()

        # Connect to MongoDB
        client = MongoClient("mongodb://localhost:27017/")
        db = client["your_db_name"]

        # Attempt to check in the hardware using the projectsDB module
        result = projectsDatabase.check_in_hardware(db, checkin_data)

        # Close the MongoDB connection
        client.close()

        # Return a JSON response with the result
        return jsonify({"success": True, "message": "Hardware checked in successfully", "result": result}), 200

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

# Route for creating a new hardware set


@app.route('/create_hardware_set', methods=['POST'])
def create_hardware_set():
    try:
        # Extract data from request
        hardware_data = request.get_json()

        # Connect to MongoDB
        client = MongoClient("mongodb://localhost:27017/")
        db = client["your_db_name"]

        # Attempt to create the hardware set using the hardwareDB module
        result = hardwareDatabase.create_hardware_set(db, hardware_data)

        # Close the MongoDB connection
        client.close()

        # Return a JSON response with the result
        return jsonify({"success": True, "message": "Hardware set created successfully", "result": result}), 200

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

# Route for checking the inventory of projects


@app.route('/api/inventory', methods=['GET'])
def check_inventory():
    # Connect to MongoDB

    # Fetch all projects from the HardwareCheckout.Projects collection

    # Close the MongoDB connection

    # Return a JSON response
    return jsonify({})


# Main entry point for the application
if __name__ == '__main__':
    # Please do not change this
    app.run(host='127.0.0.1', port=5000)
