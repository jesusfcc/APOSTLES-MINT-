
import urllib.request
import json
import ssl


def main():
    url = "https://base.publicnode.com"
    CONTRACT = "0x77fD806ea78D561E646A302C3D406C278f5b1643"
    
    # 1. Get Active Condition ID
    # Selector: 0x78921162
    id_payload = {
        "jsonrpc": "2.0",
        "method": "eth_call",
        "params": [{
            "to": CONTRACT,
            "data": "0x78921162"
        }, "latest"],
        "id": 1
    }
    
    print("Fetching Active ID...")
    active_id = call_rpc(url, id_payload)
    if active_id is None: return
    
    active_id_int = int(active_id, 16)
    print(f"Active Condition ID: {active_id_int}")
    
    # 2. Get Condition Details
    # Selector: 0x211c47be
    # Arg: active_id_int padded to 64 chars
    arg = format(active_id_int, '064x')
    data = "0x211c47be" + arg
    
    cond_payload = {
        "jsonrpc": "2.0",
        "method": "eth_call",
        "params": [{
            "to": CONTRACT,
            "data": data
        }, "latest"],
        "id": 2
    }
    
    print("Fetching Condition Details...")
    cond_hex = call_rpc(url, cond_payload)
    if cond_hex:
        decode(cond_hex)

def call_rpc(url, payload):
    headers = {'Content-Type': 'application/json'}
    req = urllib.request.Request(
        url, 
        data=json.dumps(payload).encode('utf-8'), 
        headers=headers,
        method="POST"
    )
    
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    
    try:
        with urllib.request.urlopen(req, context=ctx) as response:
            res_body = response.read()
            res_json = json.loads(res_body)
            
            if 'error' in res_json:
                print("RPC Error:", res_json['error'])
                return None
            else:
                return res_json['result']
    except Exception as e:
        print("Request Failed:", e)
        return None


def decode(hex_str):
    if not hex_str or hex_str == '0x':
        print("Empty result")
        return
    
    raw = hex_str.replace('0x', '')
    # Split into 32-byte (64 hex char) chunks
    chunks = [raw[i:i+64] for i in range(0, len(raw), 64)]
    
    # ClaimCondition struct (Index 1):
    # 0: startTimestamp
    # 1: maxClaimableSupply
    # 2: supplyClaimed
    # 3: quantityLimitPerWallet
    # 4: merkleRoot (bytes32)
    # 5: pricePerToken
    # 6: currency (address)
    # 7: metadata (string pointer)
    
    print("--- Decoded ---")
    if len(chunks) > 0: print("Start Timestamp:", int(chunks[0], 16))
    if len(chunks) > 1: print("Max Supply:", int(chunks[1], 16))
    if len(chunks) > 2: print("Supply Claimed:", int(chunks[2], 16))
    if len(chunks) > 3: print("Quantity Limit:", int(chunks[3], 16))
    if len(chunks) > 4: print("Merkle Root:", "0x" + chunks[4])
    if len(chunks) > 5: print("Price Per Token:", int(chunks[5], 16))
    if len(chunks) > 6: print("Currency:", "0x" + chunks[6][-40:])
    print("---------------")

if __name__ == "__main__":
    main()
