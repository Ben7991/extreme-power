const envConfig = () => ({
  port: process.env.PORT,
  secretKey: process.env.SECRET_KEY,
});

export { envConfig };
