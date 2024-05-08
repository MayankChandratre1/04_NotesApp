const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  fs.readdir(`./files`, (err, files) => {
    res.render("index", { files: files });
  });
});

app.post("/save", (req, res) => {
  const title = req.body.title
    .split(" ")
    .map((element) => {
      return element.charAt(0).toUpperCase() + element.slice(1);
    })
    .join("");

  fs.writeFile(`./files/${title}.txt`, req.body.data, (err) => {
    if (err) {
      res.redirect("/error");
    }
    res.redirect("/");
  });
});

app.get("/file/:filename", (req, res) => {
  const filename = req.params.filename;
  fs.readFile(`./files/${filename}`, "utf-8", (err, data) => {
    if (err) {
      res.redirect("/error");
    }
    res.render("file", {
      title: filename,
      data: data,
    });
  });
});

app.get("/delete/:name", (req, res) => {
  fs.unlink(`./files/${req.params.name}`, (err) => {
    if (err) {
      res.redirect("/error");
    }
    res.redirect("/");
  });
});

app.get("/error", (req, res) => {
  res.render("error");
});

app.listen(3000, (err, res) => {
  console.log("listening");
});
