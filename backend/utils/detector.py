import cv2

try:
    from backend.utils.detectors import detect_objects
    from backend.utils.ai_helper import get_ai_response
except ModuleNotFoundError:
    from utils.detectors import detect_objects
    from utils.ai_helper import get_ai_response


last_ai_output = None
last_state = None
ROAD_RELATED_CLASSES = {
    "car",
    "truck",
    "bus",
    "motorcycle",
    "bicycle",
    "traffic light",
    "stop sign",
    "pothole",
}


def preprocess_frame(frame):
    frame = cv2.convertScaleAbs(frame, alpha=1.2, beta=30)

    lab = cv2.cvtColor(frame, cv2.COLOR_BGR2LAB)
    l_channel, a_channel, b_channel = cv2.split(lab)

    l_channel = cv2.equalizeHist(l_channel)

    lab = cv2.merge((l_channel, a_channel, b_channel))
    frame = cv2.cvtColor(lab, cv2.COLOR_LAB2BGR)

    return frame


def process_frame(frame, mode="driving"):
    global last_ai_output, last_state

    frame = preprocess_frame(frame)
    result = detect_objects(frame)
    objects = result.get("objects", [])
    boxes = result.get("boxes", objects)
    detected_labels = [obj.get("label") for obj in objects if obj.get("label")]
    if result.get("pothole"):
        detected_labels.append("pothole")

    pothole = bool(result.get("pothole"))
    pedestrian = "person" in detected_labels
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    glare = gray.mean() > 200
    is_road_scene = any(label in ROAD_RELATED_CLASSES for label in detected_labels)

    if not is_road_scene:
        pothole = False
        pedestrian = False
        glare = False

    if glare and not pothole:
        pothole = False

    if pothole:
        pedestrian = False
        glare = False
    elif pedestrian:
        glare = False

    decision = "Safe"
    alert = ""
    alerts = []
    recommendation = ""
    visibility_label = "Low visibility condition detected" if glare else ""

    if mode == "indoor":
        if detected_labels:
            alert = "Objects detected"
            recommendation = "Monitor surroundings"
        else:
            alert = "No objects detected"
            recommendation = "No action needed"
        decision = "Info"
    elif not is_road_scene:
        decision = "Safe"
        alert = "Non-road environment detected"
        recommendation = "No driving action needed"
    elif pothole:
        decision = "Danger"
        alert = "Pothole detected ahead"
        alerts.append(alert)
        recommendation = "Slow down and avoid pothole"
    elif pedestrian:
        decision = "Caution"
        alert = "Pedestrian detected"
        alerts.append(alert)
        recommendation = "Reduce speed and be ready to stop"
    elif glare:
        decision = "Caution"
        alert = "Glare detected"
        alerts.append(alert)
        recommendation = "Use low beam"
    else:
        decision = "Safe"
        alert = "No hazards"
        recommendation = "Drive safely"

    current_state = (
        tuple(sorted(detected_labels)),
        is_road_scene,
        mode,
        pothole,
        pedestrian,
        glare,
        decision,
    )

    if current_state != last_state:
        if mode == "indoor":
            ai_output = (
                f"Alert: {alert}\n"
                f"Recommendation: {recommendation}"
            )
        elif is_road_scene:
            ai_output = get_ai_response({
                "pothole": pothole,
                "pedestrian": pedestrian,
                "glare": glare,
                "objects": objects,
                "boxes": boxes,
                "decision": decision,
                "alert": alert,
                "recommendation": recommendation,
                "detections": detected_labels,
            })
        else:
            ai_output = "Alert: Non-road environment detected\nRecommendation: No driving action needed"
        last_state = current_state
        last_ai_output = ai_output
    else:
        ai_output = last_ai_output

    print("AI OUTPUT:", ai_output)

    return {
        "alert": alert,
        "decision": decision,
        "alerts": alerts,
        "recommendation": recommendation,
        "ai_output": ai_output,
        "visibility_label": visibility_label,
        "detections": detected_labels,
        "is_road_scene": is_road_scene,
        "mode": mode,
        "pothole": pothole,
        "pedestrian": pedestrian,
        "glare": glare,
        "objects": objects,
        "boxes": boxes,
    }
