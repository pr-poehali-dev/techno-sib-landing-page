import json
import xml.etree.ElementTree as ET
from urllib.request import urlopen
from datetime import datetime

def handler(event, context):
    """Парсер XML-фида товаров с фильтрацией по категориям"""
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    try:
        xml_url = 'https://t-sib.ru/bitrix/catalog_export/export_Vvf.xml'
        
        with urlopen(xml_url) as response:
            xml_data = response.read()
        
        root = ET.fromstring(xml_data)
        
        shop = root.find('shop')
        if shop is None:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Invalid XML structure'})
            }
        
        categories = {}
        for category in shop.findall('.//category'):
            cat_id = int(category.get('id'))
            categories[cat_id] = category.text
        
        products = []
        target_categories = [220, 226, 457]
        
        for offer in shop.findall('.//offer'):
            offer_id = offer.get('id')
            category_id_elem = offer.find('categoryId')
            
            if category_id_elem is None:
                continue
                
            category_id = int(category_id_elem.text)
            
            if category_id not in target_categories:
                continue
            
            name = offer.find('name')
            price = offer.find('price')
            picture = offer.find('picture')
            description = offer.find('description')
            
            params = []
            params_preview = []
            params_full = []
            
            priority_params = ['Производительность (кг/ч)', 'Мощность (Вт)', 'Бренд']
            
            for param in offer.findall('param'):
                param_name = param.get('name')
                param_value = param.text
                param_unit = param.get('unit', '')
                
                param_obj = {
                    'name': param_name,
                    'value': param_value,
                    'unit': param_unit
                }
                
                params.append(param_obj)
                params_full.append(param_obj)
                
                if param_name in priority_params:
                    params_preview.append(param_obj)
            
            params_preview.sort(key=lambda x: priority_params.index(x['name']) if x['name'] in priority_params else 999)
            
            product = {
                'id': offer_id,
                'category_id': category_id,
                'category_name': categories.get(category_id, ''),
                'name': name.text if name is not None else '',
                'price': float(price.text) if price is not None else 0,
                'picture': picture.text if picture is not None else '',
                'description': description.text if description is not None else '',
                'params': params,
                'params_preview': params_preview[:3],
                'params_full': params_full
            }
            
            products.append(product)
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'products': products,
                'total': len(products),
                'updated_at': datetime.utcnow().isoformat()
            }, ensure_ascii=False)
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': str(e),
                'message': 'Failed to parse XML feed'
            })
        }
