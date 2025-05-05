// env.d.ts

namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    DATABASE_URL: string;
    // Add more variables below as needed
    NEON_DATABASE_URL: string;
    SESSION_SECRET: string;
    PORT?: string;
  }
}
