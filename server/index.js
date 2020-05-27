'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express()

//Middleware
app.use(bodyParser.json());
app.use(cors());

app.use(function(request, response, next){
    if(request.protocol == 'http'){
      response.redirect("https://" + request.headers.host + request.url);
    }
    next()
  });

const API = require('./routes/api')

app.use('/api', API)


//Handle production
if(process.env.NODE_ENV === 'production'){
    //Static folder
    app.use(express.static(path.join(__dirname + 'public')));
    //Handle SPA
    app.get(/.*/,(req, res) => res.sendFile(path.join(__dirname, 'public/index.html')))
}


const port = process.env.PORT || 5000

// httpsServer.listen(port, ()=>console.log(`Server started on port ${port}`))
app.listen(port, ()=>console.log(`Server started on port ${port}`))
