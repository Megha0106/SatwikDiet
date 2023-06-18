import os
import numpy as np
import csv
from flask import Flask, request,jsonify
from flask_cors import CORS
from PIL import Image,ImageOps
from keras.models import load_model
import torch
from ultralytics import YOLO
from string import digits
import subprocess
from pathlib import Path

app = Flask(__name__)
cors = CORS(app)

@app.route("/classify_multipleItems",methods=['GET','POST'])
def classify_multipleItems():
   if(request.method == 'POST'):
      bytesOFImage = request.get_data()   
      with open('image.jpeg', 'wb') as out:
         out.write(bytesOFImage)
      img = Image.open("image.jpeg");
      yolo = subprocess.Popen(["python","detect.py","--save-txt",'--source',"image.jpeg","--weights","best.pt"],shell=True);
      yolo.wait()
      print("model loaded:",yolo);
      file1 = open("run/detect/exp/labels/image.txt","r+")
      food_items = file1.read();
      remove_digits = str.maketrans('', '', digits)
      res = food_items.translate(remove_digits)
      print("food items:",res)
      file1.close();
      print("file closed")
      return(res); 
      

@app.route("/")
def home():
   return jsonify({"message":"SatwikDiet"})

@app.route('/classify_singleItem',methods=['GET', 'POST'])
def classify_singleItem():
   if(request.method == 'POST'):
      bytesOFImage = request.get_data()
      with open('image.jpeg', 'wb') as out:
         out.write(bytesOFImage)
      img = Image.open("image.jpeg")
      model = load_model("./Models/NewModel.h5",compile=False)
      class_names = open("newLabel.txt","r").readlines()
      data = np.ndarray(shape=(1, 224, 224, 3), dtype=np.float32)
      size = (224,224)
      image = ImageOps.fit(img, size, Image.Resampling.LANCZOS)
      image_array = np.asarray(image)
      normalized_image_array = (image_array.astype(np.float32) / 127.0) - 1
      data[0] = normalized_image_array
      prediction = model.predict(data)
      index = np.argmax(prediction)
      if(prediction[0][index]>0.50):
             class_name = class_names[index]
             class_name = class_name.replace('"','')
      else:
             class_name = "Sorry, we can't recognize image"     

      return (class_name.strip())



@app.route('/predictSingle',methods= ['GET','POST'])
def predictionSingle():
   predictions = []
   with open("foodData.csv",'r')as file:
      print("request:",request.form['foodItem'])
      reader = csv.reader(file)
      food_item = request.form['foodItem']
      for row in reader:
         if food_item == row[0]:
            predictions = row[1:5]

   return jsonify(predictions)

@app.route('/predictMultiple',methods=['GET','POST'])
def predictionMultiple():
       predictions=[];
       with open("foodData.csv",'r')as file:
          items = request.form['foodItem'].split(",");
          reader = csv.reader(file);
          for i in items:
            for row in reader:
               if row[0].lower() in items:
                  temp = row[0:5];
                  print(predictions.append(temp));
      
       print(predictions)    
       return jsonify(predictions)