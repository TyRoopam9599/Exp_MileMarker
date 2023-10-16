import mongoose from "mongoose";

export const connectDB = async () => {
  const maxRetries = 5; // Maximum number of retries
  let retries = 0;

  const connectWithRetry = async () => {
    try {
      await mongoose.connect(process.env.MONGO_DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Connected to the database.");
    } catch (error) {
      if (retries < maxRetries) {
        console.error(`Connection to the database failed. Retrying...`);
        retries++;
        // Exponential backoff with a random factor to prevent simultaneous retries
        const delay = Math.pow(2, retries) * 1000 + Math.random() * 1000;
        setTimeout(connectWithRetry, delay);
      } else {
        console.error(
          `Max connection retries reached. Unable to connect to the database.`
        );
        process.exit(1); // Terminate the application
      }
    }
  };

  // Start the initial connection attempt
  connectWithRetry();
};
