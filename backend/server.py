from flask import Flask
from routes.auth_routes import auth_bp
from routes.detection_routes import detection_bp
from flask_cors import CORS

app = Flask(__name__)


# Required for session
app.secret_key = "mysecret123"

CORS(app)

# Register authentication routes
app.register_blueprint(auth_bp)
app.register_blueprint(detection_bp)


@app.route("/")
def home():
    return {"message": "Backend running"}


if __name__ == "__main__":
    app.run(debug=True)
