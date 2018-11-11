# data cleaning
# data preprocessing
# data insertion
# script for insertion

from pymongo import MongoClient 
  
try: 
    conn = MongoClient() 
    print("Connected successfully!!!") 
except:   
    print("Could not connect to MongoDB") 
  
# database 
db = conn.Assistant_Chatbot_Android_Developer 
  
# Created or Switched to collection names: intent
collection = db.code

# read csv file to get data
data_in_list=[]
fileLocation='../data/data-code.csv'

import csv
with open(fileLocation, 'r') as f:
    reader = csv.reader(f)
    data_in_list = list(reader)

data_in_list.pop(0) # remove heading

intent = {}

for each_row in data_in_list:
    if "|" in each_row[1]:
        multiple_vals = each_row[1]
        vals = multiple_vals.split('|')
        for val in vals:
            intent[val] = each_row[2]
    else:
        intent[each_row[1]] = each_row[2]

# Insert Data 
rec_id1 = collection.insert_one(intent) 
  
print("Data inserted with record ids",rec_id1) 

# Printing the data inserted 
# cursor = collection.find() 
# for record in cursor: 
#     print record 

