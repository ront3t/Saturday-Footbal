import mongoose from 'mongoose';

export const connectDatabase = async (): Promise<void> => {
  try {
    
    mongoose.connect(process.env.MONGO_CONNECTION_STRING!).then(() => {
      console.log('mongoose connected')
    }).catch(console.error)
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });
    
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });
    
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};
