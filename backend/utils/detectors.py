from ultralytics import YOLO

# Load YOLO model (downloads automatically first time)
model = YOLO("yolov8n.pt")  # nano model (fast)

def detect_objects(frame):
    results = model(frame)

    # Draw bounding boxes
    annotated_frame = results[0].plot()

    return annotated_frame