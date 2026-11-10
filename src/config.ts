import 'dotenv/config';

export const config = {
  name: 'sample-orders-api',
  port: Number.parseInt(process.env.PORT ?? '3000', 10),
  environment: process.env.APP_ENV ?? 'development',
  // Tests run without log output unless LOG_LEVEL says otherwise.
  logLevel:
    process.env.LOG_LEVEL ??
    (process.env.NODE_ENV === 'test' ? 'silent' : 'info'),
};
