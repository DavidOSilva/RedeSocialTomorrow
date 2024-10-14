const hbs = require('hbs')

hbs.registerHelper('formatId', function (id) {
    return String(id).padStart(3, '0');
});

hbs.registerHelper('timeSince', function (date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval;

    if (seconds < 60) {
        return seconds <= 1 ? "agora" : seconds + " segundos";
    }

    interval = Math.floor(seconds / 60);
    if (interval === 1) return "há 1 minuto";
    if (interval < 60) return "há " + interval + " minutos";

    interval = Math.floor(interval / 60);
    if (interval === 1) return "há 1 hora";
    if (interval < 24) return "há " + interval + " horas";

    interval = Math.floor(interval / 24);
    if (interval === 1) return "há 1 dia";
    if (interval < 30) return "há " + interval + " dias";

    interval = Math.floor(interval / 30);
    if (interval === 1) return "há 1 mês";
    if (interval < 12) return "há " + interval + " meses";

    interval = Math.floor(interval / 12);
    return interval === 1 ? "há 1 ano" : "há " + interval + " anos";
});