import os
import sqlite3

from flask import Blueprint, jsonify, request, session
from werkzeug.security import check_password_hash, generate_password_hash

auth_bp = Blueprint("auth", __name__)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATABASE_DIR = os.path.join(BASE_DIR, "database")
DATABASE_PATH = os.path.join(DATABASE_DIR, "users.db")


def get_db_connection():
  os.makedirs(DATABASE_DIR, exist_ok=True)
  connection = sqlite3.connect(DATABASE_PATH)
  connection.row_factory = sqlite3.Row
  return connection


def init_auth_db():
  with get_db_connection() as connection:
    connection.execute(
      """
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      )
      """
    )
    connection.commit()


@auth_bp.route("/register", methods=["POST"])
def register():
  payload = request.get_json(silent=True) or {}
  username = (payload.get("username") or "").strip()
  password = payload.get("password") or ""

  if not username or not password:
    return jsonify({
      "success": False,
      "message": "Username and password are required."
    }), 400

  hashed_password = generate_password_hash(password)

  try:
    with get_db_connection() as connection:
      connection.execute(
        "INSERT INTO users (username, password) VALUES (?, ?)",
        (username, hashed_password),
      )
      connection.commit()
  except sqlite3.IntegrityError:
    return jsonify({
      "success": False,
      "message": "Username already exists."
    }), 409

  return jsonify({
    "success": True,
    "message": "User registered successfully."
  }), 201


@auth_bp.route("/login", methods=["POST"])
def login():
  payload = request.get_json(silent=True) or {}
  username = (payload.get("username") or "").strip()
  password = payload.get("password") or ""

  if not username or not password:
    return jsonify({
      "success": False,
      "message": "Username and password are required."
    }), 400

  with get_db_connection() as connection:
    user = connection.execute(
      "SELECT id, username, password FROM users WHERE username = ?",
      (username,),
    ).fetchone()

  if user is None or not check_password_hash(user["password"], password):
    return jsonify({
      "success": False,
      "message": "Invalid username or password."
    }), 401

  session["user"] = user["username"]

  return jsonify({
    "success": True,
    "message": "Login successful."
  })


@auth_bp.route("/logout", methods=["GET"])
def logout():
  session.pop("user", None)
  return jsonify({
    "success": True,
    "message": "Logged out successfully."
  })


init_auth_db()
