"""Simple Flask test"""
from flask import Flask

app = Flask(__name__)

@app.route('/test')
def test():
    return {"status": "ok"}

if __name__ == '__main__':
    print("Starting Flask...")
    app.run(host='127.0.0.1', port=5555, debug=False)
    print("Flask exited")
