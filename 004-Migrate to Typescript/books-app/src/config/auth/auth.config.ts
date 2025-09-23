if (process.env.NODE_ENV === "production" && !process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET is required in production mode.");
}

export default {
  session: {
    secret: process.env.SESSION_SECRET
  },
};
