'use strict';

var express = require('express'),
    cons = require('consolidate'),
    url = require('url'),
    app = express(),
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    shuffle = require('shuffle'),
    port = 9000;


// Set templating Engine and Stylesheet Directory
app.engine( 'html', cons.swig );
app.set( 'view engine', 'html' );
app.set( 'views', __dirname + '/views' );
app.use( express.static( __dirname + '/public' ));


// Set up the mongoDB connection info
var mongoclient = new MongoClient( new Server( 'localhost', 27017, { 'native_parser': true } ));
var db = mongoclient.db( 'quoteBase' );


// Main Route
app.get( '/', function( req, res ){
  db.collection( 'smartFolks' ).find( {}, function( err, cursor ){
    cursor.toArray( function( err, docs ){
      var smartFolks = shuffle.shuffle(docs);
      res.render('main', { 'smartFolks' : smartFolks, 'count' : smartFolks.length } );
    });
  });
});


// Quote Route
app.get( '/quote/*', function( req, res ){
  
  var folkTag = url.parse( req.url).pathname.split('/')[2];

  db.collection( 'smartFolks' ).findOne( { 'tag' : folkTag }, function( err, doc ){
    res.render('quote', { 'author' : doc } );
  });
});

// Connect to the DB and start the server
mongoclient.open( function( err, mongoclient ){

  if( err ) {
    throw err;
  }
  app.listen( port );
  console.log( 'Server Listening on ' + port );
});

