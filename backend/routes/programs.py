from flask import Blueprint, jsonify, request
from database_client import get_connection

programs_bp = Blueprint("programs", __name__)

@programs_bp.route("/programs", methods = ["GET"])
def get_programs():
    try:
        with get_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute("SELECT code, name, college_code FROM programs ORDER BY code;")
                rows = cursor.fetchall()
        return jsonify(rows), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@programs_bp.route("/programs", methods =["POST"])
def add_program():
    try:
        data = request.get_json()
        code = data.get("code")
        name = data.get("name")

        if not code or not name:
            return jsonify({"error": "Both code and name are required"}), 400
        
        with get_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute("SELECT 1 FROM programs WHERE code =%s;", (code,))
                if cursor.fetchone():
                    return jsonify({"error": f"Program code '{code}' already exists"}), 400
                
                cursor.execute("SELECT 1 FROM programs WHERE name =%s;", (name,))
                if cursor.fetchone():
                    return jsonify({"error": f"Program name '{name}' already exists"}), 400
                
                cursor.execute(
                    "INSERT INTO programs (code, name) VALUES (%s, %s) RETURNING code, name;",
                    (code, name),
                )
                new_program = cursor.fetchone()
            conn.commit()
        return jsonify(new_program), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@programs_bp.route("/programs/<code>", methods=["DELETE"])
def delete_program(code):
    try:
        with get_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute("DELETE FROM programs WHERE code = %s RETURNING code, name;", (code,))
                deleted = cursor.fetchone()
            conn.commit()
        if not deleted:
            return jsonify({"error": "Program not found"}), 404
        return jsonify({"message": "Program deleted", "deleted": deleted}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@programs_bp.route("/programs/<code>", methods=["PUT"])
def update_college(code):
    try:
        data = request.get_json()
        new_code = data.get("code")
        new_name = data.get("name")

        if not new_code or not new_name:
            return jsonify({"error": "Both code and name are required"}), 400

        with get_connection() as conn:
            with conn.cursor() as cursor:
                # duplicate checker
                cursor.execute("SELECT * FROM programs WHERE code = %s;", (code,))
                existing = cursor.fetchone()
                if not existing:
                    return jsonify({"error": "Program not found"}), 404

                # duplicate checker after code changed
                if new_code != code:
                    cursor.execute("SELECT 1 FROM programs WHERE code = %s;", (new_code,))
                    if cursor.fetchone():
                        return jsonify({"error": f"Program code '{new_code}' already exists"}), 400

                # duplicate name checker
                cursor.execute("SELECT 1 FROM programs WHERE name = %s AND code <> %s;", (new_name, code))
                if cursor.fetchone():
                    return jsonify({"error": f"Program name '{new_name}' already exists"}), 400

                cursor.execute(
                    "UPDATE programs SET code = %s, name = %s WHERE code = %s RETURNING code, name;",
                    (new_code, new_name, code),
                )
                updated_program = cursor.fetchone()
            conn.commit()
        return jsonify(updated_program), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500