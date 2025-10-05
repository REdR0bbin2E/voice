"""Test waitress server"""
from flask import Flask
from waitress import serve

app = Flask(__name__)

@app.route('/test')
def test():
    return {"status": "ok"}

if __name__ == '__main__':
    print("Starting with Waitress...")
    serve(app, host='127.0.0.1', port=5556)
    print("Waitress exited")
