import socket
import threading
import sys
import os

# Add the parent directory to sys.path to allow importing 'shared' module
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from shared.protocol import send_message, receive_message

HOST = '0.0.0.0'  # Listen on all available network interfaces
PORT = 5050

def handle_client(conn, addr):
    print(f"[NEW CONNECTION] {addr} connected.")
    try:
        while True:
            msg = receive_message(conn)
            if not msg:
                break
            
            command = msg.get('command')
            print(f"[{addr}] Received command: {command}")
            
            if command == 'ping':
                response = {'status': 'success', 'message': 'pong'}
                send_message(conn, response)
            elif command == 'disconnect':
                print(f"[{addr}] Client requested disconnect.")
                break
            else:
                response = {'status': 'error', 'message': 'Unknown command'}
                send_message(conn, response)
    except Exception as e:
        print(f"[ERROR] Connection with {addr} lost: {e}")
    finally:
        conn.close()
        print(f"[DISCONNECTED] {addr} disconnected.")

def start_server():
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    # Allow port reuse so we don't get "Address already in use" errors during dev
    server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    
    server.bind((HOST, PORT))
    server.listen()
    print(f"[LISTENING] Server is listening on {HOST}:{PORT}")
    
    try:
        while True:
            conn, addr = server.accept()
            thread = threading.Thread(target=handle_client, args=(conn, addr))
            thread.start()
            print(f"[ACTIVE CONNECTIONS] {threading.active_count() - 1}")
    except KeyboardInterrupt:
        print("\n[SHUTTING DOWN] Server is stopping...")
    finally:
        server.close()

if __name__ == "__main__":
    print("[STARTING] Server is starting...")
    start_server()
