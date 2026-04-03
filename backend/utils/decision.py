def make_decision(objects, potholes, glare):
    decisions = []

    # Beam control
    if glare:
        decisions.append("LOW BEAM")
    else:
        decisions.append("HIGH BEAM")

    # Alerts
    if potholes:
        decisions.append("POTHOLE ALERT")

    for obj in objects:
        if obj in ["person"]:
            decisions.append("PEDESTRIAN WARNING")
        if obj in ["car", "truck", "bus", "motorbike"]:
            decisions.append("VEHICLE AHEAD")

    return decisions