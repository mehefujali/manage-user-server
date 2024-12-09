const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { green, log, cyan } = require('console-log-colors');
const port = process.env.PORT || 8080
const app = express()

//MW 

app.use(cors())
app.use(express.json())

const uri = "mongodb://localhost:27017"

const client = new MongoClient(uri, {
      serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
      }
});



async function run() {
      try {
            const database = client.db("user-db")
            const userCollection = database.collection("users")

            app.post('/users', async (req, res) => {

                  const user = req.body
                  const result = await userCollection.insertOne(user)
                  res.send(result)


            })
            app.get("/users", async (req,res) => {
                  const users = await userCollection.find().toArray()
                  res.send(users)
            })
            app.get("/user/:id", async (req,res) => {
                  const id = req.params.id
                  const qur = {_id : new ObjectId(id)}
                  const users = await userCollection.findOne(qur)
                  res.send(users)
            })
            app.delete("/users/:id" , async (req,res) => {
                  const id = req.params.id
                  const qur = {_id : new ObjectId(id)}
                  const result = await userCollection.deleteOne(qur)
                  res.send(result)
            })
            app.put("/updateusers/:id" , async(req ,res) => {
                  const id = req.params.id 
                  const user = req.body 
                  const options = { upsert: true };
                  const updateData = {
                        $set : {
                              name : user.name ,
                              email : user.email ,
                              photo: user.photo ,
                              gnder : user.gnder ,
                              status : user.status
                        }
                  }
                  const qur = {_id : new ObjectId(id)}
                  const result = await userCollection.updateOne( qur , updateData , options)
                  res.send(result)
            })
          




            console.log(green("Pinged your deployment. You successfully connected to MongoDB!"));

      }
      catch {

      }
}

run().catch(console.dir);


app.get('/', (req, res) => {

      try {
            res.send({
                  status: true
            })
      }
      catch {
            res.send({ status: false })
      }
})

app.listen(port, () => {
      console.log(cyan.bold("Surver is running on"),port);

})