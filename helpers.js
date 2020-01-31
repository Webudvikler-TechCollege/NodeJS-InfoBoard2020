/**
 * Fil med hjælpe funktioner module.exports er 
 * Node's måde at gøre funktionerne i filen 
 * tilgængelige i de filer som inkluderer 
 * denne fil.
 * Læs mere: https://www.tutorialsteacher.com/nodejs/nodejs-module-exports
 */
module.exports = {

    // Funktion til at konvertere timestamps til timer:minutter.
    // Funktionen anvender javascripts Date API.
    // Læs mere: https://www.w3schools.com/jsref/jsref_obj_date.asp
    // Eks: 08:15
    stamp2time: (stamp) => {
        let date = new Date(stamp * 1000); //Konverterer unix timestamp til js timestamp
        let hours = date.getHours(); //Henter timer
        let minutes = date.getMinutes(); //Henter minutter
        hours = (hours < 10) ? String(hours).padStart(2, "0") : hours; //Sætter 0 foran hvis < 9
        minutes = (minutes < 10) ? String(minutes).padStart(2, "0") : minutes; //Sætter 0 foran hvis < 9
        return hours + ':' + minutes; //Returnerer format
    }
}