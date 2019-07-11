const express = require("express");
const morgan = require("morgan");

const app = express();
app.use(morgan("common"));

app.listen(8080, () => {
  console.log("EXPRESS server is listening on localhost 8080");
});

// ----- DRILL 1 -----

app.get("/sum", (req, res) => {
  const a = req.query.a;
  const b = req.query.b;

  // validation
  if (!a) {
    return res.status(400).send("Need value for a");
  }
  if (!b) {
    return res.status(400).send("Need value for b");
  }

  const numA = parseFloat(a);
  const numB = parseFloat(b);

  if (Number.isNaN(numA)) {
    return res.status(400).send("a must be a number");
  }
  if (Number.isNaN(numB)) {
    return res.status(400).send("b must be a number");
  }

  // validation passed, so perform the task
  const c = numA + numB;

  // format the response string
  const responseString = `The sum of ${numA} and ${numB} is ${c}!`;

  // send the response
  res.status(200).send(responseString);
});

// ----- DRILL 2 -----

app.get("/cipher", (req, res) => {
  const { text, shift } = req.query;

  // ++validation -- require both queries, and shift must be a number
  if (!text) {
    return res.status(400).send("must enter text in orer to cipher");
  }
  if (!shift) {
    return res.status(400).send("Must include shift in order to cipher!");
  }

  const numShift = parseFloat(shift);

  if (Number.isNaN(numShift)) {
    return res.status(400).send("shift must be a number");
  }

  // ++Validation complete-- perform the task

  // Make the text uppercase for convenience
  // create a loop over the characters
  // For each letter, convert using the shift
  const base = "A".charCodeAt(0);
  const cipher = text
    .toUpperCase()
    .split("") // create an array of characters
    .map(char => {
      //map each original char to a converted char
      const code = char.charCodeAt(0); //get the char code

      //if it is not one of the 26 letters, ignore it
      if (code < base || code > base + 26) {
        return char;
      }

      // otherwise convert it
      // get the distance from A
      let diff = code - base;
      diff = diff + numShift;

      // in case shift takes the value past Z, cycle back to the beginning
      diff = diff % 26;

      // convert back to a character
      const shiftedChar = String.fromCharCode(base + diff);
      return shiftedChar;
    })
    .join(""); //construct a string from the array

  // ++Return the response
  res.status(200).send(cipher);
});

// ----- DRILL 3 -----

app.get("/lotto", (req, res) => {
  const { numbers } = req.query;

  // ++Validation:

  // 1. the numbers array must exist
  // 2. must be an array
  // 3. must be 6 numbers
  // 4. numbers must be between 1 and 20

  if (!numbers) {
    return res.status(400).send("numbers is required");
  }
  if (!Array.isArray(numbers)) {
    return res.status(400).send("numbers must be an array");
  }

  const guesses = numbers
    .map(n => parseInt(n))
    .filter(n => !Number.isNaN(n) && (n >= 1 && n <= 20));

  if (guesses.length != 6) {
    return res
      .status(400)
      .send("numbers must contain 6 integers between 1 and 20");
  }

  // ++fully validated numbers

  // here are the 20 numbers to choose from
  const stockNumbers = Array(20)
    .fill(1)
    .map((_, i) => i + 1);

  // randomly choose 6
  const winningNumbers = [];
  for (let i = 0; i < 6; i++) {
    const ran = Math.floor(Math.random() * stockNumbers.length);
    winningNumbers.push(stockNumbers[ran]);
    stockNumbers.splice(ran, 1);
  }

  // compare the guesses to the winning number
  let diff = winningNumbers.filter(n => !guesses.includes(n));

  // ++construct a response
  let responseText;

  switch (diff.length) {
    case 0:
      responseText = "Wow! Unbelievable! You could have won the megamillions!";
      break;
    case 1:
      responseText = "Congratulations! You win $100!";
      break;
    case 2:
      responseText = "Congratulations! You win a free ticket!";
      break;
    default:
      responseText = "Sorry! You lose!";
  }

  res.json({
    guesses,
    winningNumbers,
    diff,
    responseText
  });

  res.send(responseText);
});
