const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;


// Middle ware
const corsConfig = {
  origin: '*',
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
}
app.use(cors(corsConfig))
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster1.gsyh7hk.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const carsCollection = client.db('CarsCollectionDB').collection('car')
   const selectedCars = client.db('SelectedCar').collection('Cars')


    // Create Data (POST)
    app.post('/cars', async(req,res)=>{
     const newCar = req.body;
     const result = await carsCollection.insertOne(newCar)
     res.send(result)

    })

     // Send data to UI (GET)
     app.get('/brandedcars', async(req,res)=>{
      const cursor = carsCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    // Save data for selected product
   app.post('/mycart', async(req, res)=>{
    const car = req.body;
    const result = await selectedCars.insertOne(car);
    res.send(result);
})

 // Save data for selected product
 app.get('/mycart', async(req,res)=>{
   const cursor = selectedCars.find();
   const result = await cursor.toArray()
   res.send(result)
   })


   //  Upadte Cars Route
   app.get('/updateinfo/:id', async (req, res)=>{
    const id = req.params.id;
    const filter = {_id: new ObjectId(id)};
    const result = await carsCollection.findOne(filter);
    res.send(result)
   })

  //  Update methode
  app.put('/product-details/:id', async(req,res)=>{
    const id = req.params.id;
    const filter = {_id: new ObjectId(id)};
    const options = {upsert: true};
    const updatedCar= req.body;
    const Car = {
      $set:{
        name:updatedCar.name,
        category:updatedCar.category, 
        price:updatedCar.price, 
        rating:updatedCar.rating, 
        image:updatedCar.image, 
        description:updatedCar.description
      }
    }
    const result = await carsCollection.updateOne(filter,Car,options)
    res.send(result);
  })

    // Product Details
    app.get("/product-details/:id", async(req, res) => {
      const productId = req.params.id;
      const filter = {_id : new ObjectId(productId)};
      const result = await carsCollection.findOne(filter);
      res.send(result)
    })


    app.get('/brandedcars/:id', async(req,res)=>{
      const id = req.params.id;
      const filter = {category: id}
      const result = await carsCollection.find(filter).toArray();
      res.send(result);
    })

   // Detete Info
  app.delete('/product-details/:id', async (req, res)=>{
    const id = req.params.id;
    const filter = {_id : new ObjectId(id)};
    const result = await selectedCars.deleteOne(filter);
    res.send(result)
  })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get ('/',(req,res)=>{
    res.send('Velocity Vertex are running')
})

app.listen(port ,()=>{
    console.log(`Velocity Vertex is running on port :- ${port}`)
})
