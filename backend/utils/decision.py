def make_decision(objects, potholes=None, glare=False):
    detections = []

    for obj in objects or []:
        if isinstance(obj, dict):
            label = obj.get("label")
        else:
            label = obj

        if label:
            detections.append(label)

    if potholes:
        detections.append("pothole")

    if "person" in detections:
        alert = "Pedestrian detected"
        recommendation = "Slow down and prepare to stop"
    elif "pothole" in detections:
        alert = "Pothole detected ahead"
        recommendation = "Slow down to avoid damage"
    elif "chair" in detections or "obstacle" in detections:
        alert = "Obstacle detected"
        recommendation = "Proceed with caution"
    else:
        alert = "No hazards"
        recommendation = "Drive safely"

    return {
        "detections": detections,
        "alert": alert,
        "recommendation": recommendation,
    }
