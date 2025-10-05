from flask import Flask

app = Flask(__name__)

@app.route('/')
def hello():
    return "Hello!"

if __name__ == '__main__':
    print("Starting minimal Flask test...")
    app.run(host='0.0.0.0', port=5002, debug=False, use_reloader=False)
    print("Flask exited!")
