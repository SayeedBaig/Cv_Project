import base64
import os
import time
import uuid
import cv2
import numpy as np
from flask import Blueprint, Response, jsonify, request, send_from_directory

from utils.camera import get_frame, release_camera
from utils.detector import process_frame

detection_bp = Blueprint("detection", __name__)
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "outputs")
VIDEO_DETECTION_INTERVAL = 5
os.makedirs(OUTPUT_DIR, exist_ok=True)


def generate_frames():
    try:
        while True:
            frame = get_frame("webcam")

            if frame is None:
                time.sleep(0.03)
                continue

            result = process_frame(frame)
            label = result.get("decision", "Live Feed")

            cv2.putText(
                frame,
                label,
                (20, 40),
                cv2.FONT_HERSHEY_SIMPLEX,
                1,
                (0, 255, 0),
                2,
            )

            ret, buffer = cv2.imencode(".jpg", frame)
            if not ret:
                time.sleep(0.03)
                continue

            frame_bytes = buffer.tobytes()

            yield (
                b"--frame\r\n"
                b"Content-Type: image/jpeg\r\n\r\n" + frame_bytes + b"\r\n"
            )

            time.sleep(0.03)
    finally:
        release_camera()


def draw_detection_overlay(frame, result):
    overlay_boxes = result.get("boxes", result.get("objects", []))

    for obj in overlay_boxes:
        x1, y1, x2, y2 = obj["box"]
        label = obj["label"]

        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
        cv2.putText(
            frame,
            label,
            (x1, max(y1 - 10, 20)),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.6,
            (0, 255, 0),
            2,
        )


@detection_bp.route("/api/detect", methods=["GET"])
def detect():
    try:
        frame = get_frame("webcam")

        if frame is None:
            return jsonify({
                "success": False,
                "message": "Camera not available"
            }), 500

        result = process_frame(frame)

        return jsonify(result)

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


@detection_bp.route("/api/release-camera", methods=["POST"])
def release_camera_route():
    release_camera()
    return {"success": True, "message": "Camera released"}


@detection_bp.route("/api/stop-camera")
def stop_camera():
    from utils.camera import release_camera

    release_camera()
    return {"success": True}


@detection_bp.route("/video_feed")
def video_feed():
    return Response(
        generate_frames(),
        mimetype="multipart/x-mixed-replace; boundary=frame",
    )


@detection_bp.route("/api/upload-image", methods=["POST"])
def upload_image():
    if "file" not in request.files:
        return {"success": False, "message": "No file uploaded"}, 400

    file = request.files["file"]

    file_bytes = np.frombuffer(file.read(), np.uint8)
    frame = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

    if frame is None:
        return {"success": False, "message": "Invalid image"}, 400

    result = process_frame(frame)
    draw_detection_overlay(frame, result)

    _, buffer = cv2.imencode(".jpg", frame)
    image_base64 = base64.b64encode(buffer).decode("utf-8")

    return {"success": True, "data": result, "image": image_base64}


@detection_bp.route("/api/upload-video", methods=["POST"])
def upload_video():
    if "file" not in request.files:
        return {"success": False, "message": "No file"}, 400

    file = request.files["file"]

    input_filename = f"temp_{uuid.uuid4()}.mp4"
    output_filename = f"output_{uuid.uuid4()}.mp4"
    input_path = os.path.join(OUTPUT_DIR, input_filename)
    output_path = os.path.join(OUTPUT_DIR, output_filename)

    cap = None
    out = None

    try:
        file.save(input_path)

        cap = cv2.VideoCapture(input_path)

        if not cap.isOpened():
            return {"success": False, "message": "Invalid video"}, 400

        fourcc = cv2.VideoWriter_fourcc(*"avc1")
        out = cv2.VideoWriter(output_path, fourcc, 20.0, (640, 480))

        if not out.isOpened():
            fourcc = cv2.VideoWriter_fourcc(*"mp4v")
            out = cv2.VideoWriter(output_path, fourcc, 20.0, (640, 480))

        if not out.isOpened():
            return {"success": False, "message": "Unable to write output video"}, 500

        summary = {
            "pothole": False,
            "glare": False,
            "pedestrian": False,
        }
        frame_index = 0
        last_result = {
            "objects": [],
            "decision": "Safe",
            "pothole": False,
            "glare": False,
            "pedestrian": False,
        }

        while True:
            ret, frame = cap.read()
            if not ret:
                break

            frame = cv2.resize(frame, (640, 480))
            if frame_index % VIDEO_DETECTION_INTERVAL == 0:
                last_result = process_frame(frame)

            for key in summary:
                if last_result.get(key):
                    summary[key] = True

            draw_detection_overlay(frame, last_result)

            out.write(frame)
            frame_index += 1

        cap.release()
        cap = None
        out.release()
        out = None

        return {
            "success": True,
            "video_url": f"http://127.0.0.1:5000/processed-videos/{output_filename}",
            "summary": summary,
        }
    except Exception as e:
        return {"success": False, "message": str(e)}, 500
    finally:
        if cap is not None:
            cap.release()
        if out is not None:
            out.release()
        if os.path.exists(input_path):
            os.remove(input_path)


@detection_bp.route("/processed-videos/<path:filename>", methods=["GET"])
def serve_processed_video(filename):
    return send_from_directory(OUTPUT_DIR, filename, mimetype="video/mp4")
