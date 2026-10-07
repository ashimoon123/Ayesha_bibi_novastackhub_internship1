import socket
import time
import sys
import os

# Add the parent directory to sys.path to allow importing 'shared' module
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from shared.protocol import send_message, receive_message

class GPUClient:
    def __init__(self, host, port):
        self.host = host
        self.port = port
        self.client_socket = None

    def connect(self):
        try:
            self.client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            self.client_socket.connect((self.host, self.port))
            print(f"[CONNECTED] Connected to {self.host}:{self.port}")
            return True
        except Exception as e:
            print(f"[ERROR] Failed to connect: {e}")
            return False

    def disconnect(self):
        if self.client_socket:
            try:
                # Inform the server before dropping the connection
                send_message(self.client_socket, {'command': 'disconnect'})
            except:
                pass
            self.client_socket.close()
            print("[DISCONNECTED] Disconnected from server.")

    def ping(self):
        if not self.client_socket:
            return False, 0
        
        start_time = time.time()
        try:
            send_message(self.client_socket, {'command': 'ping'})
            response = receive_message(self.client_socket)
            
            if response and response.get('status') == 'success':
                latency = (time.time() - start_time) * 1000 # convert to ms
                return True, latency
        except Exception as e:
            print(f"[ERROR] Ping failed: {e}")
            
        return False, 0
