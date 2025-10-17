from flask import Blueprint, jsonify, request
from database_client import get_connection
from routes.auth  import token_required

colleges_bp = Blueprint("colleges", __name__)

@colleges_bp.route("/colleges", methods=["GET"])
@token_required
def get_colleges():
    try:
        with get_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute("SELECT code as collegecode, name as collegename FROM colleges ORDER BY code;")
                rows = cursor.fetchall()
        return jsonify(rows), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@colleges_bp.route("/colleges", methods=["POST"])
@token_required
def add_college():
    try:
        data = request.get_json()
        code = data.get("code")
        name = data.get("name")

        if not code or not name:
            return jsonify({"error": "Both code and name are required"}), 400

        with get_connection() as conn:
            with conn.cursor() as cursor:
                # duplicate checker
                cursor.execute("SELECT 1 FROM colleges WHERE code = %s;", (code,))
                if cursor.fetchone():
                    return jsonify({"error": f"College code '{code}' already exists"}), 400

                cursor.execute("SELECT 1 FROM colleges WHERE name = %s;", (name,))
                if cursor.fetchone():
                    return jsonify({"error": f"College name '{name}' already exists"}), 400

                cursor.execute(
                    "INSERT INTO colleges (code, name) VALUES (%s, %s) RETURNING code, name;",
                    (code, name),
                )
                new_college = cursor.fetchone()
            conn.commit()
        return jsonify(new_college), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@colleges_bp.route("/colleges/<code>", methods=["PUT"])
@token_required
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
                cursor.execute("SELECT * FROM colleges WHERE code = %s;", (code,))
                existing = cursor.fetchone()
                if not existing:
                    return jsonify({"error": "College not found"}), 404

                # duplicate checker after code changed
                if new_code != code:
                    cursor.execute("SELECT 1 FROM colleges WHERE code = %s;", (new_code,))
                    if cursor.fetchone():
                        return jsonify({"error": f"College code '{new_code}' already exists"}), 400

                # duplicate name checker
                cursor.execute("SELECT 1 FROM colleges WHERE name = %s AND code <> %s;", (new_name, code))
                if cursor.fetchone():
                    return jsonify({"error": f"College name '{new_name}' already exists"}), 400

                cursor.execute(
                    "UPDATE colleges SET code = %s, name = %s WHERE code = %s RETURNING code, name;",
                    (new_code, new_name, code),
                )
                updated_college = cursor.fetchone()
            conn.commit()
        return jsonify(updated_college), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500



@colleges_bp.route("/colleges/<code>", methods=["DELETE"])
@token_required
def delete_college(code):
    try:
        with get_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute("DELETE FROM colleges WHERE code = %s RETURNING code, name;", (code,))
                deleted = cursor.fetchone()
            conn.commit()
        if not deleted:
            return jsonify({"error": "College not found"}), 404
        return jsonify({"message": "College deleted", "deleted": deleted}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
