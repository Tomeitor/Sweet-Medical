import mongoose from 'mongoose';

export class MongoDBClient {
    static async connect() {
        try {
            const conn = await mongoose.connect(`mongodb://admin:admin123@localhost:27017/admin`);

            console.log(`MongoDB is connected: ${conn.connection.host}`);
        } catch (error) {
            console.error(`Error: ${error.message}`);
            process.exit(1);
        }
    }
}