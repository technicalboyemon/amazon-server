const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
const { MongoClient } = require("mongodb");
require("dotenv").config();

app.use(cors());
app.use(express.json());

// DB_USER=ema_John_DB
// DB_PASS=bHT610I3XkyBznFX

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uana9.mongodb.net/emaJhonDB?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const productDB = client.db("emaJhonDB");
    const productCollection = productDB.collection("products");
    const orderCollection = productDB.collection("orders")
    // GET PRODUCT API
    app.get("/products", async (req, res) => {
      const cursor = productCollection.find({});
      const page = req.query.page;
      const size = parseInt(req.query.size);
      let products;
      const count = await cursor.count();
      if (page) {
        products = await cursor
          .skip(page * size)
          .limit(size)
          .toArray();
      } else {
        await cursor.toArray();
      }

      res.send({
        count,
        products,
      });
    });

    // POST TO GET API
    app.post("/products/bykeys", async (req, res) => {
      const keys = req.body;
      const query = { key: { $in: keys } };
      const products = await productCollection.find(query).toArray();
      res.send(products);
    });
    // Orders API
    app.post('/orders', async(req,res)=>{
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.send(result);
    })
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hey Ema Jhon");
});

app.listen(port, () => {
  console.log("Port", port);
});
