const express = require("express");
const morgan = require("morgan");

const app = express();
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Hello Express!");
});

app.listen(8000, () => {
  console.log("Express server is listening on port 8000");
});

app.get("/burgers", (req, res) => {
  res.send("We have juicy cheeseburgers!");
});

app.get("/pizza/pepperoni", (req, res) => {
  res.send("Your pizza is on the way!");
});

app.get("/pizza/pineapple", (req, res) => {
  res.send("We dont't serve that here! Never call again!");
});

app.get("/queryViewer", (req, res) => {
  console.log(req.query);
  res.end();
});

app.get("/echo", (req, res) => {
  const responseText = `Here are some details of your request:
        Base URL: ${req.baseUrl}
        Host: ${req.hostname}
        Path: ${req.path}
        Body: ${req.body}
        Cookies: ${req.cookies}
        Method: ${req.method}
    `;
  res.send(responseText);
});

app.get("/greetings", (req, res) => {
  // 1. get the values from request
  const name = req.query.name;
  const race = req.query.race;

  // 2. validate the values
  if (!name) {
    // 3. name was not provided
    return res.status(400).send("Please provide a name");
  }
  if (!race) {
    // 3. race was not provided
    return res.status(400).send("Please provide a race");
  }

  // 4. and 5. both name and race are valid, so continue with processing
  const greeting = `Greetings, ${name} the ${race}! Welcome to our kingdom!`;

  res.send(greeting);
});
