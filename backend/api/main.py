# imports
from os import putenv
from flask import Flask, jsonify, request, make_response
from flask_cors import CORS, cross_origin
from functools import wraps
# from flask_sqlalchemy import SQLAlchemy
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
            "purchases": "{}"
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
    # return ''

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

# ------------------------------- USER/PURCHASES ----------------------------- #
# PUT
@app.route('/api/v1/purchases', methods=['PUT'])
@token_required
# ----------------- Funcion que añade una compra al usuaario ----------------- #
def add_purchase_to_user(current_user):
    new_purchase_id = random.randint(1,1000)
    user = [user for user in users if user['id']==current_user[0]['id']]
    if len(user) == 1:
        # user[0]['purchases'] = request.json['purchase']
        print(request.json)
        print(user[0]["purchases"])
        return jsonify({'msj': 'compra cargada exitosamente'})
    return jsonify({'msj': 'ha ocurrido un error'})




# ---------------------------------------------------------------------------- #
# ---------------------------------------------------------------------------- #
# ---------------------------------------------------------------------------- #
# ---------------------------------------------------------------------------- #





# ---------------------------------- DELETE ---------------------------------- #
@app.route('/api/v1/users/<int:id>', methods=['DELETE'])
# ----------------- Funcion que BORRA UN usuario segun su ID ----------------- #
def delete_user(id):
    user_to_delete = [user for user in users if user["userId"] == id] # busca el usuario
    if(len(user_to_delete) > 0): # si la list tiene un elemento ejecuta
        users.remove(user_to_delete[0]) # borra el usuario de users
        users_json = json.dumps(users, indent = 4) # guarda los usuarios en formato json
        with open("../db/users.json", "w") as outfile:
            outfile.write(users_json) # escribe los usuarios en users.json
        return jsonify({"users": users, "message": "usuario borrado exitosamente"}) # retorna todos los usuarios
    return jsonify({"message": "usuario no encontrado"}) # si no encuentra al usuario x ID devuelve un msj de error



# ---------------------------------------------------------------------------- #
#                            RUTA USERS/PRODUCTS/ID                            #
# ---------------------------------------------------------------------------- #
# ------------------------------------ PUT ----------------------------------- #
# @cross_origin()
@app.route('/api/v1/users/products/<int:id>', methods=['PUT'])
# el BODY requiere un objeto en formato JSON {
#   productId: number,
#   productName: string, 
#   productPrice: number, 
#   productUnits: number
# }
# ---------- Funcion que AÑADE UN PRODUCTO a un usuario segun su ID ---------- #
def add_product_to_user(id):
    new_product = {
        "productId": random.randint(1,1000),
        "productName": request.json["productName"],
        "productPrice": request.json["productPrice"],
        "productUnits": request.json["productUnits"]
    }
    user_to_update = [user for user in users if user["userId"] == id] 
    if(len(user_to_update) > 0): 
        user_to_update[0]["products"].append(new_product) # agrega el nuevo producto al usuario
        users_json = json.dumps(users, indent = 4)
        with open("../db/users.json", "w") as outfile:
            outfile.write(users_json)
        return jsonify({"users": users, "message": "producto añadido correctamente"})
    return jsonify({"message": "usuario no encontrado"})


# ---------------------------------- DELETE ---------------------------------- #
@app.route('/api/v1/users/products/<int:id>', methods=['DELETE'])
# el BODY requiere un objeto en formato JSON {
#   productId: number,
#   productName: string, 
#   productPrice: number, 
#   productUnits: number
# }
# ---------- Funcion que BORRA UN PRODUCTO de un usuario segun su ID --------- #
def delete_product(id):
    user_to_update = [user for user in users if user["userId"] == id]
    product_to_delete = {
        "productId": request.json["productId"],
        "productName": request.json["productName"],
        "productPrice": request.json["productPrice"],
        "productUnits": request.json["productUnits"]
    }
    if(len(user_to_update) > 0):
        try:
            user_to_update[0]["products"].remove(product_to_delete)
            users_json = json.dumps(users, indent = 4)
            with open("../db/users.json", "w") as outfile:
                outfile.write(users_json)
            return jsonify({"users": users, "message": "producto borrado correctamente"})
        except: 
            return jsonify({"users": users,"message": "el usuario no posee el producto o ya fue eliminado"})
    return jsonify({"message": "usuario no encontrado"}) # si no encuentra ID, devuelve msj de error



# ----
# Si nuestro programa es el principal, se ejecuta
# ----
if __name__ == '__main__':
    app.run(debug=True)

