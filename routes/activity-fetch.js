const fetch = require('node-fetch');
const express = require('express');

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
        const requestToApi = await fetch('https://infoboard.mediehuset.net/api/');

        // Tjekker om alt er gået godt - hvis ikke bliver fejlen fanget i 
        // catch scopet nedenunder
        if(! await requestToApi.ok) throw new Error('Forkert svar fra server')
        
        // Kalder svar som json format
        const apiResponse = await requestToApi.json();

        // Dato fix - henter i dags begyndelse (00:00:00)
        const curtime = new Date();
        const curdaystart = (new Date(curtime.getFullYear(), curtime.getMonth(), 
                                        curtime.getDate()+1, 8, 50, 0).getTime()/1000);

        // Bruger array.filter til at afgrænse resultatet 
        // til kun at medtage aktiviteter indenfor den kommende uge
        //const rawlist = apiResponse.activity.filter(key => key.daTime > curtime && key.daTime < (curtime + 604800));
        let first = apiResponse.activity.find(Boolean);
        const rawlist = apiResponse.activity.filter(arr => arr.time == first.time);

        // Deklarerer nyt array til liste
        const list = [];

        // Lopper arrayet for at behandle data 
        // fikse titel efter om feltet friendly name
        // er tomt eller ej
        rawlist.forEach(element => {
            // Fikser titel...
            element.friendly_name = (!element.friendly_name) ? element.name : element.friendly_name;

            // Hacky måde at begrænse udtrækket på
            if(list.length < 20) {
                // Tilføjer key/values til ny liste
                list.push(element);
            }
        });

        // Hvis man laver explicit return i sin express app
        // er man 100% sikker på at der ikke køres kode efter.
        // Problemet viser sig hvis der er mange forskellige 
        // svar muligheder for en enkelt route (baseret på bruger input eller whatever)
        return res.render('pages/list', {
            title: "Aktiviteter",
            content: "",
            list
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