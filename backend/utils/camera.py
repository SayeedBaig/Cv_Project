import cv2
from backend.utils.detectors import detect_objects  


def start_camera(source=0):
    try:
        cap = cv2.VideoCapture(source, cv2.CAP_MSMF)
        if not cap.isOpened():
            print("Error: Cannot open camera/video source")
            return

        while True:
            ret, frame = cap.read()

            if not ret:
                print("End of video or frame error")
                break

            frame = cv2.resize(frame, (640, 480))

            processed_frame = detect_objects(frame)

            cv2.imshow("YOLO Multi-Model Detection", processed_frame)

            if cv2.waitKey(1) & 0xFF == 27:
                break

        cap.release()
        cv2.destroyAllWindows()

    except Exception as e:
        print("Unexpected Error:", e)