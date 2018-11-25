#  kill $(ps aux | grep mongodb-compass | awk '{print $2}')
from pymongo import MongoClient
import re, gridfs, csv
  
try: 
    url = "mongodb://adminUser:purveshFALL2018@13.58.23.159:27017/?authSource=admin&authMechanism=SCRAM-SHA-1"
    conn = MongoClient(url) 
    #conn = MongoClient() 
    print("Connected successfully!!!") 
except:   
    print("Could not connect to MongoDB") 
  
# database 
db = conn.Assistant_Chatbot_Android_Developer 
  
# Created or Switched to collection names: intent
collection = db.intent

imagePath = '/home/neil/Neil_Work/MS_SJSU/295A/ui_component_repo/awesome-android-ui'
fileNames=['ui_actionbar','ui_animation','ui_button','ui_calendar','ui_dialog','ui_effect','ui_graph','ui_image','ui_label','ui_layout','ui_list','ui_material','ui_menu','ui_other','ui_parallax','ui_progress','ui_seekbar','ui_viewpager']

intent = {}
intent['ui_element']={}

j=0
for i in range(len(fileNames)):
    # read csv file to get data
    data_in_list=[]

    #  /home/neil/Neil_Work/MS_SJSU/295A/ui_component_repo/awesome-android-ui
    with open('../data/data-'+fileNames[i]+'.csv', 'r') as dataFile:
        reader = csv.reader(dataFile)
        print(reader)
        data_in_list = list(reader)

    data_in_list.pop(0) # remove header

    fs = gridfs.GridFS(db) # to save images or large files

    for each_row in data_in_list:
        vals = (str(each_row)).strip().split('|')
        entity = vals[0].split(']')[0].split('[')[2]
        entity = entity.replace(".", "_")
        entity = entity.replace("-", "_")
        entity = entity.replace(" ", "_")
        entity = entity.lower()

        url = vals[2]

        if 'NONE' not in url:
            if '(' in url and ')' in url:
                
                if '![](' not in url:
                    break
                
                t=url.split('![](')[1]
                
                if ')' not in t:
                    break
                
                op2=t.split(')')[0]
                imagePath+=op2
            else:
                if 'width' not in url:
                    break

                op2 = url.split('width')[0]
                op3 = re.search('"(.*)"', op2)
                
                if op3 is None:
                    break
                
                imagePath += op3.group(1)

            print("image path name : "+imagePath)
            if 'https' not in imagePath:
                with open(imagePath, 'rb') as imageFile:
                    putId = fs.put(imageFile)
                    #putId = fs.put(imagePath) # saving image using gridfs, returns id of saved image
                    intent['ui_element'][entity] = putId
                    print("id of image ----------------------------------")
                    print(entity)
                    print(putId)

            imagePath='/home/neil/Neil_Work/MS_SJSU/295A/ui_component_repo/awesome-android-ui'

rec_id1 = collection.insert_one(intent)# Insert Data 