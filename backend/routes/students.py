from flask import Blueprint, jsonify, request
from database_client import get_connection

students_bp = Blueprint("students", __name__)

YearToString = {
    1: "First",
    2: "Second",
    3: "Third",
    4: "Fourth"
}
reverseYearToString = {v.lower(): k for k, v in YearToString.items()}


@students_bp.route("/students", methods=["GET"])
def get_students():
    try:
        with get_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute("""
                    SELECT id, firstname, lastname, program_code AS course, year, gender
                    FROM students
                    ORDER BY id;
                """)
                rows = cursor.fetchall()

        formatted_rows = []
        for row in rows:
            student = dict(row)
            year_num = student.get("year")
            student["year"] = YearToString.get(year_num, str(year_num))
            formatted_rows.append(student)

        return jsonify(formatted_rows), 200
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

        if isinstance(year, str):
            year = reverseYearToString.get(year.lower(), year)

        if not all([id, firstname, lastname, program_code, year, gender]):
            return jsonify({"error": "All fields are required"}), 400

        try:
            year = int(year)
        except ValueError:
            return jsonify({"error": "Year must be a number (1–4)"}), 400

        with get_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute("SELECT 1 FROM students WHERE id = %s;", (id,))
                if cursor.fetchone():
                    return jsonify({"error": f"Student ID '{id}' already exists"}), 400

                cursor.execute("SELECT 1 FROM programs WHERE code = %s;", (program_code,))
                if not cursor.fetchone():
                    return jsonify({"error": f"Program code '{program_code}' does not exist"}), 400

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

        if new_student and isinstance(new_student, dict):
            new_student["year"] = YearToString.get(new_student["year"], new_student["year"])

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

        if isinstance(year, str):
            year = reverseYearToString.get(year.lower(), year)

        if not all([new_id, firstname, lastname, program_code, year, gender]):
            return jsonify({"error": "All fields are required"}), 400

        try:
            year = int(year)
        except ValueError:
            return jsonify({"error": "Year must be a number (1–4)"}), 400

        with get_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute("SELECT * FROM students WHERE id = %s;", (id,))
                existing = cursor.fetchone()
                if not existing:
                    return jsonify({"error": "Student not found"}), 404

                if new_id != id:
                    cursor.execute("SELECT 1 FROM students WHERE id = %s;", (new_id,))
                    if cursor.fetchone():
                        return jsonify({"error": f"Student ID '{new_id}' already exists"}), 400

                cursor.execute("SELECT 1 FROM programs WHERE code = %s;", (program_code,))
                if not cursor.fetchone():
                    return jsonify({"error": f"Program code '{program_code}' does not exist"}), 400

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

        if updated_student and isinstance(updated_student, dict):
            updated_student["year"] = YearToString.get(updated_student["year"], updated_student["year"])

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
