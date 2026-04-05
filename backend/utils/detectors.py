import os
from ultralytics import YOLO
import cv2

try:
    from backend.utils.glare import detect_glare
except ModuleNotFoundError:
    from utils.glare import detect_glare

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GENERAL_MODEL_PATH = os.path.join(BASE_DIR, "yolov8n.pt")
POTHOLE_MODEL_PATH = os.path.join(
    BASE_DIR,
    "models",
    "pothole_model",
    "pothole_best.pt",
)

# Load models
general_model = YOLO(GENERAL_MODEL_PATH)
pothole_model = YOLO(POTHOLE_MODEL_PATH)

def detect_objects(frame):
    detected_objects = []
    detected_boxes = []
    potholes = []

    # -------- GENERAL OBJECT DETECTION --------
    results_general = general_model(frame, imgsz=640)[0]

    for box in results_general.boxes:
        x1, y1, x2, y2 = map(int, box.xyxy[0])
        label = general_model.names[int(box.cls[0])]
        conf = float(box.conf[0])

        detected_objects.append({
            "label": label,
            "box": [x1, y1, x2, y2],
        })
        detected_boxes.append({
            "label": label,
            "box": [x1, y1, x2, y2],
        })

        cv2.rectangle(frame, (x1, y1), (x2, y2), (255, 0, 0), 2)
        cv2.putText(frame, f"{label} {conf:.2f}",
                    (x1, y1 - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5,
                    (255, 0, 0), 2)

    # -------- POTHOLE DETECTION --------
    results_pothole = pothole_model(frame, imgsz=640)[0]

    for box in results_pothole.boxes:
        x1, y1, x2, y2 = map(int, box.xyxy[0])
        conf = float(box.conf[0])

        potholes.append("pothole")
        detected_boxes.append({
            "label": "pothole",
            "box": [x1, y1, x2, y2],
        })

        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 255), 2)
        cv2.putText(frame, f"POTHOLE {conf:.2f}",
                    (x1, y1 - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6,
                    (0, 0, 255), 2)

    # -------- GLARE DETECTION --------
    frame, glare_flag = detect_glare(frame)

    pothole_detected = bool(potholes)
    pedestrian_detected = any(
        obj["label"] == "person" for obj in detected_objects
    )

    if pothole_detected or pedestrian_detected:
        decision = "Danger"
    elif glare_flag:
        decision = "Warning"
    else:
        decision = "Safe"

    recommendation = "Road is clear, maintain speed"

    if pothole_detected:
        recommendation = "Slow down, pothole ahead"
    elif glare_flag:
        recommendation = "Switch to low beam"
    elif pedestrian_detected:
        recommendation = "Pedestrian ahead, slow down"

    return {
        "pothole": pothole_detected,
        "glare": bool(glare_flag),
        "pedestrian": pedestrian_detected,
        "objects": detected_objects,
        "boxes": detected_boxes,
        "decision": decision,
        "recommendation": recommendation,
    }
