import mongoose from "mongoose";

const DbConnection = async () => {
  await mongoose
    .connect(process.env.mongoUrl,{
  dbName: "Binge"
})
    .then(() => console.log("DB Connected"))
    .catch(() => console.log("DB Connection Error"));
};

export default DbConnection;
