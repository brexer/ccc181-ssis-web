from flask import Flask, jsonify, render_template, request
from database_client import get_connection
from flask_cors import CORS
from routes.colleges import colleges_bp

app = Flask(__name__, template_folder='../frontend')
cors = CORS(app, origins='*')

app.register_blueprint(colleges_bp, url_prefix="/api")

def index():
    return render_template('index.html')

if __name__ == '__main__':
    add_testers()
    app.run(debug=True, port=8080)


    