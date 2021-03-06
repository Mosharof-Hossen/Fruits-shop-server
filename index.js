const express = require('express')
const bodyParser = require("body-parser")
const cors = require("cors")
const app = express()
require('dotenv').config()

const port = 5000
console.log(process.env.DB_USER)

app.use(bodyParser.urlencoded({ extended: false }))
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
// ************************************************************************get  all product home page
    app.get("/products",(req,res)=>{
      dataCollection.find({})
        .toArray ((err,documents) =>{
            res.send(documents)
        })
      })
// ********************************************************** get checkout product
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

    app.delete("/delete/:name" , (req,res) =>{
      console.log(req.params.name)
      dataCollection.deleteOne({name : req.params.name})
      .then((result)=>{
        console.log(result)
        if(result){
          
        }
      })
    })

    // ****************************************************  insert  data ****************
    app.post("/addProduct", (req,res) =>{
      const product = req.body 
      console.log(product)
      dataCollection.insertOne(product)
      .then(result =>{
        console.log("one product added")
      })
    })

});



app.get('/', (req, res) => {
    res.send('Fresh Food!')
  })

app.listen(process.env.PORT || port)