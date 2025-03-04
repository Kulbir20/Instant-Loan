const express=require('express');
const app=express();
const cors=require('cors');
app.use(cors());
app.use(express.json());
const routes=require('./Routes/index')
const connectDB = require('./Config/dbConnection');


connectDB();

app.use('/api',routes);

const port= process.env.PORT||9000;
app.listen(port,()=>console.log(`Server running on port ${port}`));
