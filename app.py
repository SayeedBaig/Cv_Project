from backend.utils.camera import start_camera


def main():
    print("Select Input Source:")
    print("1. Webcam")
    print("2. Video File")

    choice = input("Enter choice (1/2): ")

    if choice == "1":
        start_camera(0)
    elif choice == "2":
        path = input("Enter video path: ")
        start_camera(path)
    else:
        print("Invalid choice")

if __name__ == "__main__":
    main()

