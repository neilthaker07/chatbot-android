from pymongo import MongoClient 

try: 
    conn = MongoClient() 
    print("Connected successfully!!!") 
except:   
    print("Could not connect to MongoDB") 
  
# database 
db = conn.Assistant_Chatbot_Android_Developer 
  
# Created or Switched to collection names: intent
collection = db.intent

# read csv file to get data
data_in_list=[]
fileLocation='../data/pkgs/keyboard_shortcuts.csv'
intentName = "keyboard_shortcuts"#api_packages

import csv
with open(fileLocation, 'rb') as f:
    reader = csv.reader(f)
    data_in_list = list(reader)

data_in_list.pop(0) # remove heading
data_in_list.pop(1)

intent = {}
intent[intentName]={}  # code is intent name for the document

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
        intent[intentName][que]=ans

# Insert Data 
rec_id1 = collection.insert_one(intent) 
  
print("Data inserted with record ids",rec_id1) 
  
# Printing the data inserted 
# cursor = collection.find() 
# for record in cursor: 
#     print record 

