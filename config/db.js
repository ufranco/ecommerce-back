const mongoose = require("mongoose");

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    autoIndex: true,
    keepAlive: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });

  console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.italic.bold);
};

module.exports = connectDB;
