import https from 'https';

const pokeOpenSea = async (tokenId: string, contract: string): Promise<boolean> => {
  const options = {
    hostname: 'https://api.opensea.io',
    path: `/api/v1/asset/${contract}/${tokenId}?force_update=true`,
    method: 'GET',
    headers: {
      'Content-Type': 'text/html',
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      res.on('end', () => {
        resolve(true);
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
};

export default pokeOpenSea;
