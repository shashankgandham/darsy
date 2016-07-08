#!/usr/bin/python3
import json
import MySQLdb
import sys
import ssl
import nlp
from cgi import FieldStorage
from parsers.wiki import wiki
from functions.calculator import calculator

def analyze(data):
    query = nlp.process(data)
    response = {}
    if(query['type'] == "wiki"):
        response = encyclopedia(query['subject'])
    if(query['type'] == "calc"):
        response = calculator.main(query['subject'])
    if(query['type'] == "error"):
        response = query
    return response


def encyclopedia(data):
    response = {}
    response['type'] = 'wiki'
    if 'title' not in response:
        response = wiki.info(data)
    return response

print("Content-Type: text/html")
print()

form = FieldStorage()
message = form.getvalue("message", "error")
if message[-1] == '\n':
    message = message[:-1]
if message == "welcome":
    response = nlp.on_load_function()
    response['content'] = response['content'] + ' ' + nlp.start()
elif message == "continue_or_not":
    response = nlp.continue_or_not()
elif nlp.is_concluding(message):
    response = nlp.parting()
else:
    response = analyze(message)
print(json.dumps(response))
