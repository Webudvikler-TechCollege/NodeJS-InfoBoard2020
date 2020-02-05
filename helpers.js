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
                   
        switch(education) {
            default:
                return {
                    name: "ANdet",
                    inits: "std",
                    classname: classname
                }
                break;
            case "WU":
                //console.log(education);
                //console.log(classname);
                return {
                    name: "Webudvikler",
                    inits: "wu",
                    classname: classname
                }
                break;
            case "DM":
                return {
                    name: "Digital Media",
                    inits: "dm",
                    classname: classname
                }
                break;
            case "MG":
                return {
                    name: "Mediegrafiker",
                    inits: "mg",
                    classname: classname
                }
                break;
            case "GT":
                return {
                    name: "Grafisk Tekniker",
                    inits: "gt",
                    classname: classname
                }
                break;
        }
    },

    get_room_array: () => {
        return [
            'N112',
            'N112b',
            'N120',
            'N121',
            'N122',
            'N214',
            'N215',
            'N215a',
            'N219',
            'N221',
            'N223',
            'N225',
            'N226',
            'N228',
            'N230'    
        ]
    }
}