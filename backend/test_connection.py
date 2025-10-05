import os
from pymongo import MongoClient
from dotenv import load_dotenv

print("Attempting to connect to the database...")

# Load the .env file
load_dotenv()

# Get the connection string from the environment variable
mongo_uri = os.getenv("MONGO_URI")

if not mongo_uri:
    print("ERROR: MONGO_URI not found. Did you create the .env file correctly?")
else:
    try:
        # Create a new client and connect to the server
        client = MongoClient(mongo_uri)

        # Send a ping to confirm a successful connection
        client.admin.command('ping')
        print("Ping successful! You are connected to MongoDB!")
    
    except Exception as e:
        print("Connection failed. Error:")
        print(e)