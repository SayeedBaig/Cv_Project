from ultralytics.data.converter import convert_coco

convert_coco(
    labels_dir="datasets/pothole",   
    save_dir="datasets", 
    use_segments=False
)