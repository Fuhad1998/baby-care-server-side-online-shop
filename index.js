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


        app.get('/products', async (req, res)=>{
            const cursor = productCollection.find({});
            const products = await cursor.toArray();
            res.send(products)
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