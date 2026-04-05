import cv2

try:
    from backend.utils.detectors import detect_objects
    from backend.utils.ai_helper import get_ai_response
except ModuleNotFoundError:
    from utils.detectors import detect_objects
    from utils.ai_helper import get_ai_response


last_ai_output = None
last_state = None


def preprocess_frame(frame):
    frame = cv2.convertScaleAbs(frame, alpha=1.2, beta=30)

    lab = cv2.cvtColor(frame, cv2.COLOR_BGR2LAB)
    l_channel, a_channel, b_channel = cv2.split(lab)

    l_channel = cv2.equalizeHist(l_channel)

    lab = cv2.merge((l_channel, a_channel, b_channel))
    frame = cv2.cvtColor(lab, cv2.COLOR_LAB2BGR)

    return frame


def process_frame(frame):
    global last_ai_output, last_state

    frame = preprocess_frame(frame)
    result = detect_objects(frame)
    objects = result.get("objects", [])
    boxes = result.get("boxes", objects)

    pothole = bool(result.get("pothole"))
    pedestrian = bool(result.get("pedestrian"))
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    glare = gray.mean() > 200

    if glare and not pothole:
        pothole = False

    if pothole:
        pedestrian = False
        glare = False
    elif pedestrian:
        glare = False

    decision = "Safe"
    alerts = []
    recommendation = ""
    visibility_label = "Low visibility condition detected" if glare else ""

    if pothole:
        decision = "Danger"
        alerts.append("Pothole detected ahead")
        recommendation = "Slow down and avoid pothole"
    elif pedestrian:
        decision = "Caution"
        alerts.append("Pedestrian detected")
        recommendation = "Reduce speed and be ready to stop"
    elif glare:
        decision = "Caution"
        alerts.append("Glare detected")
        recommendation = "Use low beam"
    else:
        decision = "Safe"
        recommendation = "Drive safely"

    current_state = (pothole, pedestrian, glare, decision)

    if current_state != last_state:
        ai_output = get_ai_response({
            "pothole": pothole,
            "pedestrian": pedestrian,
            "glare": glare,
            "objects": objects,
            "boxes": boxes,
            "decision": decision,
        })
        last_state = current_state
        last_ai_output = ai_output
    else:
        ai_output = last_ai_output

    print("AI OUTPUT:", ai_output)

    return {
        "decision": decision,
        "alerts": alerts,
        "recommendation": recommendation,
        "ai_output": ai_output,
        "visibility_label": visibility_label,
        "pothole": pothole,
        "pedestrian": pedestrian,
        "glare": glare,
        "objects": objects,
        "boxes": boxes,
    }
