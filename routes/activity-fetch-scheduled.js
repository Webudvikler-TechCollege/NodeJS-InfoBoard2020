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

        // Dato hell

        // Deklarerer array med skolens skematider
        // Tiderne her er angivet i sekunder fra midnat og 
        // fungerer dermed på alle datoer
        const schedule_hours = [
            { start: 29700, stop: 33599 }, //8:15 - 9:20
            { start: 33600, stop: 37799 }, //9:20 - 10:30
            { start: 37800, stop: 41399 }, //10:30 - 11:30
            { start: 41400, stop: 46799 }, //12:00 - 13:00
            { start: 46800, stop: 50399 }, //13:00 - 14:00
            { start: 50400, stop: 54900 }, //14:00 - 15:15
        ]

        // Henter dags dato og tid
        const date = new Date(); 
        // Konverterer dags datotid til timestamp
        const curtime = ~~(date.getTime()/1000);
        //const curtime = (new Date(date.getFullYear(), date.getMonth(), date.getDate()+1, 11, 30, 0).getTime()/1000);
        // Sætter dags datotid til dagens begyndelse (Kl. 00:00:00)
        const curdate = (new Date(date.getFullYear(), date.getMonth(), date.getDate()+1, 0, 0, 0).getTime()/1000);
        //helpers.time2local(element.daTime);

        // Deklarerer array til aktuel datos skematider
        const curdate_hours = [];

        // Looper skematider
        schedule_hours.forEach(obj => {
            // Sætter skematider på aktuel dato
            curdate_hours.push({
                start: curdate + obj.start, 
                stop: curdate + obj.stop
            });
        });

        // Tjekker om nutid findes i aktuel datos skematider
        const curhour = curdate_hours.filter(obj => obj.start <= curtime && obj.stop >= curtime);

        // Deklarerer temporary array til aktuelle aktiviteter
        let temp_list = [];

        // Hvis nutid er i skematider...
        if(curhour.length) {
            // Filtrer fetch data efter hvilke skematider nutid befinder sig i
            temp_list = await apiResponse.activity.filter(item => item.stamp >= curhour[0].start && item.stamp <= curhour[0].stop);
        } else {

            // Træk første index ud af fetch data
            const firstkey = apiResponse.activity.find(Boolean);
            // Hent data der passer i næstkommende skoledags første skematid (8:15 - 9:20)
            temp_list = await apiResponse.activity.filter(item => item.stamp <= (firstkey.stamp+3899));
            //console.log(temp_list.length);
        }

        // Deklarerer array til endelig liste
        const activity_list = [];

        // Lopper arrayet for at behandle data 
        // fikse titel efter om feltet friendly name
        // er tomt eller ej
        temp_list.forEach(element => {
            console.log(helpers.get_education(element.class));

            // Fikser titel med ternary value
            element.friendly_name = (!element.friendly_name) ? element.name : element.friendly_name;

            // Tilføjer key/values til ny liste
            activity_list.push(element);
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