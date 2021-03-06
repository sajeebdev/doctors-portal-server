const express = require('express')
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;


//middle wear
app.use(cors());
app.use(express.json());
//
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cm5be.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
try{
    await client.connect();
    const servicesCollection = client.db("doctors_portal").collection("services");
    const bookingCollection = client.db("doctors_portal").collection("booking");
   //find 
   app.get('/service',async(req,res)=>{
       const query = {};
       const cursor = servicesCollection.find(query);
       const service = await cursor.toArray();
       res.send(service);
   })

  //  booking
  app.post('/booking',async(req,res)=>{
    const booking = req.body;
    const query = {treatment: booking.treatment ,date:booking.date, patient:booking.patient}
    const exists = await bookingCollection.findOne(query);
    if(exists){
      return res.send({success:false,booking:exists})
    }
    const result = await bookingCollection.insertOne(booking);
    res.send({success:true, result});
  })
  // 
  app.get('/booking',async (req,res)=>{
    const patient = req.query.patient;
    const query ={patient:patient}
    const booking = await bookingCollection.find(query).toArray();
    res.send(booking);
  })
  

}
finally{

}
}
run().catch(console.dir);
app.get('/', (req, res) => {
  res.send('Hello doctors-portal')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})