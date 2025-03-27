import cv2
import numpy as np
import torch
import torch.nn as nn
import torchvision.transforms as transforms
from PIL import Image


class CNN(nn.Module):
    def __init__(self):
        super(CNN, self).__init__()
        self.conv1 = nn.Conv2d(3, 16, kernel_size=3, stride=1, padding=1)
        self.bn1 = nn.BatchNorm2d(16)
        self.conv2 = nn.Conv2d(16, 32, kernel_size=3, stride=1, padding=1)
        self.bn2 = nn.BatchNorm2d(32)
        self.conv3 = nn.Conv2d(32, 64, kernel_size=3, stride=1, padding=1)
        self.bn3 = nn.BatchNorm2d(64)
        self.relu = nn.ReLU()
        self.pool = nn.MaxPool2d(kernel_size=2, stride=2)
        self.dropout = nn.Dropout(0.5)

        self.flattened_size = self._get_flattened_size()

        self.fc1 = nn.Linear(self.flattened_size, 256) 
        self.fc2 = nn.Linear(256, 128)
        self.fc3 = nn.Linear(128, 6)

    def forward(self, x):
        x = self.conv1(x)
        x = self.bn1(x)
        x = self.relu(x)
        x = self.pool(x)

        x = self.conv2(x)
        x = self.bn2(x)
        x = self.relu(x)
        x = self.pool(x)

        x = self.conv3(x)
        x = self.bn3(x)
        x = self.relu(x)
        x = self.pool(x)

        x = x.view(x.size(0), -1) 
        x = self.fc1(x)
        x = self.relu(x)
        x = self.dropout(x)
        x = self.fc2(x)
        x = self.relu(x)
        x = self.fc3(x)
        return x

    def _get_flattened_size(self):
        with torch.no_grad():
            sample_input = torch.zeros(1, 3, 128, 128)  
            x = self.conv1(sample_input)
            x = self.bn1(x)
            x = self.relu(x)
            x = self.pool(x)

            x = self.conv2(x)
            x = self.bn2(x)
            x = self.relu(x)
            x = self.pool(x)

            x = self.conv3(x)
            x = self.bn3(x)
            x = self.relu(x)
            x = self.pool(x)

            return x.view(1, -1).size(1) 


transform = transforms.Compose([
    transforms.Resize((128, 128)), 
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]) 
])

model=CNN()
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.load_state_dict(torch.load('bird_classifier.pth', map_location=device))
model.eval()
model.to(device)
import cv2
import torch
import numpy as np
import matplotlib.pyplot as plt
from PIL import Image

class_map= {0: 'AMERICAN GOLDFINCH', 1: 'BARN OWL', 2: 'CARMINE BEE-EATER', 3: 'DOWNY WOODPECKER', 4: 'EMPEROR PENGUIN', 5: 'FLAMINGO'}

def classify_single_image(image):
    if isinstance(image, np.ndarray):
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)  
        image = Image.fromarray(image)  

    input_tensor = transform(image).unsqueeze(0).to(device) 
    with torch.no_grad():
        output = model(input_tensor) 
        probabilities = torch.softmax(output, dim=1).squeeze() 
        predicted_index = torch.argmax(probabilities).item()
        confidence = probabilities[predicted_index].item()

    predicted_class = class_map[predicted_index]

    print(predicted_class,confidence,probabilities)
    return predicted_class



