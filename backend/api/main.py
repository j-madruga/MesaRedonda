# import de flask
from os import putenv
from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
# import para manipular json y generar numeroa aleatorios
import json, random

# Guardamos nuestro servidor flask en app
app = Flask(__name__)
# Instancio app dentro de objecto CORS
CORS(app, resources={r"/*": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'

# Importa los productos desde products.json
with open("../db/products.json", "r") as products:
    products = json.load(products)
# Importa los usuarios desde users.json
with open("../db/users.json", "r") as users:
    users = json.load(users)

# ---------------------------------------------------------------------------- #
# ------------------------------- RUTA PRODUCTS ------------------------------ #
# ---------------------------------------------------------------------------- #
# ------------------------------------ GET ----------------------------------- #
@app.route('/api/v1/products', methods=['GET'])
# ---------------- Funcion que RETORNA TODOS los productos ------------------- #
def get_products():
    return jsonify(products)


# ---------------------------------------------------------------------------- #
# --------------------------------- RUTA USERS ------------------------------- #
# ---------------------------------------------------------------------------- #
# ------------------------------------ GET ----------------------------------- #
@app.route('/api/v1/users', methods=['GET'])
# ----------------- Funcion que RETORNA TODOS los usuarios ------------------- #
def get_users():
    return jsonify({"users": users, "message": "usuarios obtenidos correctamente"})
# ----------------------------------- POST ----------------------------------- #
@app.route('/api/v1/users', methods=['POST'])
# @cross_origin()
# requiere en el BODY un usuario en formato JSON {
#   userId: number, 
#   userName: string, 
#   isResponsable: boolean, 
#   products: array
# }
# -------------- Funcion que AÑADE NUEVOS usuarios en users.json ------------- #
def load_users():
    newId = random.randint(1,1000)
    foundUser = [user for user in users if user["userId"] == newId] # checkea si existe id
    if(len(foundUser) > 0):
        newId = random.randint(1,1000) # si existe reasigno la variable
    new_user = {
        "userId": newId,
        "userName": request.json["userName"],
        "isResponsable": request.json["isResponsable"],
        "products": request.json["products"]
    }
    users.append(new_user) # añade el nuevo user al diccionario
    users_json = json.dumps(users, indent = 4) # guarda los usuarios en formato JSON
    with open("../db/users.json", "w") as outfile: 
        outfile.write(users_json) # escribe los usuarios en users.json
    return jsonify({"users": users, "message": "usuario cargado exitosamente"}) # retorna todos los users



# ---------------------------------------------------------------------------- #
#                                 RUTA USERS/ID                                #
# ---------------------------------------------------------------------------- #
# ------------------------------------ GET ----------------------------------- #
@app.route('/api/v1/users/<int:id>', methods=['GET'])
# ---------------- Funcion que RETORNA UN usuario segun su ID ---------------- #
def find_user(id):
    foundUser = [user for user in users if user["userId"] == id]
    if(len(foundUser) > 0):
        return jsonify({"user":foundUser[0], "message": "usuario obtenido correctamente"})
    return jsonify({"message": "usuario no encontrado"})


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

