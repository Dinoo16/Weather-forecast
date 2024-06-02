const express = require('express')
const app = express()
const path = require('path')
const handlebars = require('express-handlebars')
port = 3000;

//Template engine
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', function (req, res) {
  res.render('layouts/main');
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))