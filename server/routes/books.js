/*
  Name: Jonathan Lee #822937603
  File Name: books.js
  Website Name: https://comp308-2017-midterm-822937603.herokuapp.com/
  Description: books routing for the views
*/

// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

// define the book model
let book = require('../models/books');

/* GET books List page. READ */
router.get('/', (req, res, next) => {
  // find all books in the books collection
  book.find( (err, books) => {
    if (err) {
      return console.error(err);
    }
    else {
      res.render('books/index', {
        title: 'Books',
        books: books
      });
    }
  });

});

//  GET the Book Details page in order to add a new Book
router.get('/add', (req, res, next) => {
      res.render('books/details', {
    title: "Add a new book",
    books: ''
  });
});

// POST process the Book Details page and create a new Book - CREATE
router.post('/add', (req, res, next) => {

let newBook = book({

      "Title": req.body.title,
      "Desciption" : req.body.desciption,
      "Price": req.body.price,
      "Author": req.body.author,
      "Genre": req.body.genre
    });

    book.create(newBook, (err, book) => {
      if(err) {
        console.log(err);
        res.end(err);
      } else {
        res.redirect('/books');
      }
    });

});

// GET the Book Details page in order to edit an existing Book
router.get('/:id', (req, res, next) => {

    let id = req.params.id;

    book.findById(id, (err, book) => {
      if(err) {
        console.log(err);
        res.end(error);
      } else {
        // show the book details view
        res.render('books/details', {
            title: 'Books Details',
            books: book
        });
      }
    });
 
});

// POST - process the information passed from the details form and update the document
router.post('/:id', (req, res, next) => {

 let id = req.params.id;

     let updatedBook = book({
      "_id": id,
      "Title": req.body.title,
      "Desciption" : req.body.desciption,
      "Price": req.body.price,
      "Author": req.body.author,
      "Genre": req.body.genre
    });

    book.update({_id: id}, updatedBook, (err) => {
      if(err) {
        console.log(err);
        res.end(err);
      } else {
        // refresh the book List
        res.redirect('/books');
      }
    });

});

// GET - process the delete by user id
router.get('/delete/:id', (req, res, next) => {
 let id = req.params.id;

    book.remove({_id: id}, (err) => {
      if(err){
        console.log(err);
        res.end(err);
      } else{
        //refresh games list
        res.redirect('/books');
      }
    });

});


module.exports = router;
