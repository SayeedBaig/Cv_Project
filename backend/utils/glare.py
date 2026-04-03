import cv2
import numpy as np

def detect_glare(frame):
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # Brightness threshold (tune if needed)
    _, thresh = cv2.threshold(gray, 230, 255, cv2.THRESH_BINARY)

    # Remove noise
    kernel = np.ones((5, 5), np.uint8)
    thresh = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)

    # Find contours
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    glare_detected = False

    for cnt in contours:
        area = cv2.contourArea(cnt)

        if area > 500:  # ignore small noise
            glare_detected = True
            x, y, w, h = cv2.boundingRect(cnt)

            # Draw box
            cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 0, 255), 2)
            cv2.putText(frame, "GLARE", (x, y-10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0,0,255), 2)

    return frame, glare_detected