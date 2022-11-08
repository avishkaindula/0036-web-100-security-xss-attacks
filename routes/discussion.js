const express = require("express");

const xss = require("xss");

const db = require("../data/database");

const router = express.Router();

router.get("/", function (req, res) {
  res.redirect("/discussion");
});

router.get("/discussion", async function (req, res) {
  const comments = await db.getDb().collection("comments").find().toArray();
  res.render("discussion", { comments: comments });
});

router.post("/discussion/comment", async function (req, res) {
  const comment = {
    text: xss(req.body.comment),
    // This will now sanitize the user input data. Therefor, even if the user input data
    // has malicious code, this will sanitize it and therefor users can't inject malicious 
    // xss scripts to our back-end via text input fields. Result will be set as follows.
    // &lt;script&gt; alert("Hacked!"); &lt;/script&gt;
    // &lt; means < sign.
    // &gt means > sign.
    // We typically don't do both sanitization and <%=
    // Instead we use sanitization only when we really want to use <%- instead of <%= to
    // input user generated data.
    // express-validator package is a great alternative for this package.
    // It can also validate user input data based on a middleware and check whether the data 
    // that was input by the user is the one we're expecting of them. We can also sanitize the input
    // by using this package.
  };

  await db.getDb().collection("comments").insertOne(comment);

  res.redirect("/discussion");
});

module.exports = router;
