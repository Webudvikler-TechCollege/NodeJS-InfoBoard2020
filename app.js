const express = require('express');
const app = express();
const logger = require('morgan');

// Lækker logning af alle request og response til og fra server.
app.use(logger('dev'))

// Sørger for at vi kan læse post variabler
app.use(express.urlencoded({extended:true}));

// Opsætter EJS. Del kun nødvendige mapper med det store internet.
app.use('/assets', express.static('assets'))
app.set('views', 'views');
app.set('view engine', 'ejs');

//Sætter port
const port = 4242;

// Ny måde at bruge routes på. Routes lægges stadig i mappen 
// men hentes ind på denne måde. I app.use metoden angives stien 
// til den pågældende route - Eks: http://localhost:4242/fetch/
const activityFetch = require('./routes/activity-fetch');
app.use("/fetch", activityFetch)

// Siden middleware køres synkront (i rækkefølge) laves 
// error handling som noget af det sidste så fejl som appen
// ikke kan klare bliver fanget her. 
const errorRoute = require('./error-handling/routing');
app.use(errorRoute)

//Angiver port der skal lyttes på
app.listen(port, () => {
    // Skriv hele server adressen. Så kan man klikke på linket i konsollen.
    console.log(`Express server kører på http://localhost:${port}`);
});