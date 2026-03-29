# import cv2
# from utils.detectors import detect_objects


# def start_camera(source=0):
#     # Open webcam (0 = default camera)
#     cap = cv2.VideoCapture(source)

#     if not cap.isOpened():
#         print("Error: Cannot open camera")
#         return

#     while True:
#         ret, frame = cap.read()

#         if not ret:
#             print("Error: Failed to capture frame")
#             break

#         # # Add overlay text
#         # cv2.putText(
#         #     frame,
#         #     "Road Hazard Detection System Active",
#         #     (20, 40),
#         #     cv2.FONT_HERSHEY_SIMPLEX,
#         #     1,
#         #     (0, 255, 0),
#         #     2
#         # )
#         #YOLO detection
#         frame = cv2.resize(frame, (640, 480))
#         processed_frame = detect_objects(frame)

#         # Display frame
#         # cv2.imshow("Camera Feed", frame)
#         cv2.imshow("YOLO Detection",processed_frame)

#         # Exit on ESC key
#         if cv2.waitKey(1) & 0xFF == 27:
#             break

#     cap.release()
#     cv2.destroyAllWindows()

import cv2
from utils.detectors import detect_objects

def start_camera(source=0):  # default webcam

    cap = cv2.VideoCapture(source)

    if not cap.isOpened():
        print("Error: Cannot open source")
        return

    while True:
        ret, frame = cap.read()

        if not ret:
            print("End of video or error")
            break

        frame = cv2.resize(frame, (640, 480))

        processed_frame = detect_objects(frame)

        cv2.imshow("Detection", processed_frame)

        if cv2.waitKey(1) & 0xFF == 27:
            break

    cap.release()
    cv2.destroyAllWindows()