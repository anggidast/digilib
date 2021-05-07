const express = require('express');
const app = express();
const routes = require('./routes/routes');
const PORT = process.env.PORT || 3000;
const dateParse = require('./helpers/dataParse');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use('/', routes);
app.locals.dateParse = dateParse;

app.listen(PORT, () => console.log('listening to ', PORT));