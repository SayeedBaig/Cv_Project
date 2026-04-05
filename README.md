# AI-Based Real-Time Road Hazard Detection System

## 📌 Introduction
This project aims to detect road hazards such as potholes and obstacles using computer vision techniques in real-time.

## 🎯 Objectives
- Build a real-time hazard detection system
- Use computer vision for live video analysis
- Improve road safety

## 🛠 Technologies Used
- Python
- OpenCV
- NumPy

## 📂 Project Structure
backend/ → Core logic  
frontend/ → UI (future)  
datasets/ → Training data  
outputs/ → Results  
docs/ → Documentation  

## 🚀 Week 1 Progress
- OpenCV environment setup  
- Webcam capture implemented  
- Live video display working  
- Overlay text added  
- Project structure initialized  
- GitHub repository setup  

## ▶ How to Run
```bash
cd backend
python app.py

## 🤖 Week 2 – AI Integration

<<<<<<< HEAD
- Integrated YOLOv8 (Ultralytics)
- Real-time object detection implemented
- Bounding boxes and labels displayed
- Modular detection pipeline created

### 🔍 How It Works
1. Webcam captures live frames
2. Frames passed to YOLO model
3. Objects detected (person, car, etc.)
4. Bounding boxes drawn on frame
5. Output displayed in real-time
=======
- Integrated YOLOv8 using Ultralytics
- Implemented real-time object detection
- Added bounding boxes and labels
- Modularized detection into separate module

## ⚡ Performance Optimization
- Used YOLOv8 nano model (yolov8n)
- Resized frames for faster processing

## 🛡 Error Handling
- Handled camera/video input errors
- Added safe execution using try-except

## 🎥 Input Modes
- Webcam (real-time)
- Video file (road simulation)

# Week-3 work  details 
 the system was extended from generic object detection to a custom pothole detection system, improving its practical applicability in road safety.

 2. Objectives (Week-3)
- According to the roadmap:
- Train a custom YOLO model for pothole detection
- Prepare dataset in YOLO format
- Integrate trained model into detection system
- Build a multi-model AI pipeline

3. Dataset Used
 Source:
Dataset: Pothole Detection Dataset (Kaggle)
Format: XML annotations (Pascal VOC)
 Preprocessing:

The dataset was converted into YOLO format, which includes:

images/
labels/
data.yaml
 YOLO Label Format:

Each label file contains:

class_id x_center y_center width height
 4. Model Used
 Base Model:
YOLOv8 (Ultralytics)
Variant: yolov8n (Nano version)
 Reason:
Lightweight and fast
Suitable for real-time detection
Easy customization

5. Training Process

Training was performed using Google Colab (GPU).

Steps:
Dataset downloaded from Kaggle
XML → YOLO format conversion
Train/Validation split (80/20)
Created data.yaml
Model training executed
Training Configuration:
Epochs: 10 (final run)
Image size: 640
Classes: 1 (pothole)

6. Model Performance

After training:

Precision: ~0.76
Recall: ~0.71
mAP@50: ~0.79
mAP@50-95: ~0.51

Interpretation:

High mAP indicates good detection accuracy
Model successfully identifies potholes in real-world scenarios

7. Results
 Image Detection:
Model correctly detects potholes
Bounding boxes drawn with confidence scores
 Video Detection:
Frame-by-frame pothole detection
Works on real road videos
 Example Output:
Detected 2 potholes in a sample image
Real-time inference working

 8. Track-A Completion
 Dataset preparation
 YOLO format conversion
 Model training
Weight generation (.pt file)

9. Track-B Implementation (Integration)
Multi-Model System:

The system integrates:
| Model         | Purpose                  |
| ------------- | ------------------------ |
| YOLOv8 (COCO) | General object detection |
| Custom YOLO   | Pothole detection        |

Detection Pipeline:
Input Frame
   ↓
General YOLO → objects (person, car)
Custom YOLO → potholes
   ↓
Combined Output (overlay)

mplementation:
detector.py → Handles both models
camera.py → Processes video/webcam
app.py → User interface

10. System Features
Real-time detection
Multi-model integration
Works with:
Webcam
Video files
Custom-trained AI model

11. Challenges Faced
Dataset format mismatch (COCO → YOLO conversion)
Colab runtime resets (model loss)
File path and import issues
Video codec compatibility issues

 All issues were resolved during development.

 12. Final Output

The system successfully:

 Detects potholes
 Detects general objects
 Works in real-time
 Provides visual output with bounding boxes

 Week-3 successfully implemented a custom AI-based pothole detection system using YOLOv8. The integration of both general and custom models resulted in a multi-functional intelligent detection system.

This forms a strong foundation for further enhancements in Week-4 and Week-5.

