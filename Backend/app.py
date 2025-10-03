from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
from werkzeug.security import generate_password_hash, check_password_hash
import os

app = Flask(__name__)
CORS(app)

# Config DB (coloca tus datos Supabase)
DB_HOST = "tu_host_supabase"
DB_NAME = "tu_db"
DB_USER = "tu_usuario"
DB_PASS = "tu_contraseña"

conn = psycopg2.connect(host=DB_HOST, database=DB_NAME, user=DB_USER, password=DB_PASS)
cursor = conn.cursor()

UPLOAD_FOLDER = os.path.join(os.getcwd(), "archivos")
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# -------------------
# LOGIN
# -------------------
@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    usuario = data.get("usuario")
    password = data.get("password")

    cursor.execute("SELECT u.id, u.nombre, u.password, r.nombre FROM usuarios u JOIN roles r ON u.rol_id = r.id WHERE u.usuario=%s", (usuario,))
    user = cursor.fetchone()

    if user and check_password_hash(user[2], password):
        return jsonify({"success": True, "nombre": user[1], "rol": user[3]})
    return jsonify({"success": False})

# -------------------
# REGISTRO
# -------------------
@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()
    usuario = data.get("usuario")
    nombre = data.get("nombre")
    password = data.get("password")
    rol = data.get("rol", "usuario")  # default usuario

    cursor.execute("SELECT id FROM roles WHERE nombre=%s", (rol,))
    rol_id = cursor.fetchone()
    if not rol_id:
        return jsonify({"success": False, "msg": "Rol inválido"})
    rol_id = rol_id[0]

    hashed_pass = generate_password_hash(password)
    try:
        cursor.execute("INSERT INTO usuarios (usuario, nombre, password, rol_id) VALUES (%s, %s, %s, %s)",
                       (usuario, nombre, hashed_pass, rol_id))
        conn.commit()
        return jsonify({"success": True})
    except:
        conn.rollback()
        return jsonify({"success": False, "msg": "Usuario ya existe"})

# -------------------
# SUBIDA DE ARCHIVOS
# -------------------
@app.route("/api/upload/<int:semana>", methods=["POST"])
def upload_file(semana):
    if 'archivo' not in request.files:
        return jsonify({"success": False, "msg": "No hay archivo"})
    file = request.files['archivo']
    if file.filename == '':
        return jsonify({"success": False, "msg": "Archivo vacío"})

    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)

    cursor.execute("INSERT INTO archivos (semana, nombre_archivo, url_archivo, creado_por) VALUES (%s,%s,%s,%s)",
                   (semana, file.filename, filepath, 1))
    conn.commit()

    return jsonify({"success": True, "archivo": file.filename})

# -------------------
# LISTAR ARCHIVOS
# -------------------
@app.route("/api/files", methods=["GET"])
def list_files():
    cursor.execute("SELECT semana, nombre_archivo, url_archivo FROM archivos")
    files = cursor.fetchall()
    result = [{"semana": f[0], "nombre": f[1], "url": f[2]} for f in files]
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)
