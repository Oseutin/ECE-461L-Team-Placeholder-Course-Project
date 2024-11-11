class projectsDatabase:
    def __init__(self, client):
        self.db = client['projectsDB']
        self.project_collection = self.db['projects']

    def query_project(self, project_id):
        return self.project_collection.find_one({'projectId': project_id})

    def create_project(self, project_name, project_id, description, username, initial_hardware=None):
        # Default initial hardware availability if not provided
        if initial_hardware is None:
            initial_hardware = {'HWSet1': 100, 'HWSet2': 100}
        
        # Check if a project with the same projectId already exists
        if self.project_collection.find_one({'projectId': project_id}):
            print(f"A project with the ID '{project_id}' already exists.")
            return False

        project = {
            'projectName': project_name,
            'projectId': project_id,
            'description': description,
            'users': [username],  # Link project to the creator
            'hardwareAvailability': initial_hardware  # Independent hardware availability
        }
        self.project_collection.insert_one(project)
        print(f"Project '{project_name}' created successfully.")
        return True

    def add_user(self, project_id, username):
        result = self.project_collection.update_one(
            {'projectId': project_id},
            {'$addToSet': {'users': username}}
        )
        return result.modified_count > 0

    def get_all_projects(self):
        projects = list(self.project_collection.find({}))
        for project in projects:
            project['_id'] = str(project['_id'])  # Convert ObjectId to string for JSON serialization
        return projects

    def get_projects_by_user(self, username):
        projects = list(self.project_collection.find({'users': username}))
        for project in projects:
            project['_id'] = str(project['_id'])  # Convert ObjectId to string for JSON serialization
        return projects

    def update_hardware_availability(self, project_id, hw_set_name, new_qty):
        self.project_collection.update_one(
            {'projectId': project_id},
            {'$set': {f'hardwareAvailability.{hw_set_name}': new_qty}}
        )