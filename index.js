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


        app.get('/products', async (req, res)=>{
            const cursor = productCollection.find({});
            const products = await cursor.toArray();
            res.send(products)
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

        // app.get('/orders', async (req, res)=>{
            
        //     const cursor = orderCollection.find({});
        //     const orders = await cursor.toArray();
        //     res.send(orders)
        // })


        app.get('/orders', async (req, res)=>{
            const email = req.query.email;
            const query = {email: email}
            console.log(query)
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