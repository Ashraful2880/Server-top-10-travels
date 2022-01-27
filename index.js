const express=require('express');
const { MongoClient } = require('mongodb');
const ObjectId=require('mongodb').ObjectId;
require('dotenv').config();
const app=express();
const port=process.env.PORT || 5000;
const cors=require('cors');

app.use(cors());
app.use(express.json());


//<------------- Database Code Here ---------->

    const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pxp8q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    
    async function run() {
      try {
        await client.connect();

        //<------------ Database All Collections ------------->
        const database = client.db("top-10-travels");
        const blogs = database.collection("blogCollections");
  

        //<------------ Get All Products ------------->

        app.get('/blog',async(req,res)=>{
          const getBlogs=await blogs.find({}).toArray();
          res.send(getBlogs)
        }); 
        
          //<------------ Find Products Information For Cart ------------->

          app.get('/details/:id',async(req,res)=>{
            const id=req.params.id;
            const query={_id:ObjectId(id)};
            const getBlog=await blogs.findOne(query);
            res.json(getBlog);          
          });

        //<------------ Get All Blogs ------------->

      } finally {
        // await client.close();
      }
    }
    run().catch(console.dir);
    
    app.get('/',(req,res)=>{
      res.send('Running Top-10-Travels')
    });


app.listen(port,()=>{
    console.log("Running Server Port is",port);
});