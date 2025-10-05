from flask import Flask
from waitress import serve

app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello from Waitress!"

if __name__ == "__main__":
    print("Starting Waitress server...")
    try:
        print("About to call serve()...")
        serve(app, host="0.0.0.0", port=5003, threads=2)
        print("serve() returned")
    except Exception as e:
        print(f"Error: {e}")
