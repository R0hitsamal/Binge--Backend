import mongoose from "mongoose";

const DbConnection = async () => {
  await mongoose
    .connect(process.env.mongoUrl)
    .then(() => console.log("DB Connected"))
    .catch(() => console.log("DB Connection Error"));
};

export default DbConnection;
