const mongoose = require("mongoose");
mongoose.set('strictQuery', false);
const connectToDB = async () => {
    try {
        const { connection } = await mongoose.connect(process.env.MONGO_URI);
        if (connection) {
            console.log(`Connection to MongoDB:${process.env.MONGO_URI}`)
        }
    } catch (e) {

        console.log(e);
        process.exit(1);
    }
}
module.exports = connectToDB;