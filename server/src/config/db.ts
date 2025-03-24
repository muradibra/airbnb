import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

async function main() {
  const MongoDbURI = process.env.MONGODB_URI;
  await mongoose.connect(MongoDbURI!);
}

main()
  .then(() => {
    console.log("Connected to the db");
  })
  .catch((err) => console.log(err));
