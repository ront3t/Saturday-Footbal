import app from './app'
import mongoose from 'mongoose'

const port = process.env.PORT

mongoose.connect(process.env.MONGO_CONNECTION_STRING!).then(() => {
  console.log('mongoose connected')
  app.listen(port, () => {
    console.log('server running on port: ' + port)
  })
}).catch(console.error)

// import dotenv from 'dotenv';
// import app from './app';
// import { connectDatabase } from './config/db';

// // Handle uncaught exceptions
// process.on('uncaughtException', (err) => {
//   console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
//   console.log(err.name, err.message);
//   process.exit(1);
// });

// // Load environment variables
// dotenv.config();


// const port = process.env.PORT || 3000;

// const server = app.listen(port, () => {
//   console.log(`App running on port ${port}...`);
  
//   // Connect to database
//   connectDatabase();
// });


// // Handle unhandled promise rejections
// process.on('unhandledRejection', (err: Error) => {
//   console.log('UNHANDLED REJECTION! 💥 Shutting down...');
//   console.log(err.name, err.message);
//   server.close(() => {
//     process.exit(1);
//   });
// });

// // Handle SIGTERM
// process.on('SIGTERM', () => {
//   console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
//   server.close(() => {
//     console.log('💥 Process terminated!');
//   });
// });
