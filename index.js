const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId;
const app = express();
const port = process.env.PORT || 5000;



app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u15fw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run (){
    try{
        await client.connect();
        const database = client.db('baby-care-online-shope')
        const productCollection = database.collection('products')
        const orderCollection = database.collection('orders');
        const reviewCollection = database.collection('reviews');
        const userCollection = database.collection('users');


        app.get('/products', async (req, res)=>{
            const category = req.query.category;
            let query 
            if (category){
                query = {category}
            }
            else{
                query={}
            }
            const cursor = productCollection.find(query);
            // console.log(query)
            const orders = await cursor.toArray();
            res.send(orders)
            // console.log(orders)
        })


        app.post('/products', async(req, res)=>{
            const products = req.body;
            const result = await productCollection.insertOne(products);
            res.json(result)
        })






        app.post('/orders', async(req, res)=>{
            const orders = req.body;
            orders.createdAt = new Date()
            const result = await orderCollection.insertOne(orders);
            res.json(result)
        })



        app.get('/orders', async (req, res)=>{
            const email = req.query.email;
            let query 
            if (email){
                query = {email}
            }
            else{
                query={}
            }
            const cursor = orderCollection.find(query);
            const orders = await cursor.toArray();
            res.send(orders)
        })




        app.post('/reviews', async(req, res)=>{
            const reviews = req.body;
            const result = await reviewCollection.insertOne(reviews);
            res.json(result)
        })


        // Get reviews

        app.get('/reviews', async (req, res)=>{
            const cursor = reviewCollection.find({});
            const reviews = await cursor.toArray();
            res.send(reviews)
        })

        // post users

        app.post('/users', async(req, res)=>{
            const users = req.body;
            const result = await userCollection.insertOne(users)
            
            res.json(result)
        })

        app.put('/users', async(req, res)=>{
            const user = req.body;
            const filter = {email: user.email}
            const options = {upsert: true}
            const updateDoc = {$set: user}
            const result = await userCollection.updateOne(filter, updateDoc, options)
            res.json(result)
        })



        app.put('/users/admin', async (req, res) =>{
            const user = req.body;
            const filter = {email: user.email}
            const updateDoc ={$set: {role: 'admin'}}
            const result = await userCollection.updateOne(filter, updateDoc)
            res.json(result)
        })



        app.get('/users/:email', async(req, res)=>{
            const email = req.params.email;
            const query = {email: email}
            const user = await userCollection.findOne(query)
            let isAdmin = false;
            if(user?.role === 'admin'){
                isAdmin= true;
            }
            res.json({admin: isAdmin})
        })



    }
    finally{
        // await client.close()
    }
}
run().catch(console.dir)





app.get('/', (req, res)=>{
    res.send('baby care server is running')
})

// add  somthing


app.listen(port, ()=>{
    console.log('server running at port', port)
})