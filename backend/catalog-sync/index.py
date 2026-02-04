import json
import xml.etree.ElementTree as ET
from datetime import datetime
import requests
import os

def handler(event, context):
    """
    Синхронизация каталога оборудования из XML фида
    Загружает товары из категорий 221 и 226
    """
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    try:
        # Загружаем XML фид
        xml_url = 'https://t-sib.ru/bitrix/catalog_export/export_Vvf.xml'
        response = requests.get(xml_url, timeout=30)
        response.raise_for_status()
        
        # Парсим XML
        root = ET.fromstring(response.content)
        
        # Находим все товары
        offers = root.findall('.//offer')
        
        # Фильтруем товары по категориям 221 и 226
        target_categories = ['221', '226']
        filtered_products = []
        
        for offer in offers:
            category_id = offer.find('categoryId')
            if category_id is not None and category_id.text in target_categories:
                product = parse_product(offer)
                if product:
                    filtered_products.append(product)
        
        # Возвращаем результат
        result = {
            'products': filtered_products,
            'updated_at': datetime.utcnow().isoformat(),
            'total_count': len(filtered_products)
        }
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps(result, ensure_ascii=False),
            'isBase64Encoded': False
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
                'message': 'Ошибка при загрузке каталога'
            }, ensure_ascii=False),
            'isBase64Encoded': False
        }


def parse_product(offer):
    """Извлекает данные товара из XML элемента"""
    try:
        product = {
            'id': offer.get('id'),
            'available': offer.get('available') == 'true'
        }
        
        # Название
        name = offer.find('name')
        if name is not None:
            product['name'] = name.text
        
        # URL
        url = offer.find('url')
        if url is not None:
            product['url'] = url.text
        
        # Цена
        price = offer.find('price')
        if price is not None:
            product['price'] = float(price.text)
        
        # Валюта
        currency = offer.find('currencyId')
        if currency is not None:
            product['currency'] = currency.text
        
        # Категория
        category_id = offer.find('categoryId')
        if category_id is not None:
            product['category_id'] = category_id.text
        
        # Главное фото
        picture = offer.find('picture')
        if picture is not None:
            product['picture'] = picture.text
        
        # Описание
        description = offer.find('description')
        if description is not None:
            product['description'] = description.text
        
        # Параметры
        params = offer.findall('param')
        all_params = []
        preview_params = []
        
        for param in params:
            param_name = param.get('name')
            
            # Пропускаем картинки и видео
            if param_name in ['Картинки товара', 'Видео (ссылка)']:
                continue
            
            param_data = {
                'name': param_name,
                'value': param.text
            }
            
            # Добавляем единицу измерения если есть
            unit = param.get('unit')
            if unit:
                param_data['unit'] = unit
            
            all_params.append(param_data)
            
            # Для preview исключаем "Бренд"
            if param_name != 'Бренд' and len(preview_params) < 5:
                preview_params.append(param_data)
        
        # Первые 5 параметров (без Бренда)
        product['params_preview'] = preview_params
        # Все параметры (включая Бренд)
        product['params_full'] = all_params
        
        # Вес
        weight = offer.find('weight')
        if weight is not None:
            product['weight'] = float(weight.text)
        
        return product
        
    except Exception as e:
        print(f"Error parsing product {offer.get('id')}: {str(e)}")
        return None