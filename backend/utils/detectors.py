from ultralytics import YOLO
import cv2
from backend.utils.glare import detect_glare
from backend.utils.decision import make_decision

# Load models
general_model = YOLO("yolov8n.pt")
pothole_model = YOLO("backend/models/pothole_model/pothole_best.pt")

def detect_objects(frame):

    detected_objects = []
    potholes = []

    # -------- GENERAL OBJECT DETECTION --------
    results_general = general_model(frame, imgsz=640)[0]

    for box in results_general.boxes:
        x1, y1, x2, y2 = map(int, box.xyxy[0])
        label = general_model.names[int(box.cls[0])]
        conf = float(box.conf[0])

        detected_objects.append(label)

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

        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 255), 2)
        cv2.putText(frame, f"POTHOLE {conf:.2f}",
                    (x1, y1 - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6,
                    (0, 0, 255), 2)

    # -------- GLARE DETECTION --------
    frame, glare_flag = detect_glare(frame)

    # -------- DECISION ENGINE --------
    decisions = make_decision(detected_objects, potholes, glare_flag)

    return frame, detected_objects, potholes, glare_flag, decisions