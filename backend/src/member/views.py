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
phoneNumRegex = re.compile(r'\d{3}-\d{4}-\d{4}')

categoryList = [
'00_2020특별부탁',
'01_2016정치후원금',
'02_2016출판기념회',
'03_2016개소식', 
'04_2020전화부탁',
'05_2020문자부탁',
'06_2016당원(현금)',
'07_2016당원(은행)',
'08_2016당원(핸드폰)',
'09_2016당원(은행)2020입당',
'10_2016당원(핸드폰)2020입당',
'11_2016당원(현금)2020입당',
'12_2020당원-신규입당',
'13_2020당원-신규입당(인터넷)',
'14_2020권리당원-취합',
'15_2020권리당원-취합_노동위',
'16_2020권리당원-취합_지역위대의원(2016.08)',
'17_2020권리당원-취합-2018임',
'18_MIN연락처(201912)',
'19_2020캠프조직국',
'20_2020명함',
'21_2020연고자',
'22_2020안양시민',
'23_2020출판기념회',
'24_2020후원금후원물품',
'25_2020본선캠프',
'99_test'
]

category2List = [
'민캠',
'최상',
'상',
'중',
'하'
]

# Create your views here.
gConn = None
gCur = None
table = 'members'

def eunsureDbConn():
    global gConn
    global gCur
    if gConn is None:
        #gConn = pymysql.connect(host='tmpg.cgwygyu2rhhl.ap-northeast-2.rds.amazonaws.com', port=3306, user='admin', passwd='gwang1111', db='tmpg')
        gConn = sqlite3.connect('../../data/stock.db')
        #gConn.set_charset('utf8')
        gCur = gConn.cursor()
    
    return gConn, gCur


def genSearchQuery(targetType, targetValue):
    query = "SELECT * FROM {table} WHERE deleted = 0 AND ("
    if targetType == 'name':
        if len(targetValue) == 2:
            query += "name = '{targetValue}'".format(targetValue=targetValue)
        elif len(targetValue) >= 3:
            query += "name LIKE '%{targetValue}%'".format(targetValue=targetValue)
        else:
            return None, "이름은 2자 이상 입력해야 합니다."
    elif targetType == 'ssnum':
        if len(targetValue) >= 6:
            query += "ssnum_2016 LIKE '%{targetValue}%' OR ssnum_2020 LIKE '%{targetValue}%'".format(targetValue=targetValue)
        else:
            return None, "생년월일은 6자 이상 입력해야 합니다."
    elif targetType == 'phone':
        if len(targetValue) >= 4:
            query += "phone1 LIKE '%{targetValue}%' OR phone2 LIKE '%{targetValue}%' OR phone_2016 LIKE '%{targetValue}%' OR phone_2020 LIKE '%{targetValue}%'".format(targetValue=targetValue)
        else:
            return None, "전화번호는 4자 이상 입력해야 합니다."
    elif targetType == 'memo':
        if len(targetValue) >= 3:
            query += "memo LIKE '%{targetValue}%' OR memo_specific LIKE '%{targetValue}%'".format(targetValue=targetValue)
        else:
            return None, "메모는 3자 이상 입력해야 합니다."

    query += ') ORDER BY phone1'
    query = query.format(table=table)
    
    return query, "success"

    
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
def member_search(request):
    targetType  = request.data['targetType']
    targetValue = request.data['targetValue']

    ret = {}
    try:
        query, message = genSearchQuery(targetType, targetValue)
        if query is not None:
            df = getDf(query, targetType=='memo')
            df = df.drop(['deleted'], axis=1)
            if len(df) > 0:
                ret['status'] = 'success'
                #df = df.replace('', '    ')
                df1 = df[['serial_no', 'name', 'category', 'category2', 'recommender', 'memo_specific', 'memo', 'phone1', 'phone2', 'remark', 'phone_group']]
                df2 = df[['name_2020', 'category_2020', 'recommender_a_2020','recommender_b_2020', 'ssnum_2020', 'address_2020', 'account_2020','phone_2020', 'integrate_day_2020', 'remark_2020', 'submit_day_2020']]
                df3 = df[['name_2016', 'category_2016', 'phone_2016', 'recommender_2016','ssnum_2016', 'address_2016', 'company_position', 'company_num','company_fax', 'company_address', 'email']]
                ret['data'] = {}
                ret['data']['data1'] = df1.to_json(orient='records')
                ret['data']['data2'] = df2.to_json(orient='records')
                ret['data']['data3'] = df3.to_json(orient='records')
                ret['message'] = '%d명의 회원 데이터를 찾았습니다.'%(len(df))
            else:
                ret['status'] = 'fail'
                ret['message'] = '회원 데이터가 없습니다.'
        else:
            ret['status'] = 'fail'
            ret['message'] = message
    except Exception as e:
        print(str(e))
        ret['status'] = 'fail'
        ret['message'] = '%s'%(str(e).split(':')[-1][:-3])
    
    print('query end')
    return JsonResponse(json.dumps(ret), safe=False)


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