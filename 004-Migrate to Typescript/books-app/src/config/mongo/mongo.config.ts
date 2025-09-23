if (!process.env.ME_CONFIG_MONGODB_URL) {
  throw new Error(
    "MongoDB connection string is not defined in environment variables."
  );
}

export default { url: process.env.ME_CONFIG_MONGODB_URL };
