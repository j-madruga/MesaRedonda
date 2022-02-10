# imports
from os import putenv
from flask import Flask, jsonify, request, make_response
from flask_cors import CORS, cross_origin
from functools import wraps
import json, random, jwt

# Guardamos nuestro servidor flask en app
app = Flask(__name__)

# Instancio app dentro de objecto CORS
CORS(app, resources={r"/*": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'

# guardo la SECREY_KEY
app.config['SECREY_KEY'] = 'loyalsolutions'

# Importa los productos desde products.json
with open("../../../db/products.json", "r") as products:
    products = json.load(products)
# Importa los usuarios desde users.json
with open("../../../db/users.json", "r") as users:
    users = json.load(users)

# Funcion decoradora que solicita el token
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        secret = app.config["SECREY_KEY"]
        if 'token' in request.headers:
            token = request.headers['token']
        if not token:
            return make_response(jsonify({'message': 'token requerido'}), 401)
        try:
            decoded = jwt.decode(token, secret, algorithms=["HS256"])
            current_user = [user for user in users if user["id"] == decoded["user"]["id"]] # checkea si existe usuario por su id        
        except:
            return make_response(jsonify({'message': 'token invalido'}), 401)
        return f(current_user, *args, **kwargs)
    return decorated

# --------------------------------- PRODUCTS --------------------------------- #
# GET
@app.route('/api/v1/products', methods=['GET'])
# ---------------- Funcion que RETORNA TODOS los productos ------------------- #
def get_products():
    return jsonify(products)

# ---------------------------------- SIGNUP ---------------------------------- #
# POST 
@app.route('/api/v1/signup', methods=['POST'])
# --------------------- Funcion que crea un nuevu usuario -------------------- #
# requires a JSON format BODY {
#   name: string,
#   email: string, 
#   password: string, 
# }
def create_user():
    new_id = random.randint(1,1000)
    found_user = [user for user in users if user["email"] == request.json['email']] # checkea si existe id
    if(len(found_user) == 0):
        new_user = {
            "id": new_id,
            "name": request.json["name"],
            "email": request.json["email"],
            "password": request.json["password"],
            "purchases": {}
        }
        secret = app.config["SECREY_KEY"]
        token = jwt.encode({"user": new_user}, secret, algorithm="HS256")
        users.append(new_user) # añade el nuevo user al diccionario
        users_json = json.dumps(users, indent = 4) # guarda los usuarios en formato JSON
        with open("../../../db/users.json", "w") as outfile: 
            outfile.write(users_json) # escribe los usuarios en users.json
        return jsonify({"token": token,"message": "usuario cargado exitosamente"}) # retorna todos los users
    else: 
        return jsonify({"message": "el email ya se encuentra registrado"})

# ----------------------------------- LOGIN ---------------------------------- #
# POST
@app.route('/api/v1/login', methods=['POST'])
# ------------------ Funcion que hace el login de un usuario ----------------- #
# requires a JSON format BODY {
#   email: string, 
#   password: string, 
# }
def login():
    found_user = [user for user in users if user["email"] == request.json['email'] and user["password"] == request.json["password"]] # checkea si existe email
    if len(found_user) == 0:
        response = make_response(jsonify({'message': 'usuario no registrado/datos incorrectos,'}), 401)
        return response
    else:
        current_user = found_user[0]
        secret = app.config["SECREY_KEY"]
        token = jwt.encode({"user": current_user}, secret, algorithm="HS256")
        return jsonify({"token": token})

# ---------------------------------- GETUSER --------------------------------- #
# GET
@app.route('/api/v1/getuser', methods=['GET'])
@token_required
# ---------------- Funcion que RETORNA UN usuario segun su ID ---------------- #
# requiere token en el header
def get_user(current_user):
    return jsonify({"user": current_user[0]})

# --------------------------------- PURCHASES -------------------------------- #
# PUT
@app.route('/api/v1/purchases', methods=['PUT'])
@token_required
# ----------------- Funcion que añade una compra al usuaario ----------------- #
# requiere token en el header
def add_purchase_to_user(current_user):
    new_purchase_id = str(random.randint(1,1000))
    user = [user for user in users if user['id']==current_user[0]['id']]
    if len(user) == 1:
        user[0]["purchases"].update({new_purchase_id : request.json})
        users_json = json.dumps(users, indent = 4) # guarda los usuarios en formato JSON
        with open("../../../db/users.json", "w") as outfile: 
            outfile.write(users_json) # escribe los usuarios en users.json
        return jsonify({'msj': 'compra cargada exitosamente'})
    return jsonify({'msj': 'ha ocurrido un error'})

# DELETE
@app.route('/api/v1/purchases/<int:id>', methods=['DELETE'])
@token_required
# ---------------- Funcion que elimina una compra del usuario ---------------- #
# requiere token en el header, un array de productos en el body [{}{}{}]
def remove_purchase_from_user(current_user, id):
    user = [user for user in users if user['id']==current_user[0]['id']]
    this_user = user[0]
    purchase_id = str(id)
    if (len(user) == 1) and (this_user['purchases'].get(purchase_id, False) == False):
        return jsonify({'message': 'tarea ya eliminada'})
    if len(user) == 1 and this_user['purchases'][purchase_id]:
        this_user['purchases'].pop(purchase_id)
        users_json = json.dumps(users, indent = 4)
        with open('../../../db/users.json', 'w') as outfile:
            outfile.write(users_json)
        return jsonify({'user': this_user})
    return jsonify({'message': 'usuario no encontrado'})

# ----
# Si nuestro programa es el principal, se ejecuta
# ----
if __name__ == '__main__':
    app.run(debug=True)