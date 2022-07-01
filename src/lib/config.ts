import path from 'path';
import envSchema from 'env-schema';
import { Static, Type } from '@sinclair/typebox';

export enum NodeEnv {
  development = 'development',
  test = 'test',
  production = 'production',
}

const ConfigSchema = Type.Object({
  NODE_ENV: Type.Enum(NodeEnv),
  API_HOST: Type.String(),
  API_PORT: Type.String(),
  VRAM: Type.Optional(Type.Number()),
  CLOUDINARY_CLOUD_NAME: Type.Optional(Type.String()),
  CLOUDINARY_API_KEY: Type.Optional(Type.String()),
  CLOUDINARY_API_SECRET: Type.Optional(Type.String()),
  IMAGE_URI: Type.Optional(Type.String()),
  VIDEO_URI: Type.Optional(Type.String()),
  DISABLE_IMAGE_GENERATION: Type.Boolean(),
  FEE_BASIS_POINTS: Type.Optional(Type.Number()),
  MAINNET_CONTRACT: Type.String(),
  TESTNET_CONTRACT: Type.String(),
  MAINNET_NODE_RPC_HOSTNAME: Type.String(),
  MAINNET_NODE_RPC_PATH: Type.String(),
  TESTNET_NODE_RPC_HOSTNAME: Type.String(),
  TESTNET_NODE_RPC_PATH: Type.String(),
  LOG_LEVEL: Type.String(),
  PWD: Type.String(),
  DATABASE_URL: Type.String(),
});

export type Config = Static<typeof ConfigSchema>;

export default function loadConfig(): void {
  const result = require('dotenv').config({
    path: path.join(__dirname, `../../.env.${process.env.NODE_ENV ?? 'development'}`),
  });

  if (result.error) {
    throw new Error(result.error);
  }

  envSchema({
    data: result.parsed,
    schema: Type.Strict(ConfigSchema),
  });
}
