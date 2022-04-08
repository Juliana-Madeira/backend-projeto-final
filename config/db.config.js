require('dotenv').config();
const mongoose = require('mongoose');

const connectDb = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Database connected to mongo: ${connection.connections[0].name} `);
    } catch (error) {
        console.log('Error connecting to DB');
    }
}

module.exports = connectDb;