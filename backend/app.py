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
    # Extract data from request

    # Connect to MongoDB

    # Fetch the user's projects using the usersDB module

    # Close the MongoDB connection

    # Return a JSON response
    return jsonify({})

# Route for creating a new project


@app.route('/create_project', methods=['POST'])
def create_project():
    # Extract data from request

    # Connect to MongoDB

    # Attempt to create the project using the projectsDB module

    # Close the MongoDB connection

    # Return a JSON response
    return jsonify({})

# Route for getting project information


@app.route('/get_project_info', methods=['POST'])
def get_project_info():
    # Extract data from request

    # Connect to MongoDB

    # Fetch project information using the projectsDB module

    # Close the MongoDB connection

    # Return a JSON response
    return jsonify({})

# Route for getting all hardware names


@app.route('/get_all_hw_names', methods=['POST'])
def get_all_hw_names():
    # Connect to MongoDB

    # Fetch all hardware names using the hardwareDB module

    # Close the MongoDB connection

    # Return a JSON response
    return jsonify({})

# Route for getting hardware information


@app.route('/get_hw_info', methods=['POST'])
def get_hw_info():
    # Extract data from request

    # Connect to MongoDB

    # Fetch hardware set information using the hardwareDB module

    # Close the MongoDB connection

    # Return a JSON response
    return jsonify({})

# Route for checking out hardware


@app.route('/check_out', methods=['POST'])
def check_out():
    # Extract data from request

    # Connect to MongoDB

    # Attempt to check out the hardware using the projectsDB module

    # Close the MongoDB connection

    # Return a JSON response
    return jsonify({})

# Route for checking in hardware


@app.route('/check_in', methods=['POST'])
def check_in():
    # Extract data from request

    # Connect to MongoDB

    # Attempt to check in the hardware using the projectsDB module

    # Close the MongoDB connection

    # Return a JSON response
    return jsonify({})

# Route for creating a new hardware set


@app.route('/create_hardware_set', methods=['POST'])
def create_hardware_set():
    # Extract data from request

    # Connect to MongoDB

    # Attempt to create the hardware set using the hardwareDB module

    # Close the MongoDB connection

    # Return a JSON response
    return jsonify({})

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
