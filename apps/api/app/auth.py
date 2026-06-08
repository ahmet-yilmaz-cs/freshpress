"""Auth routes: register, login, me, refresh, logout."""
from flask import Blueprint, jsonify, request
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    get_jwt_identity,
    jwt_required,
)

from .db import db
from .errors import ApiError
from .models import User
from .schemas import validate_login, validate_register

bp = Blueprint("auth", __name__)


def _tokens_for(user: User) -> dict:
    return {
        "accessToken": create_access_token(identity=user.id),
        "refreshToken": create_refresh_token(identity=user.id),
    }


@bp.post("/register")
def register():
    data = validate_register(request.get_json(silent=True) or {})

    if User.query.filter_by(email=data["email"]).first():
        raise ApiError(
            "email_taken",
            "An account with this email already exists",
            409,
            {"email": "This email is already registered"},
        )

    user = User(name=data["name"], email=data["email"])
    user.set_password(data["password"])
    db.session.add(user)
    db.session.commit()

    return jsonify({"user": user.to_dict(), "tokens": _tokens_for(user)}), 201


@bp.post("/login")
def login():
    data = validate_login(request.get_json(silent=True) or {})
    user = User.query.filter_by(email=data["email"]).first()

    if user is None or not user.check_password(data["password"]):
        raise ApiError("invalid_credentials", "Incorrect email or password", 401)

    return jsonify({"user": user.to_dict(), "tokens": _tokens_for(user)})


@bp.get("/me")
@jwt_required()
def me():
    user = db.session.get(User, get_jwt_identity())
    if user is None:
        raise ApiError("not_found", "User no longer exists", 404)
    return jsonify({"user": user.to_dict()})


@bp.post("/refresh")
@jwt_required(refresh=True)
def refresh():
    user_id = get_jwt_identity()
    user = db.session.get(User, user_id)
    if user is None:
        raise ApiError("not_found", "User no longer exists", 404)
    return jsonify({"accessToken": create_access_token(identity=user_id)})


@bp.post("/logout")
@jwt_required()
def logout():
    # Stateless JWT: client discards tokens. Endpoint exists for a clean contract.
    return jsonify({"message": "Logged out"})
