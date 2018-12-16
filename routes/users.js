// users.js handles the inserting and retrieving of information from the database
// (server-side)
"use strict";

const express = require('express');
const router  = express.Router();
const cookie = require('cookie-parser');
const bodyParser = require('body-parser');

module.exports = (knex) => {

  // LOAD ALL RESOURCES FOR HOME PAGE
  router.get("/resources", (req, res) => {
    knex
      .select("*")
      .from("resources")
      .then((resources) => {
        // Prints each result to the terminal console
        resources.forEach((resource) => {
          // console.log(JSON.stringify(resource) + "\n");
        })
        // Sends the resources in JSON format
        res.json(resources);
      })
    })

  // I need to figure out how to pass two different sets of parameters to app.js
  // The resources have been sent successfully, but not the comments


  router.get("/comments", (req, res) => {
    knex 
    .select("*")
    .from("user_comments")
    .then((comments) => {
      comments.forEach((comment) => {
        console.log(JSON.stringify(comment) + "\n");
      })
      res.json(comments);
    });
  });

// REGISTER NEW USER ROUTE
  router.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    console.log(`Name: ${username}, Password: ${password}`);
    knex('users')
    .select('*')
    .where('name', '=', username)
    .then((results) => {
      console.log(`results = ${results}`);
      if (results[0]){
        res.redirect(400, '/register');
      } else {
        return knex('users')
        .insert({
          name: username,
          password: password
        })
        .then(() => {
          res.cookie('username', username).redirect('/')
        })
      }
    })
  });

  // LOGIN USER ROUTE
  router.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    knex('users')
    .select('*')
    .where('name', '=', username)
    .then((exists) => {
      console.log(exists);
      if (exists[0]){
        if (exists[0].password === password){
          res.cookie("username", username);
          res.redirect("/");
        } else {
          res.redirect(400, '/register');
        }
      } else {
        res.redirect(400, '/register');
      }
    })
  })


  // LOGOUT USER
    router.post("/logout", (req, res) => {
      res.clearCookie('username');
      res.redirect("/register");
    })

  // Comment On Resource
  router.post("/comment", (req, res) => {
    const userComment = req.body.commentInput;
    const username = req.cookies.username;
    const resourceId = req.body.resourceId;
    let userId;
    knex('users')
      .select('id')
      .where('name', '=', username)
      .then(function(result){
        userId = result[0].id;
        // console.log("The user's ID is: ", userId);
        return knex('user_comments')
          .insert({
            comment: userComment,
            user_name: username,
            time_created: Date.now(),
            user_id: userId,
            resource_id: resourceId
          })
          .then(() => {
            res.status(201);
          });
        })
      });

  // LIKE ROUTE
  // router.post("like", (req, res) => {
  //   knex('user_comments')
  //     .insert({
  //       comment: comment
  //     })
  //     .then((results) => {
  //       res.redirect("/")
  //     });
  // })

  return router;

}
