module.exports = {
    time2local: (stamp) => {
        let date = new Date(stamp * 1000);
        let hours = date.getHours();
        let minutes = date.getMinutes();
        hours = (hours < 10) ? String(hours).padStart(2, "0") : hours;
        minutes = (minutes < 1) ? String(minutes).padStart(2, "0") : minutes;
        return hours + ':' + minutes;    
    }
}