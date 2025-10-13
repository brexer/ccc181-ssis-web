from flask import Blueprint, jsonify, request
from database_client import get_connection

students_bp = Blueprint("students", __name__)

@students_bp.route("/students", methods=["GET"])
def get_students():
    try:
        with get_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute("SELECT id, firstname, lastname, program_code as course, year, gender FROM students ORDER BY id;")
                rows = cursor.fetchall()
            return jsonify(rows), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@students_bp.route("/students", methods=["POST"])
def add_student():
    try:
        data = request.get_json()
        id = data.get("id")
        firstname = data.get("firstname")
        lastname = data.get("lastname")
        program_code = data.get("program_code")
        year = data.get("year")
        gender = data.get("gender")

        # Validate required fields
        if not all([id, firstname, lastname, program_code, year, gender]):
            return jsonify({"error": "All fields are required"}), 400

        with get_connection() as conn:
            with conn.cursor() as cursor:
                # Check duplicate student ID
                cursor.execute("SELECT 1 FROM students WHERE id = %s;", (id,))
                if cursor.fetchone():
                    return jsonify({"error": f"Student ID '{id}' already exists"}), 400

                # Validate program_code exists in programs table
                cursor.execute("SELECT 1 FROM programs WHERE code = %s;", (program_code,))
                if not cursor.fetchone():
                    return jsonify({"error": f"Program code '{program_code}' does not exist"}), 400

                # Insert student
                cursor.execute(
                    """
                    INSERT INTO students (id, firstname, lastname, program_code, year, gender)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    RETURNING id, firstname, lastname, program_code, year, gender;
                    """,
                    (id, firstname, lastname, program_code, year, gender)
                )
                new_student = cursor.fetchone()
            conn.commit()
        return jsonify(new_student), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@students_bp.route("/students/<id>", methods=["PUT"])
def update_student(id):
    try:
        data = request.get_json()
        new_id = data.get("id")
        firstname = data.get("firstname")
        lastname = data.get("lastname")
        program_code = data.get("program_code")
        year = data.get("year")
        gender = data.get("gender")

        # Validate required fields
        if not all([new_id, firstname, lastname, program_code, year, gender]):
            return jsonify({"error": "All fields are required"}), 400

        with get_connection() as conn:
            with conn.cursor() as cursor:
                # Check if student exists
                cursor.execute("SELECT * FROM students WHERE id = %s;", (id,))
                existing = cursor.fetchone()
                if not existing:
                    return jsonify({"error": "Student not found"}), 404

                # Check for duplicate new ID if changed
                if new_id != id:
                    cursor.execute("SELECT 1 FROM students WHERE id = %s;", (new_id,))
                    if cursor.fetchone():
                        return jsonify({"error": f"Student ID '{new_id}' already exists"}), 400

                # Validate program_code exists
                cursor.execute("SELECT 1 FROM programs WHERE code = %s;", (program_code,))
                if not cursor.fetchone():
                    return jsonify({"error": f"Program code '{program_code}' does not exist"}), 400

                # Perform update
                cursor.execute(
                    """
                    UPDATE students
                    SET id = %s,
                        firstname = %s,
                        lastname = %s,
                        program_code = %s,
                        year = %s,
                        gender = %s
                    WHERE id = %s
                    RETURNING id, firstname, lastname, program_code, year, gender;
                    """,
                    (new_id, firstname, lastname, program_code, year, gender, id),
                )
                updated_student = cursor.fetchone()
            conn.commit()

        return jsonify(updated_student), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@students_bp.route("/students/<id>", methods=["DELETE"])
def delete_student(id):
    try:
        with get_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(
                    "DELETE FROM students WHERE id = %s RETURNING id, firstname, lastname;",
                    (id,)
                )
                deleted = cursor.fetchone()
            conn.commit()

        if not deleted:
            return jsonify({"error": "Student not found"}), 404

        return jsonify({
            "message": f"Student '{deleted['id']}' deleted successfully",
            "deleted": deleted
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500