from flask import Flask, jsonify, render_template, request
from database_client import get_connection
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
    colleges = [{"code": r["code"], "name": r["name"]} for r in rows]
    return jsonify(colleges)
    
def add_testers():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO colleges (code, name) VALUES ('CCS', 'College of Computer Studies') ON CONFLICT (code) DO NOTHING;")
    cursor.execute("INSERT INTO colleges (code, name) VALUES ('CAS', 'College of Arts and Sciences') ON CONFLICT (code) DO NOTHING;")
    conn.commit()
    cursor.close()
    conn.close()

def index():
    return render_template('index.html')

if __name__ == '__main__':
    add_testers()
    app.run(debug=True, port=8080)


    