class projectsDatabase:
    def __init__(self, client):
        self.db = client['projectsDB']
        self.project_collection = self.db['projects']

    def query_project(self, project_id):
        return self.project_collection.find_one({'projectId': project_id})

    def create_project(self, project_name, project_id, description, username): 
        # Check if a project with the same projectId already exists
        if self.project_collection.find_one({'projectId': project_id}):
            print(f"A project with the ID '{project_id}' already exists.")
            return False

        project = {
            'projectName': project_name,
            'projectId': project_id,
            'description': description,
            'users': [username],
            'coamt': 0
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
    
    def check_out(self, project_id, amount: int) -> bool:
        project = self.query_project(project_id)
        if project is None:
            print("Project not found.")
            return False

        result = self.project_collection.update_one(
            {'projectId': project_id},
            {'$inc': {'coamt': amount}}
        )
        
        if result.modified_count > 0:
            print(f"Successfully checked out {amount} units for project '{project_id}'.")
            return True
        else:
            print("Failed to check out hardware.")
            return False

    def check_in(self, project_id, amount: int) -> bool:
        project = self.query_project(project_id)
        if project is None:
            print("Project not found.")
            return False

        if project['coamt'] < amount:
            print("Cannot check in more than the current checked-out amount.")
            return False

        result = self.project_collection.update_one(
            {'projectId': project_id},
            {'$inc': {'coamt': -amount}}
        )

        if result.modified_count > 0:
            print(f"Successfully checked in {amount} units for project '{project_id}'.")
            return True
        else:
            print("Failed to check in hardware.")
            return False
