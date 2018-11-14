#Entity: lower case, replace space with underscore, no dot
from pymongo import MongoClient 
  
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
collection = db.studio

# read csv file to get data
data_in_list=[]
fileLocation='../data/studio/'

from os import walk
mypath='../data/studio/'
allFiles = []
for (dirpath, dirnames, filenames) in walk(mypath):
    allFiles.extend(filenames)

import csv

intent = {}
for eachFileName in allFiles:
    with open(fileLocation+eachFileName, 'r') as f:
        reader = csv.reader(f)
        data_in_list = list(reader)

    data_in_list.pop(0) # remove heading

    for each_row in data_in_list:   
        que = each_row[0]
        que = que.lower()
        que = que.replace(" ","_")
        ans = each_row[1] + " Click <a href="+each_row[2]+">here</a> for more information."
        intent[que] = ans

# Insert Data 
rec_id1 = collection.insert_one(intent) 
  
print("Data inserted with record ids",rec_id1) 
