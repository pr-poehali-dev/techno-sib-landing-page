import json
from datetime import datetime
import pytz

def handler(event, context):
    """
    Планировщик для синхронизации каталога в 01:00 по Новосибирскому времени
    Триггер должен вызывать эту функцию каждый час, 
    а функция проверяет, нужно ли запускать синхронизацию
    """
    
    # Новосибирское время (UTC+7)
    nsk_tz = pytz.timezone('Asia/Novosibirsk')
    current_time = datetime.now(nsk_tz)
    
    # Проверяем, что сейчас 01:00
    if current_time.hour == 1 and current_time.minute < 10:
        # Время для синхронизации
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'status': 'sync_triggered',
                'time': current_time.isoformat(),
                'message': 'Синхронизация каталога запущена'
            }, ensure_ascii=False),
            'isBase64Encoded': False
        }
    else:
        # Не время для синхронизации
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'status': 'skipped',
                'time': current_time.isoformat(),
                'next_sync': '01:00 NSK time',
                'message': 'Синхронизация не требуется'
            }, ensure_ascii=False),
            'isBase64Encoded': False
        }
