from bson.objectid import ObjectId
from flask import Flask, request, jsonify
from flask_cors import CORS
from flasgger import Swagger
from pymongo import MongoClient
from pymongo.server_api import ServerApi
import jwt
import datetime
from werkzeug.security import generate_password_hash, check_password_hash

from usersDatabase import usersDatabase
import projectsDatabase
import hardwareDatabase

MONGODB_SERVER = "mongodb+srv://amybae:abcdefg@placeholdercluster.odsig.mongodb.net/myDatabase?retryWrites=true&w=majority"

app = Flask(__name__)
Swagger(app)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

SECRET_KEY = "VerySecret"

# Utility to verify JWT token
def verify_token(token):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return None

# Utility to serialize MongoDB ObjectId
def serialize_user(user):
    user['_id'] = str(user['_id'])
    return user

# Login
@app.route('/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'OK'}), 200

    user_data = request.get_json()
    username = user_data.get('username')
    password = user_data.get('password')

    if not username or not password:
        return jsonify({"msg": "Username and password are required fields"}), 400

    with MongoClient(MONGODB_SERVER, server_api=ServerApi('1')) as client:
        db = usersDatabase(client)
        user_info = db.get_user(username)
        if user_info is None or not check_password_hash(user_info['password'], password):
            return jsonify({"msg": "Invalid username or password"}), 400

        token = jwt.encode(
            {"username": username, "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)},
            SECRET_KEY,
            algorithm="HS256"
        )

    return jsonify({
        "msg": "User logged in successfully",
        "access_token": token,
        "user": serialize_user(user_info)
    }), 200

# Register new user
@app.route('/add_user', methods=['POST', 'OPTIONS'])
def add_user():
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'OK'})
        response.headers.update({
            'Access-Control-Allow-Origin': 'http://localhost:3000',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Credentials': 'true'
        })
        return response, 200

    user_data = request.get_json()
    username = user_data.get('username')
    password = user_data.get('password')

    if not username or not password:
        return jsonify({"msg": "Username and password are required fields"}), 400

    hashed_password = generate_password_hash(password)

    with MongoClient(MONGODB_SERVER, server_api=ServerApi('1')) as client:
        db = usersDatabase(client)
        if not db.add_user(username, hashed_password):
            return jsonify({"msg": "Failed to add user due to validation or duplicate issues"}), 400

    return jsonify({"msg": "User added successfully"}), 201

# Create project
@app.route('/create_project', methods=['POST'])
def create_project():
    token = request.headers.get('Authorization', '').split(' ')[1]
    user_data = verify_token(token)
    if not user_data:
        return jsonify({'msg': 'Unauthorized access'}), 401

    username = user_data.get('username')
    project_data = request.json.get('project_data')
    if not username or not project_data:
        return jsonify({'msg': 'Username and project data are required'}), 400

    project_name = project_data.get('name')
    project_id = project_data.get('id')
    description = project_data.get('description')

    if not project_name or not project_id:
        return jsonify({'msg': 'Project name and ID are required'}), 400
    
    if not description:
        description = ""

    with MongoClient(MONGODB_SERVER, server_api=ServerApi('1')) as client:
        project_db = projectsDatabase.projectsDatabase(client)
        user_db = usersDatabase(client)

        user = user_db.get_user(username)
        if not user:
            return jsonify({'msg': 'User not found'}), 404

        if not project_db.create_project(project_name, project_id, description, username):
            return jsonify({"msg": "Project ID already exists"}), 400

        user_db.add_project_to_user(username, project_id)

    return jsonify({"msg": "Project created and added to user successfully"}), 200

@app.route('/inventory', methods=['GET'])
def fetch_inventory():
    token = request.headers.get('Authorization', '').split(' ')[1]
    user_data = verify_token(token)
    if not user_data:
        return jsonify({'msg': 'Unauthorized access'}), 401

    username = user_data['username']

    with MongoClient(MONGODB_SERVER, server_api=ServerApi('1')) as client:
        project_db = projectsDatabase.projectsDatabase(client)
        hardware_db = hardwareDatabase.hardwareDatabase(client)

        # Fetch all projects
        projects = project_db.get_projects_by_user(username)
        
        # Retrieve hardware inventory specific to the user
        user_inventory = hardware_db.get_user_hardware(username, projects)

    return jsonify({"projects": projects, "userInventory": user_inventory}), 200

