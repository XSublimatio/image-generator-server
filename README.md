# Image Generator Server

## Information

This server does 2 things, expose a metadata endpoint for XSublimatio NFT's, and generate the NFT's images & videos and upload them.

## Local development

If you're running this server merely for local development, it's not nessecary, and not advised to run the image generation.
The .env.development should be configured as follows.
```NODE_ENV=development
LOG_LEVEL=debug
DISABLE_IMAGE_GENERATION=true
API_HOST=0.0.0.0
API_PORT=5000
AWS_BUCKET_URL=https://localhost:5552/media
AWS_BUCKET_REGION=notrelevant
AWS_BUCKET_NAME=notrelevant
AWS_ACCESS_KEY=notrelevant
AWS_SECRET_ACCESS_KEY=notrelevant
NODE_RPC_URL=http://localhost:7545 <- your local ganache instance
DATABASE_URL=PostgreSQL database URL
```


## Image generation

Depends on https://github.com/XSublimatio/image-generator & ffmpeg for image generation.  
Download the release, unpack, rename the build folder to img-generator and put it in this repo's root.  
The built file mentioned above is only valid for linux64, no build files are available for other operating systems.  
