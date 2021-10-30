const express = require('express')
const app = express()
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId;
const { MongoClient } = require("mongodb");
require('dotenv').config()
const port = process.env.PORT || 5000


app.use(express.json())
app.use(cors())


app.get('/', (req, res) =>{
  res.send('TravelGo server running')
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
    const ordersCollection = placeOrderDatabase.collection('orders')

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

    //get method for getting the services

    app.get('/services/place-order/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await serviceCollection.findOne(query);
      res.send(service);
    })

    //place order post method

    app.post('/place-order', async (req, res)=>{
      const newOrder = req.body;
      const result = await ordersCollection.insertOne(newOrder);
      console.log(newOrder)
      res.json(result);
      res.send(res.json(result))
    })

    //get method to show the ordered thinks

    app.get('/my-orders', async (req, res)=>{
      const collection = ordersCollection.find({})
      const orders = await collection.toArray()
      res.send(orders)
    })

    //delete mathod for manage my orders

    app.delete('/cancel-order/:id', async (req, res)=>{
        const id = req.params.id.trim();
        const query = { _id: ObjectId(id)}
        const del = await ordersCollection.deleteOne(query);
        console.log('deleting the user', query)
        res.json(del)
    })

    //put method to update staus on manage orders

    app.put('/update-status/:id', async (req, res)=>{
      const id = req.params.id;
        const updatedOrder = req.body;
        const filter = { _id: ObjectId(id)}
        const updateDoc = {
          $set: {
            status: updatedOrder.status
          }
        }
        const options = { upsert: true }
      const result = await ordersCollection.updateOne(filter, updateDoc, options)
      console.log('updating user: ', updatedOrder);
      res.json(result)
    })

    //get method for get data form orders 

    app.get('/orders/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await ordersCollection.findOne(query);
      res.send(service);
    })

    //post method to add new service

    app.post('/add-new-services', async (req, res)=>{
      const newService = req.body;
      const result = await serviceCollection.insertOne(newService);
      console.log(newService)
      res.json(result);
      // res.send(res.json(result))
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