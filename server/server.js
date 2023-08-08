const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });
const app = require("./app");

const database = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

const connectToDatabase = async function () {
  try {
    await mongoose.connect(database);
    console.log("Connected to Database");
  } catch (error) {
    console.error(error);
  }
};

const port = process.env.PORT || 8000;

const startServer = async function () {
  try {
    await connectToDatabase();

    app.listen(port, () => {
      console.log(`App running on port ${port}`);
    });
  } catch (error) {
    console.error(error);
    console.log("Can't connect to database");
  }
};

startServer();
