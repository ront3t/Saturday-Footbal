import app from './app'
import mongoose from 'mongoose'

const port = process.env.PORT

mongoose.connect(process.env.MONGO_CONNECTION_STRING!).then(() => {
  console.log('mongoose connected')
  app.listen(port, () => {
    console.log('server running on port: ' + port)
  })
}).catch(console.error)
