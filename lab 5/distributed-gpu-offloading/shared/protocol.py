import json
import struct

def send_message(sock, message_dict):
    """
    Serializes a dictionary to JSON, prepends its length (4 bytes), 
    and sends it over the socket.
    """
    message_json = json.dumps(message_dict).encode('utf-8')
    # Pack the length of the message as a 4-byte big-endian integer
    message_length = struct.pack('!I', len(message_json))
    sock.sendall(message_length + message_json)

def receive_message(sock):
    """
    Receives a 4-byte length prefix, then reads the JSON message of that length.
    Returns the decoded dictionary.
    """
    # Read the 4-byte length prefix
    raw_msglen = recvall(sock, 4)
    if not raw_msglen:
        return None
    msglen = struct.unpack('!I', raw_msglen)[0]
    
    # Read the message data
    raw_msg = recvall(sock, msglen)
    if not raw_msg:
        return None
    return json.loads(raw_msg.decode('utf-8'))

def recvall(sock, n):
    """
    Helper function to receive exactly n bytes or return None if EOF is hit.
    """
    data = bytearray()
    while len(data) < n:
        packet = sock.recv(n - len(data))
        if not packet:
            return None
        data.extend(packet)
    return bytes(data)
