const express = require('express');
const cors = require('cors');
const { MongoClient } = require("mongodb");
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASSWORD}@cluster0.znysc.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);
app.use(cors());
app.use(express.json());
app.get('/',(req,res)=>{
    res.send('Red Onion Server');
});
async function run() {
    try {
        await client.connect();
     const database = client.db("RedOnion");
     const foodsCollection = database.collection("Foods");
     const cartCollection  = database.collection("cart");
     const ordersCollection = database.collection("orders");
     app.get('/foods/:item',async(req,res)=>{
         const item = req.params.item;
         const query = {item:item}
         const result =  foodsCollection.find(query);
         const foods = await result.toArray()
         res.send(foods);
     });
     app.post('/cart',async(req,res)=>{
      const cart = req.body;
      const result = await cartCollection.insertOne(cart);
      res.json(result);
     });
     app.get('/cart/:email',async(req,res)=>{
      const email = req.params.email;
      const query = {email:email};
      const result =  cartCollection.find(query);
      const cart = await result.toArray();
      res.send(cart);
     });
     app.delete('/deleteCart/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id:ObjectId(id)};
      const result = await cartCollection.deleteOne(query);
      res.json(result);
      
     });
     app.post('/order',async(req,res)=>{
      const orderInfo = req.body;
      const result = await ordersCollection.insertOne(orderInfo);
      res.json(result);
    });
    app.delete('/clearcart/:email',async(req,res)=>{
      const email = req.params.email;
      const query = {email: email};
      const result = await cartCollection.deleteMany(query);
      res.json(result);
    });
    app.get('/myorders/:email',async(req,res)=>{
      const email = req.params.email;
      const query = {email:email};
      const result = ordersCollection.find(query);
      const myOrders = await result.toArray();
      res.send(myOrders);
    });
    app.get('/allorders',async(req,res)=>{
      const allorders = ordersCollection.find({});
      const result = await allorders.toArray();
      res.send(result);
    });
    app.delete('/deleteorder/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id:ObjectId(id)};
      const result = await ordersCollection.deleteOne(query);
      res.json(result);
    })
    } finally {
      // Ensures that the client will close when you finish/error
    //   await client.close();
    }
  }
  run().catch(console.dir);
app.listen(port,()=>{
    console.log('Red Onion Server Started at Port',port);
});