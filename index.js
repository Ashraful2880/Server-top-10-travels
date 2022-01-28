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
        const users = database.collection("userCollections");

        //<------------ Get All Blogs ------------->

        app.get('/blog',async(req,res)=>{
          const getBlogs=await blogs.find({}).toArray();
          res.send(getBlogs)
        }); 
        
          //<------------ Find Blog Details ------------->

          app.get('/details/:id',async(req,res)=>{
            const id=req.params.id;
            const query={_id:ObjectId(id)};
            const getBlog=await blogs.findOne(query);
            res.json(getBlog);          
          });

        //<--------------- Send register User info to Database----------------->

        app.post('/users', async(req,res)=>{
          const newUsers=req.body;
          const result=await users.insertOne(newUsers);
          res.json(result);
        });

         //<--------------- Update Google Sign User info to Database----------------->

         app.put('/users', async(req,res)=>{
          const newUser=req.body;
          const filter={email:newUser.email}
          const options={upsert: true};
          const updateUser={$set:newUser}
          const result=await users.updateOne(filter,updateUser,options);
          res.json(result);
        }); 

        //<--------------- Update Admin Role to Database----------------->

        app.put('/users/admin', async(req,res)=>{
          const user=req.body;
          const filter={email:user.email}
          const updateAdmin={$set:{role:'admin'}}
          const result=await users.updateOne(filter,updateAdmin);
          res.json(result);
        }); 

         //<------------ Get Admin Data From Database ------------->

         app.get('/user/:email',async(req,res)=>{
          const email=req.params.email;
          const query={email:email};
         const getAdmin=await users.findOne(query);
         let isAdmin=false
         if(getAdmin?.role === 'admin'){
           isAdmin=true;
         }
         res.json({admin:isAdmin})
       }); 

 /* //<------------ Post a Blog ------------->

       app.post('/postBlog',async(req,res)=>{
        const name=req.body.name;
        const rating=req.body.rating;
        const comment=req.body.comment;
        const pic=req.files.profile;
        const picData=pic.data;
        const encodedPic=picData.toString('base64');
        const imageBuffer=Buffer.from(encodedPic,'base64');
        const newBlog={
          name,
          comment,
          start:rating,
          url:imageBuffer
        }
        const result=await blogs.insertOne(newBlog);
        res.json("result"); 
      }) */

 //<------------ Delete a Blog From DB By Admin ------------>

  app.delete('/deleteBlog/:id',async(req,res)=>{
    const id=req.params.id;
    const query={_id:ObjectId(id)}
    const remove=await blogs.deleteOne(query);
    console.log(remove);
    res.json("remove")
  });






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