# Join project
@app.route('/join_project', methods=['POST'])
def join_project():
    token = request.headers.get('Authorization', '').split(' ')[1]
    user_data = verify_token(token)
    if not user_data:
        return jsonify({'msg': 'Unauthorized access'}), 401

    username = user_data.get('username')
    project_id = request.json.get('id')

    if not username or not project_id:
        return jsonify({'msg': 'Username and project ID are required'}), 400

    with MongoClient(MONGODB_SERVER, server_api=ServerApi('1')) as client:
        project_db = projectsDatabase.projectsDatabase(client)
        user_db = usersDatabase(client)

        project = project_db.query_project(project_id)
        if not project:
            return jsonify({'msg': 'Project not found'}), 404

        user = user_db.get_user(username)
        if not user:
            return jsonify({'msg': 'User not found'}), 404

        if project_db.add_user(project_id, username):
            user_db.add_project_to_user(username, project_id)
            return jsonify({'msg': f'User {username} joined project {project_id} successfully'}), 200
        else:
            return jsonify({'msg': 'User is already a member of the project or an error occurred'}), 400

@app.route('/hardware_sets/<project_id>', methods=['GET'])
def get_hardware_sets(project_id):
    # Verify the JWT token
    token = request.headers.get('Authorization', '').split(' ')[1]
    user_data = verify_token(token)
    if not user_data:
        return jsonify({'msg': 'Unauthorized access'}), 401

    with MongoClient(MONGODB_SERVER, server_api=ServerApi('1')) as client:

        hardware_db = hardwareDatabase.hardwareDatabase(client)
        
        hardware_sets = hardware_db.get_hardware_for_project()
        
    return jsonify({"hardwareSets": hardware_sets}), 200

@app.route('/projects/<project_id>/checkout', methods=['POST'])
def checkout_hardware(project_id):
    # from projectsDatabase import projectsDatabase
    token = request.headers.get('Authorization', '').split(' ')[1]
    user_data = verify_token(token)
    if not user_data:
        return jsonify({'msg': 'Unauthorized access'}), 401

    data = request.get_json()
    hw_set = data.get('hw_name')
    qty = data.get('quantity')

    if hw_set not in ['HWset1', 'HWset2'] or qty is None:
        return jsonify({'msg': 'Hardware set (HWset1 or HWset2) and quantity are required'}), 400

    with MongoClient(MONGODB_SERVER, server_api=ServerApi('1')) as client:
        project_db = projectsDatabase.projectsDatabase(client)
        hardware_db = hardwareDatabase.hardwareDatabase(client)

        validAmt, amt = hardware_db.request_space(hw_set, qty)
        if validAmt:
            if project_db.check_out(project_id, hw_set, amt):
                return jsonify({'msg': f'{amt} units checked out successfully for project {project_id}'}), 200
            else:
                return jsonify(
                    {'msg': 'Unable to check out the requested quantity. Ensure availability and valid quantity.'}), 400
        else:
            project_db.check_out(project_id, hw_set, amt)
            return jsonify({'msg': f'only {amt} units checked out, amount requested ({qty}) exceeded available capacity for project {project_id}'}), 200



@app.route('/projects/<project_id>/checkin', methods=['POST'])
def checkin_hardware(project_id):
    # from projectsDatabase import projectsDatabase
    token = request.headers.get('Authorization', '').split(' ')[1]
    user_data = verify_token(token)
    if not user_data:
        return jsonify({'msg': 'Unauthorized access'}), 401

    data = request.get_json()
    hw_set = data.get('hw_name')
    qty = data.get('quantity')

    if hw_set not in ['HWset1', 'HWset2'] or qty is None:
        return jsonify({'msg': 'Hardware set (HWset1 or HWset2) and quantity are required'}), 400

    with MongoClient(MONGODB_SERVER, server_api=ServerApi('1')) as client:
        project_db = projectsDatabase.projectsDatabase(client)
        hardware_db = hardwareDatabase.hardwareDatabase(client)

        if project_db.check_in(project_id, hw_set, qty):
            if hardware_db.return_space(hw_set, qty):
                return jsonify({'msg': f'{qty} units checked in successfully for project {project_id}'}), 200
            else:
                return jsonify(
                {'msg': 'Failed to check in hardware. Check the checked-out quantity and try again.'}), 400
        else:
            return jsonify(
                {'msg': 'Failed to check in hardware. Check the checked-out quantity and try again.'}), 400

# Main entry point
if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)
