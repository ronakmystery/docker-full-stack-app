import cv2
import numpy as np
from cnn import classify_single_image  
import matplotlib.pyplot as plt

def classify(model, image):
    
    img_height, img_width = image.shape[:2] 

    results = model(image)

    detected_objects = []
    
    for r in results:
        class_ids = r.boxes.cls.cpu().numpy().astype(int)  
        boxes = r.boxes.xyxy.cpu().numpy() 

        for i, (class_id, box) in enumerate(zip(class_ids, boxes)):
            x1, y1, x2, y2 = map(int, box)  
            cropped_object = image[y1:y2, x1:x2]  

            x_center = (x1 + x2) / 2  
            location = "left" if x_center < (img_width / 2) else "right"

            bird_class_name = classify_single_image(cropped_object) 

            detected_objects.append({
                "class": bird_class_name,  
                "bbox": [float(coord) for coord in box],
                "location":location
            })

            cv2.rectangle(image, (x1, y1), (x2, y2), (0, 255, 0), 2) 
            cv2.putText(image, bird_class_name, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 
                        0.5, (0, 255, 0), 2, cv2.LINE_AA)

    cv2.imwrite('y.jpg', image)

    return {"objects": detected_objects}
