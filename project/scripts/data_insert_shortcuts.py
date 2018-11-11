from pymongo import MongoClient 

try: 
    url = "mongodb://adminUser:purveshFALL2018@13.58.23.159:27017/?authSource=admin&authMechanism=SCRAM-SHA-1"
    conn = MongoClient(url) 
    print("Connected successfully!!!") 
except:   
    print("Could not connect to MongoDB") 
  
# database 
db = conn.Assistant_Chatbot_Android_Developer 
  
# Created or Switched to collection names: intent
collection = db.keyboard_shortcuts

# read csv file to get data
data_in_list=[]
fileLocation='../data/pkgs/keyboard_shortcuts.csv'

import csv
with open(fileLocation, 'r') as f:
    reader = csv.reader(f)
    data_in_list = list(reader)

data_in_list.pop(0) # remove heading
data_in_list.pop(1)

intent = {}
for each_row in data_in_list:
    que = each_row[0]
    if len(que)!=0:
        print(que)
        windows_ans = each_row[1]
        mac_ans = each_row[2]

        que=que.replace('.',' ')

        ans = {}
        ans['win'] = windows_ans
        ans['mac'] = mac_ans
        
        #print(ans)
        intent[que]=ans

# Insert Data 
rec_id1 = collection.insert_one(intent) 
  
print("Data inserted with record ids",rec_id1) 
  
# Printing the data inserted 
# cursor = collection.find() 
# for record in cursor: 
#     print record 

