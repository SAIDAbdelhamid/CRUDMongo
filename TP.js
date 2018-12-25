var http = require('http');

var express = require('express');

var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json()); // support json encoded bodies

app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

var MongoClient = require('mongodb').MongoClient;

var url = "mongodb://localhost:27017/";

MongoClient.connect(url,{ useNewUrlParser: true }, function(err, db) {
  if (err) throw err;
  var dbo = db.db("Personne");

var table=[];

app.get('/', function(req, res) {

    dbo.collection("Personnes").find({}).toArray(function(err, result) {
      if (err) throw err;
      table=result;
      res.render('test.ejs',{myArray: result});;
    });

    res.status(200);
});

app.post('/ajouter', function(req, res){
var  PersonJ = {
    Nom : req.body.Nom,
    Prenom : req.body.Prenom,
    Email : req.body.Email
  };

dbo.collection("Personnes").insertOne(PersonJ, function(err, res) {
      if (err) throw err;
      console.log("1 document inserted");
    });

  res.status(200);
  res.redirect('/');
});

app.post('/edit',function(req, res){

  var PersonJS = {
    $set: {
        Nom : req.body.Nom,
        Prenom : req.body.Prenom,
        Email : req.body.Email
      }
  };

  var myQuery={
    Nom : table[req.body.i].Nom,
    Prenom : table[req.body.i].Prenom,
    Email : table[req.body.i].Email
  };

  dbo.collection("Personnes").updateOne(myQuery, PersonJS, function(err, res) {
       if (err) throw err;
       console.log("1 document updated");
     });
  res.status(200);
  res.redirect('/');

});

app.post('/delete',function(req,res){

  var myQuery={
    Nom : table[req.body.i].Nom,
    Prenom : table[req.body.i].Prenom,
    Email : table[req.body.i].Email
  };

  dbo.collection("Personnes").deleteOne(myQuery, function(err, res) {
     if (err) throw err;
     console.log("1 document deleted");
   });

  res.status(200);
  res.redirect('/');

});

//Erreur 404
app.use(function(req, res, next){
    res.setHeader('Content-Type', 'text/plain');
    res.status(404).send('Page introuvable 404 !');
});

});

app.listen(3333);
