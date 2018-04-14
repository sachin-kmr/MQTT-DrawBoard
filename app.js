const express = require('express')
const app = express()

app.use(express.static("."));

app.get('/', function(req, res){
    res.send(__dirname + '/index.html')
})

app.listen(5000, ()=>console.log("Server started at 5000"))