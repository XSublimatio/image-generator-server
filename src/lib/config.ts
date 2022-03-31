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
  AWS_BUCKET_URL: Type.String(),
  AWS_BUCKET_REGION: Type.String(),
  AWS_BUCKET_NAME: Type.String(),
  AWS_ACCESS_KEY: Type.String(),
  AWS_SECRET_ACCESS_KEY: Type.String(),
  DISABLE_IMAGE_GENERATION: Type.Boolean(),
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
