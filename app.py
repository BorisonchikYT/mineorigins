from flask import Flask, render_template, jsonify
from mcsrvstatus import MinecraftServerStatus
import asyncio
import json
import os

app = Flask(__name__)

# Конфигурация сервера
SERVER_CONFIG = {
    'primary_ip': 'f27.joinserver.xyz:25835',
    'numeric_ip': '95.216.92.76:25835',
    'version': '1.21.1 Fabric'
}

class ServerStatusChecker:
    def __init__(self):
        self.client = MinecraftServerStatus()
    
    def get_server_status(self):
        try:
            is_online = self.client.is_server_online(SERVER_CONFIG['numeric_ip'])
            
            if is_online:
                status = self.client.get_server_status(SERVER_CONFIG['numeric_ip'])
                
                players_list = []
                if status.players and status.players.list:
                    players_list = [player.name if hasattr(player, 'name') else str(player) 
                                  for player in status.players.list]
                
                return {
                    'online': True,
                    'players': {
                        'online': status.players.online if status.players else 0,
                        'max': status.players.max if status.players else 0,
                        'list': players_list
                    },
                    'version': status.version.name if status.version else 'Неизвестно',
                    'motd': status.motd.text if status.motd else 'Minecraft Origins Server',
                    'hostname': status.hostname or SERVER_CONFIG['primary_ip'],
                    'icon': status.icon if hasattr(status, 'icon') else None
                }
            else:
                return {
                    'online': False,
                    'players': {'online': 0, 'max': 0, 'list': []},
                    'version': 'Неизвестно',
                    'motd': 'Сервер оффлайн'
                }
                
        except Exception as e:
            print(f"Ошибка при получении статуса сервера: {e}")
            return {
                'online': False,
                'players': {'online': 0, 'max': 0, 'list': []},
                'version': 'Неизвестно',
                'motd': f'Ошибка: {str(e)}'
            }
    
    def close(self):
        self.client.close()

status_checker = ServerStatusChecker()

@app.route('/')
def index():
    return render_template('index.html', config=SERVER_CONFIG)

@app.route('/api/server-status')
def server_status():
    try:
        status_data = status_checker.get_server_status()
        return jsonify(status_data)
    except Exception as e:
        return jsonify({
            'online': False,
            'error': str(e),
            'players': {'online': 0, 'max': 0, 'list': []}
        })

@app.route('/api/player-count')
def player_count():
    try:
        online, max_players = status_checker.client.get_player_count(SERVER_CONFIG['numeric_ip'])
        return jsonify({'online': online, 'max': max_players})
    except Exception as e:
        return jsonify({'online': 0, 'max': 0, 'error': str(e)})

async def get_server_status_async():
    """Асинхронное получение статуса сервера"""
    from mcsrvstatus import AsyncMinecraftServerStatus
    
    async with AsyncMinecraftServerStatus() as client:
        is_online = await client.is_server_online(SERVER_CONFIG['numeric_ip'])
        
        if is_online:
            status = await client.get_server_status(SERVER_CONFIG['numeric_ip'])
            return status
        return None

@app.teardown_appcontext
def close_connection(exception=None):
    """Закрытие соединений при завершении приложения"""
    status_checker.close()

if __name__ == '__main__':
    app.run(debug=True, port=5000)