import mongoose from "mongoose";

mongoose.set("strictQuery", false);
const conString = "mongodb://myUsername:myPassword@localhost:27017/testdb";

mongoose
  .connect(conString)
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const pingSchema = new mongoose.Schema({
  createdAt: { type: Date, required: true },
});

pingSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

pingSchema.set("toObject", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Ping = mongoose.model("ping", pingSchema);
export default Ping;
