import pytest
import schemathesis
import requests

# Load your OpenAPI specification from the Flask app's /spec endpoint
schema = schemathesis.from_uri("http://127.0.0.1:5000/spec")  # Use the correct endpoint for your app

# Create tests based on the loaded schema
@schema.parametrize()
def test_api(case):
    case.call_and_validate()