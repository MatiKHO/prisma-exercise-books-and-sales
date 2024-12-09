const express = require("express");
const app = express();
const PORT = 3000;

const morgan = require("morgan");
const router = require('./routes');


app.use(morgan('dev'));
app.use(express.json());


app.use('/', router);

app.get('/', (req, res) => {
  res.send("Servidor funcionando");
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});



