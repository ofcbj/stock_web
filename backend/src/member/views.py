import os, json, zipfile
import sqlite3
import pandas as pd
import pymysql
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, JsonResponse, FileResponse
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view
import re

# Create your views here.
gConn = None
gCur = None

def eunsureDbConn():
    global gConn
    global gCur
    if gConn is None:
        gConn = sqlite3.connect('../../data/stock.db')
        gCur = gConn.cursor()
    
    return gConn, gCur
   
def getDf(query, limitRow = False):
    global gConn
    conn, cur = eunsureDbConn()
    try:
        df = pd.read_sql(query, conn)
    except:
        gConn = None
        conn, cur = eunsureDbConn()
        df = pd.read_sql(query, conn)
    
    if limitRow and len(df) > 10:
        df = df.iloc[0:10]
    
    return df

@csrf_exempt
@api_view(['POST'])
def sector_list(request):
    ret = {}
    try:
        query = "SELECT DISTINCT sectorBig FROM company ORDER BY sectorBig"
        df = getDf(query)
        ret['status'] = 'success'
        ret['sectorList'] = df.sectorBig.to_list()
    except Exception as e:
        print(str(e))
    
    print('query end')
    return JsonResponse(json.dumps(ret), safe=False)    

@csrf_exempt
@api_view(['POST'])
def sector_company_list(request):
    sector  = request.data['sector']
    ret = {}
    try:
        ret['status'] = 'success'
        df = getDf("SELECT DISTINCT name FROM company WHERE sectorBig='{sector}' ORDER BY name".format(sector=sector))
        ret['companyList'] = df.name.to_list()
        df = getDf("SELECT f.* FROM finance f INNER JOIN company c ON f.code=c.code WHERE sectorBig='{sector}' ORDER BY name".format(sector=sector))
        ret['financeList'] = df.to_json(orient='records')
    except Exception as e:
        print(str(e))
    
    print('query end')
    return JsonResponse(json.dumps(ret), safe=False)        
