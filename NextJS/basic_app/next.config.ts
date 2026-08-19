import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler:true,  // This adds the feature of the react compiler which will memoize and optimizes 
  experimental:{
    turbopackFileSystemCacheForDev:true,
  }
};

export default nextConfig;
