const fetch = require('node-fetch');
const express = require('express');
const moment = require('moment');

// Kalder Express' route system 
const router = express.Router();

// Henter fil med hjælpefunktioner
// Node's pendant til at have hjælpefunktioner
// i en seperat fil
const helpers = require('../helpers.js');

// Alle routes i denne fil får en prepended sti 
// når de bliver importeret i app.js
// Nedenstående route bliver derfor til => "/fetch/list" f.eks.
router.get("/list", async (req, res) => {
    
    try {
        // Fetcher vores API. Bruger async/await til dette og 
        // dermed slipper vi for then problematikken
        const requestToApi = await fetch('https://infoboard.mediehuset.net/api/api-test.php');

        // Tjekker om alt er gået godt - hvis ikke bliver fejlen fanget i 
        // catch scopet nedenunder
        if(! await requestToApi.ok) throw new Error('Forkert svar fra server')
        
        // Kalder svar som json format
        const apiResponse = await requestToApi.json();

        // Dato hell
        const todayStop = moment().set({hour:23,minute:59,second:59});
        const todayStamp = ~~(todayStop.format("x")/1000);    
        let activity_list = await apiResponse.activity.filter(activity => activity.stamp < todayStamp);

        if(!activity_list.length) {
            const nextDayStop = moment.unix(apiResponse.activity[0].stamp).set({hour:23,minute:59,second:59});
            activity_list = await apiResponse.activity.filter(activity => activity.stamp < nextDayStop);
        }

        // Lopper arrayet for at behandle data 
        // fikse titel efter om feltet friendly name
        // er tomt eller ej
        activity_list.forEach(element => {

            // Fikser titel med ternary value
            element.friendly_name = (!element.friendly_name) ? element.name : element.friendly_name;
            // Henter uddannelsesinfo ud fra holdnavn
            element.info = helpers.get_education(element.class);
            element.date = moment.unix(element.stamp).date();
        });

        // Renderer titel, content og aktivitets liste til ejs view
        return res.render('pages/list', {
            title: "Aktiviteter",
            content: "",
            activity_list
        })

    } catch (error) {
        // Man kan lave seje fejl meddelelser når man bruger try/catch
        console.log("TCL: error", error)

        // Renderer fejl side
        return res.render('pages/error', {
            title: "FEJL: Sangliste",

            // Det her kan godt være farligt i production, 
            // for den kan godt sladre lidt om intern server setup.
            // I production vil man bruge sin egen fejlhåndterings funktion
            content: "Der skete følgende fejl under fetch af listen med sange: " + error.message,
        })
        
    }   
});

module.exports = router;