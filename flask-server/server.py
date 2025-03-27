from flask import Flask, jsonify,request
from classify import classify
from ultralytics import YOLO
import cv2
from PIL import Image
from flask_cors import CORS
import numpy as np
from werkzeug.middleware.proxy_fix import ProxyFix



app = Flask(__name__)
app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)

CORS(app)


model = YOLO("yolov8n.pt")   


@app.route('/about')
def home():
    return jsonify({"message": "python server is running!"})


@app.route('/video', methods=['POST'])
def classify_frame():
    image = Image.open(request.files['frame']).convert('RGB')
    cv_image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
    cv2.imwrite("x.jpg", cv_image)
    result = classify(model,cv_image)
    print(result)
    
    return 'OK'
