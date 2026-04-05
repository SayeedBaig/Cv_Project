import cv2

try:
    from backend.utils.detectors import detect_objects
except ModuleNotFoundError:
    from utils.detectors import detect_objects


cap = None
cap_source = None


def release_camera():
    global cap, cap_source

    if cap is not None:
        cap.release()
        cap = None
        cap_source = None


def get_frame(
    source="webcam",
    video_path=None,
    mobile_url="http://<IP>:4747/video",
):
    global cap, cap_source

    try:
        target_source = (source, video_path, mobile_url)

        if cap is not None and cap_source != target_source:
            release_camera()

        if source == "webcam":
            if cap is None:
                print("Using Webcam")
                cap = cv2.VideoCapture(0, cv2.CAP_MSMF)
                cap_source = target_source
        elif source == "mobile":
            if cap is None:
                print("Using Mobile Camera")
                cap = cv2.VideoCapture(mobile_url)
                cap_source = target_source
        elif source == "video":
            if not video_path:
                print("Error: Video path is required for video mode")
                return None
            if cap is None:
                print("Using Video File")
                cap = cv2.VideoCapture(video_path)
                cap_source = target_source
        else:
            print("Error: Unsupported input source")
            return None

        if not cap.isOpened():
            print("Error: Cannot open camera/video source")
            release_camera()
            return None

        ret, frame = cap.read()

        if not ret:
            print("Error: Stream failed or frame capture failed")
            release_camera()
            return None

        return cv2.resize(frame, (640, 480))

    except Exception as e:
        print("Unexpected Error:", e)
        return None


def get_single_frame(
    input_source="webcam",
    video_path=None,
    mobile_url="http://<IP>:4747/video",
):
    return get_frame(
        source=input_source,
        video_path=video_path,
        mobile_url=mobile_url,
    )


def start_camera(
    input_source="webcam",
    video_path=None,
    mobile_url="http://<IP>:4747/video",
):
    try:
        latest_detection = None

        if input_source == "webcam":
            print("Using Webcam")
            cap = cv2.VideoCapture(0, cv2.CAP_MSMF)
        elif input_source == "mobile":
            print("Using Mobile Camera")
            cap = cv2.VideoCapture(mobile_url)
        elif input_source == "video":
            print("Using Video File")
            if not video_path:
                print("Error: Video path is required for video mode")
                return
            cap = cv2.VideoCapture(video_path)
        else:
            print("Error: Unsupported input source")
            return

        if not cap.isOpened():
            print("Error: Cannot open camera/video source")
            cap.release()
            return

        while True:
            ret, frame = cap.read()

            if not ret:
                print("Error: Stream failed or end of video reached")
                break

            frame = cv2.resize(frame, (640, 480))

            latest_detection = detect_objects(frame)

        cap.release()
        return latest_detection

    except Exception as e:
        print("Unexpected Error:", e)
        return None
