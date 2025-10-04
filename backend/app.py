from flask import Flask, jsonify, render_template, request
from database-client import get_connection
from flask_cors import CORS

app = Flask(__name__, template_folder='../frontend')
cors = CORS(app, origins='*')

@app.route("/api/colleges", methods=["GET"])
def get_colleges():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT code, name FROM colleges ORDER BY code;")
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    colleges = [{"code": r[0], "name": r[1]} for r in rows]
    return jsonify(colleges)
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True, port=8080)