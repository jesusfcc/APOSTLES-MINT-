
const https = require('https');

const data = JSON.stringify({
    jsonrpc: "2.0",
    id: 1,
    method: "eth_call",
    params: [
        {
            to: "0x77fD806ea78D561E646A302C3D406C278f5b1643",
            // getClaimConditionById(1)
            // Selector: 0x51c70031 (calculated or assumed standard)
            // Arg: 1 (padded to 32 bytes)
            data: "0x51c700310000000000000000000000000000000000000000000000000000000000000001"
        },
        "latest"
    ]
});

const options = {
    hostname: 'base.publicnode.com',
    port: 443,
    path: '/',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = https.request(options, res => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
        try {
            const result = JSON.parse(body);
            if (result.error) {
                console.error('RPC Error:', result.error);
            } else {
                console.log('Raw Result:', result.result);
                decode(result.result);
            }
        } catch (e) {
            console.error('Parse Error:', e);
        }
    });
});

req.on('error', error => {
    console.error('Request Error:', error);
});

req.write(data);
req.end();

function decode(hex) {
    if (!hex || hex === '0x') {
        console.log('Empty result');
        return;
    }
    // Remove 0x
    const raw = hex.replace('0x', '');

    // Split into 32-byte chunks
    const chunks = [];
    for (let i = 0; i < raw.length; i += 64) {
        chunks.push(raw.slice(i, i + 64));
    }

    // ClaimCondition struct:
    // 0: startTimestamp
    // 1: maxClaimableSupply
    // 2: supplyClaimed
    // 3: quantityLimitPerWallet
    // 4: merkleRoot (bytes32)
    // 5: pricePerToken
    // 6: currency (address)
    // 7: metadata (string pointer)

    console.log('--- Decoded ClaimCondition (Index 1) ---');
    console.log('Start Timestamp:', parseInt(chunks[0], 16));
    console.log('Max Supply:', parseInt(chunks[1], 16));
    console.log('Supply Claimed:', parseInt(chunks[2], 16));
    console.log('Quantity Limit:', parseInt(chunks[3], 16));
    console.log('Merkle Root:', '0x' + chunks[4]);
    console.log('Price Per Token:', parseInt(chunks[5], 16));
    console.log('Currency:', '0x' + chunks[6].slice(24));
    console.log('----------------------------------------');
}
