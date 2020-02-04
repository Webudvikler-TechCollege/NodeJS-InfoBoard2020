/**
 * Fil med hjælpe funktioner module.exports er 
 * Node's måde at gøre funktionerne i filen 
 * tilgængelige i de filer som inkluderer 
 * denne fil.
 * Læs mere: https://www.tutorialsteacher.com/nodejs/nodejs-module-exports
 */
module.exports = {

    // Returnerer uddannelses inititaler ud fra hold navn
    get_education: (classname) => {
        let education = (classname.search("we") > 0) ? "WU" :
                            (classname.search("dm") > 0) ? "DM" : 
                                (classname.search("mg") > 0) ? "MG" :
                                    (classname.search("gr") > 0) ? "GT" : ""
        return education;
    }
}