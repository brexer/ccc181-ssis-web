from flask import Flask, jsonify, render_template
from flask_cors import CORS

app = Flask(__name__, template_folder='../frontend')
cors = CORS(app, origins='*')

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True, port=8080)