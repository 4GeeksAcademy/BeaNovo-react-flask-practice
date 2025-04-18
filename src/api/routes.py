"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, verify_jwt_in_request
from flask_jwt_extended.exceptions import NoAuthorizationError
from flask_bcrypt import Bcrypt

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

# # Initialize Bcrypt
bcrypt = Bcrypt()

@api.route('/user', methods=['GET'])
def get_users():
    users = User.query.all()
    response_body = [user.serialize() for user in users]

    if not response_body:
        return jsonify({"msg": "there are no registered users"}), 404

    return jsonify({"results": response_body}), 200

@api.route('/signup', methods=['POST'])
def signup():
    try:
        request_body = request.get_json()
        print(request_body)
        if not request_body:
            return jsonify({"msg": "No data provided"}), 400

        email = request_body.get("email")
        password = request_body.get("password")

        if not email or not password:
            return jsonify({"msg": "Missing email or password"}), 400

        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({"msg": "User already exists"}), 409

        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

        new_user = User(
            email=email,
            password=hashed_password,
            is_active=True
        )
        
        db.session.add(new_user)
        db.session.commit()
        
        return jsonify({
            "msg": "User created successfully",
            "user": new_user.serialize()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": f"Error creating user: {str(e)}"}), 500

@api.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({"msg": "Missing email or password"}), 400

        user = User.query.filter_by(email=email).first()
        if not user or not bcrypt.check_password_hash(user.password, password):
            return jsonify({"msg": "Bad email or password"}), 401

        access_token = create_access_token(identity=user.email)
        
        return jsonify({
            "token": access_token, 
            "user_id": user.id,
            "email": user.email,
            "msg": "Login successful"
        }), 200

    except Exception as e:
        return jsonify({"msg": f"Login error: {str(e)}"}), 500

# @api.route("/private", methods=["GET"])
# @jwt_required()
# def private():
#     try:
#         current_user_id = get_jwt_identity()
#         user = User.query.get(current_user_id)
        
#         if not user:
#             return jsonify({"msg": "User not found"}), 404
            
#         return jsonify({
#             "logged_in_as": current_user_id,
#             "user": user.serialize(),
#             "msg": "Private endpoint accessed successfully"
#         }), 200
        
#     except Exception as e:
#         return jsonify({"msg": f"Error accessing private endpoint: {str(e)}"}), 500

@api.route('/private', methods=['GET'])
@jwt_required()
def get_user_info():
    print("Estoy en private")
    current_user_email = get_jwt_identity()
    print(current_user_email)
    user = User().query.filter_by(email=current_user_email).first()
    print(user)
    if not user:
        return jsonify({"msg": "usuario no encontrado"}), 400

    user_data = {
        "id": user.id,
        "email": user.email,
        # "name": user.name
    }

    return jsonify(user_data), 200


@api.route("/verify-token", methods=["GET"])
def verify_token():
    try:
        verify_jwt_in_request()
        current_user_email = get_jwt_identity()
        user = User().query.filter_by(email=current_user_email).first()
        print(current_user_email)
        print(user)
        if not user:
            return jsonify({"valid": False, "message": "User not found"}), 404
            
        return jsonify({
            "valid": True,
            "user": user.serialize(),
            "message": "Token is valid"
        }), 200
        
    except NoAuthorizationError:
        return jsonify({"valid": False, "message": "Invalid or missing token"}), 401
    except Exception as e:
        return jsonify({"valid": False, "message": f"Error verifying token: {str(e)}"}), 500