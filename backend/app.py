from utils.camera import start_camera


def main():
    print("Select Input Source:")
    print("1. Laptop Webcam")
    print("2. Mobile Camera")
    print("3. Video File")

    choice = input("Enter choice (1/2/3): ")

    if choice == "1":
        start_camera("webcam")
    elif choice == "2":
        start_camera("mobile")
    elif choice == "3":
        path = input("Enter video path: ")
        start_camera("video", path)
    else:
        print("Invalid choice")

if __name__ == "__main__":
    main()

