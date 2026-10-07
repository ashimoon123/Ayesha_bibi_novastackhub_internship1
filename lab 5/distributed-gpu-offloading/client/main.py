import time
from network import GPUClient

def main():
    HOST = '127.0.0.1'  # Using localhost for initial testing
    PORT = 5050
    
    print(f"Attempting to connect to server at {HOST}:{PORT}...")
    client = GPUClient(HOST, PORT)
    
    if client.connect():
        print("Connection successful! Testing ping...")
        
        # Test ping 3 times
        for i in range(3):
            success, latency = client.ping()
            if success:
                print(f"[SUCCESS] Server pinged successfully. Latency: {latency:.2f} ms")
            else:
                print("[ERROR] Failed to ping server.")
            time.sleep(1)
            
        print("Testing complete. Disconnecting...")
        client.disconnect()
    else:
        print("[ERROR] Could not connect to the server. Is it running?")

if __name__ == "__main__":
    main()
