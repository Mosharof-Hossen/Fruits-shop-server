const express = require('express')
const bodyParser = require("body-parser")
const cors = require("cors")
const app = express()
require('dotenv').config()

const port = 5000
console.log(process.env.DB_USER)

app.use(bodyParser.json())
app.use(cors())



const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bd9js.mongodb.net/freshFruitStore?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const dataCollection = client.db("freshFruitStore").collection("products");
  const selectedCollection = client.db("freshFruitStore").collection("selectedProduct");
  console.log("databas")

//   **********************************************************************post*****************
    // app.post("/addProduct" ,(req,res) =>{
    //     const product =req.body
    //     console.log(product)
    //     collection.insertMany(product)
    //     .then(result =>{
    //         console.log(result.insertedCount)
    //         res.send(result.insertedCount)
    //     })
    // })
// ************************************************************************get
    app.get("/products",(req,res)=>{
      dataCollection.find({})
        .toArray ((err,documents) =>{
            res.send(documents)
        })
      })

      app.get("/products/:key",(req,res)=>{
        console.log(req.params.key)
        dataCollection.find({name : req.params.key})
        .toArray ((err,documents) =>{
            res.send(documents)
        })
      })
      // ************************************************** single add product 

      app.post("/addSingleProduct" , (req,res) => {
        const productOne = req.body
        console.log(productOne)
        selectedCollection.insertOne(productOne)
        //   productsCollection.insertMany(product)
        .then(result =>{
            console.log(result)
            // console.log(result.insertedCount)
            res.send(result.insertedCount)
        })
    })


    app.get("/bookings" , (req,res) =>{
        selectedCollection.find({email : req.query.email})
        .toArray ((err,documents) =>{
            res.send(documents)
        })
    })

    // ****************************************************** delete item********************

    app.delete("/delete/:id" , (req,res) =>{
      console.log(req.params.id)
      selectedCollection.deleteOne({_id : req.params.id})
      .then((result)=>{
        console.log(result)
        if(result){
          
        }
      })
    })

});



app.get('/', (req, res) => {
    res.send('Fresh Food!')
  })

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })