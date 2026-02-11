import json
import xml.etree.ElementTree as ET
from urllib.request import urlopen
from datetime import datetime
import time

cache = {}
CACHE_DURATION = 300

def clear_cache():
    global cache
    cache = {}

def handler(event, context):
    """Парсер XML-фида товаров с фильтрацией по категориям"""
    
    global cache
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
        current_time = time.time()
        query_params = event.get('queryStringParameters', {}) or {}
        force_refresh = query_params.get('refresh') == 'true'
        
        if not force_refresh and 'data' in cache and 'timestamp' in cache:
            if current_time - cache['timestamp'] < CACHE_DURATION:
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'X-Cache': 'HIT'
                    },
                    'body': cache['data']
                }
        
        xml_url = 'https://t-sib.ru/upload/catalog.xml'
        
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
        target_categories = [220, 221, 226]
        total_images_found = 0
        
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
            additional_images = []
            
            all_param_names = [p.get('name') for p in offer.findall('param')]
            
            for param in offer.findall('param'):
                param_name = param.get('name')
                param_value = param.text
                param_unit = param.get('unit', '')
                
                if param_name == 'Картинки товара' and param_value:
                    img_url = param_value.strip()
                    if img_url:
                        if img_url.startswith('/'):
                            img_url = 'https://t-sib.ru' + img_url
                        additional_images.append(img_url)
                        total_images_found += 1
                    continue
                
                if param_name == 'Видео (ссылка)':
                    continue
                
                param_obj = {
                    'name': param_name,
                    'value': param_value,
                    'unit': param_unit
                }
                
                params.append(param_obj)
                params_full.append(param_obj)
                
                if len(params_preview) < 5:
                    params_preview.append(param_obj)
            
            # Парсим и очищаем цену
            price_value = None
            if price is not None:
                price_text = price.text.strip()
                # Убираем "от", "руб", "руб.", пробелы и другие текстовые части
                price_text = price_text.replace('от', '').replace('руб.', '').replace('руб', '').replace(' ', '').strip()
                try:
                    price_value = float(price_text)
                except ValueError:
                    price_value = None
            
            # Фильтруем товары:
            # - Если цена есть и меньше 300000 - пропускаем
            # - Если цены нет (None) - включаем товар
            # - Если нет ни одного параметра - пропускаем
            if price_value is not None and price_value < 300000:
                continue
            
            if len(params) == 0:
                continue
            
            product = {
                'id': offer_id,
                'category_id': category_id,
                'category_name': categories.get(category_id, ''),
                'name': name.text if name is not None else '',
                'price': price_value if price_value is not None else 0,
                'picture': picture.text if picture is not None else '',
                'additional_images': additional_images,
                'description': description.text if description is not None else '',
                'params': params,
                'params_preview': params_preview[:5],
                'params_full': params_full,
                'debug_all_params': all_param_names[:10]
            }
            
            products.append(product)
        
        products_with_images = [p for p in products if p['additional_images']]
        
        response_body = json.dumps({
            'products': products,
            'total': len(products),
            'total_images_found': total_images_found,
            'products_with_images': len(products_with_images),
            'updated_at': datetime.utcnow().isoformat()
        }, ensure_ascii=False)
        
        cache['data'] = response_body
        cache['timestamp'] = current_time
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'X-Cache': 'MISS'
            },
            'body': response_body
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