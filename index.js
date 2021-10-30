const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient } = require("mongodb");
require('dotenv').config()
const port = process.env.PORT || 5000
app.use(express.json())
app.use(cors())


app.get('/', (req, res) =>{
  res.send('services server running')
})


// Replace the uri string with your MongoDB deployment's connection string.
const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xuibt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();

    // db and collection for services 
    const serviceDatabase = client.db('services');
    const serviceCollection = serviceDatabase.collection('service');
    //db and collection for cars
    const carsDatabase = client.db('cars');
    const carsCollection = carsDatabase.collection('car')
    //db and collection for placeorder 
    const placeOrderDatabase = client.db('placeOrder');
    const ordersCollection = carsDatabase.collection('orders')

    //get api
    app.get('/services', async (req, res)=>{
      const collection = serviceCollection.find({});
      const service = await collection.toArray()
      res.send(service)
    })

    app.get('/cars', async (req, res) =>{
      const collection = carsCollection.find({})
      const car = await collection.toArray()
      res.send(car)
    })

    app.get('/services/:service_name', async (req, res) =>{
      const id = req.body
      console.log(id)
    })

    app.put('/services/place-order/:services_name', async (req, res)=>{
      
    })

  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})