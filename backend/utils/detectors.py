from ultralytics import YOLO
import cv2

# Load models (only once)
general_model = YOLO("yolov8n.pt")
pothole_model = YOLO("backend/models/pothole_model/pothole_best.pt")


def detect_objects(frame):
    # Run detection
    results_general = general_model(frame, imgsz=640)[0]
    results_pothole = pothole_model(frame, imgsz=640)[0]

    # Draw general objects (BLUE)
    for box in results_general.boxes:
        x1, y1, x2, y2 = map(int, box.xyxy[0])
        label = general_model.names[int(box.cls[0])]
        conf = float(box.conf[0])

        cv2.rectangle(frame, (x1, y1), (x2, y2), (255, 0, 0), 2)
        cv2.putText(frame, f"{label} {conf:.2f}",
                    (x1, y1 - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5,
                    (255, 0, 0), 2)

    # Draw potholes (RED)
    for box in results_pothole.boxes:
        x1, y1, x2, y2 = map(int, box.xyxy[0])
        conf = float(box.conf[0])

        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 255), 2)
        cv2.putText(frame, f"POTHOLE {conf:.2f}",
                    (x1, y1 - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6,
                    (0, 0, 255), 2)

    return frame
