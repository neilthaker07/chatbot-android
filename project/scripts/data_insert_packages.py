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
collection = db.api_packages

# read csv file to get data
data_in_list=[]
fileLocation='../data/pkgs/package_data.csv'

import csv
with open(fileLocation, 'r') as f:
    reader = csv.reader(f)
    data_in_list = list(reader)

data_in_list.pop(0) # remove heading

intent = {}

for each_row in data_in_list:
    print(each_row)
    
    que = each_row[0]
    que = que.replace(".", "_")
    que = que.lower()
    que = que.replace(" ","_")
    que = que.replace("-","_")
    que = que.replace("/","_or_")
    
    ans = each_row[1]
    ans = ans.replace("\t", " ")
    ans = ans.replace("     ", " ")

    ans = ans + " " + each_row[2]
    print(que)
    print(ans)

    intent[que]=ans

# Insert Data 
rec_id1 = collection.insert_one(intent) 
  
print("Data inserted with record ids",rec_id1) 
  
# Printing the data inserted 
# cursor = collection.find() 
# for record in cursor: 
#     print record
