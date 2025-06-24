import type { NextConfig } from "next";
import dotenv from 'dotenv';

dotenv.config({path: '../../.env'});

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  }
};

export default nextConfig;
