import https from 'https';

const tokenExists = async (tokenId: string): Promise<boolean> => {
  const data = JSON.stringify({
    jsonrpc: '2.0',
    method: 'eth_call',
    params: [
      {
        to: process.env.CONTRACT,
        // 6352211e is the selector for `ownerOf(uint256)`
        data: `0x6352211e${BigInt(tokenId).toString(16).padStart(64, '0')}`,
      },
      'latest',
    ],
    id: 1,
  });

  const options = {
    hostname: process.env.NODE_RPC_HOSTNAME,
    path: process.env.NODE_RPC_PATH,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
    },
  };

  return new Promise((resolve, reject) => {
    let returnData = '';

    const req = https.request(options, (res) => {
      res.on('data', (chunk) => {
        returnData += chunk;
      });

      res.on('end', () => {
        resolve(JSON.parse(returnData).result !== '0x');
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
};

export default tokenExists;
