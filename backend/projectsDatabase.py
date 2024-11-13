from backend.hardwareDatabase import hardwareDatabase


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
            'coamt1': 0,
            'coamt2': 0
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
            project['_id'] = str(project['_id'])
        return projects

    def get_projects_by_user(self, username):
        projects = list(self.project_collection.find({'users': username}))
        for project in projects:
            project['_id'] = str(project['_id'])
        return projects
    
    def check_out(self, project_id, hw_set: str, amount: int) -> bool:
        project = self.query_project(project_id)
        if project is None:
            print("Project not found.")
            return False

        coamt_field = 'coamt1' if hw_set == 'HWset1' else 'coamt2'

        result = self.project_collection.update_one(
            {'projectId': project_id},
            {'$inc': {coamt_field: amount}}
        )

        if result.modified_count > 0:
            print(f"Successfully checked out {amount} units for project '{project_id}' on {coamt_field}.")
            return True
        else:
            print("Failed to check out hardware.")
            return False

    def check_in(self, project_id, hw_set: str, amount: int) -> bool:
        project = self.query_project(project_id)
        if project is None:
            print("Project not found.")
            return False

        coamt_field = 'coamt1' if hw_set == 'HWset1' else 'coamt2'

        if project[coamt_field] < amount:
            print("Cannot check in more than the current checked-out amount.")
            return False

        result = self.project_collection.update_one(
            {'projectId': project_id},
            {'$inc': {coamt_field: -amount}}
        )

        if result.modified_count > 0:
            print(f"Successfully checked in {amount} units for project '{project_id}' on {coamt_field}.")
            return True
        else:
            print("Failed to check in hardware.")
            return False
