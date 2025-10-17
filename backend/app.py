from flask import Flask, jsonify, render_template, request
from database_client import get_connection
from flask_cors import CORS
from routes.colleges import colleges_bp
from routes.programs import programs_bp
from routes.students import students_bp
from routes.auth import auth_bp

app = Flask(__name__, template_folder='../frontend')
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

app.register_blueprint(auth_bp, url_prefix="/api")
app.register_blueprint(colleges_bp, url_prefix="/api")
app.register_blueprint(programs_bp, url_prefix="/api")
app.register_blueprint(students_bp, url_prefix="/api")

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True, port=5000)

