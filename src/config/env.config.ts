const envConfig = () => ({
  port: process.env.PORT,
  secretKey: process.env.SECRET_KEY,
  admin: {
    name: process.env.ADMIN_NAME,
    username: process.env.ADMIN_USERNAME,
    password: process.env.ADMIN_PASSWORD,
  },
});

export { envConfig };
