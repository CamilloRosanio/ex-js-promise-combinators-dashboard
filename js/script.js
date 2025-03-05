/***********************************************************************
# DASHBOARD DELLA CITTA'
***********************************************************************/

// Per comodità centralizzo le operazioni di fetch tramite questa funzione
async function fetchJson(url) {
    const response = await fetch(url);
    const object = await response.json();
    return object;

}

// EX. + Bonus 1
async function getDashboardDataV1(city) {

    // Utilizzo TRY CATCH per gestire eventuali errori durante le fetch
    try {
        console.log('Caricando la query per:', city)

        // Eseguo le funzioni di fetch centralizzate che ritornano delle PROMISES
        const destinationPromise = fetchJson(`https://boolean-spec-frontend.vercel.app/freetestapi/destinations?search=${city}`);
        const weathersPromise = fetchJson(`https://boolean-spec-frontend.vercel.app/freetestapi/weathers?search=${city}`);
        const airportsPromise = fetchJson(`https://boolean-spec-frontend.vercel.app/freetestapi/airports?search=${city}`);

        // Siccome successivamente devo usare Promise.all, devo creare l'array di Promises che verrà usato come parametro
        const promises = [destinationPromise, weathersPromise, airportsPromise];
        // Tramite DESTRUCTURING, racchiudo in delle variabili i vari objects che ottengo
        const [destinations, weathers, airports] = await Promise.all(promises);

        // Come da consegna esercizio, utilizzo solo i dati del primo elemento nell'array
        const destination = destinations[0];
        const weather = weathers[0];
        const airport = airports[0];

        // Come risultato, ottengo un object completo delle informazioni che volevo
        return {
            // Tramite TERNARY OPERATOR imposto i valori su null qualora non venisse ricevuto alcun valore, così non ottengo alcun errore
            city: destination ? destinations[0].name : null,
            country: destination ? destinations[0].country : null,
            temperature: weather ? weathers[0].temperature : null,
            weather: weather ? weathers[0].weather_description : null,
            airport: airport ? airports[0].name : null,
        }
    } catch (error) {
        throw new Error('Errore durante la fetch:', error.message);
    }
}


// Bonus 2
async function getDashboardData(city) {

    // Uso il TRY CATCH per l'intera operazione
    try {
        console.log('Caricando la query per:', city)

        // Eseguo la funzione fetch centralizzata che ritorna una PROMISE
        const destinationPromise = fetchJson(`https://boolean-spec-frontend.vercel.app/freetestapi/destinations?search=${city}`);
        const weathersPromise = fetchJson(`https://boolean-spec-frontend.vercel.app/freetestapi/weathers?search=${city}`);
        const airportsPromise = fetchJson(`https://boolean-spec-frontend.vercel.app/freetestapi/airports?search=${city}`);

        // Creo il mio array di promises da impiegare nel Promise.allSettled
        const promises = [destinationPromise, weathersPromise, airportsPromise];
        // Tramite DESTRUCTURING come prima racchiudo i risultati di ciascuna promise in una variabile
        const [destinationsResult, weathersResult, airportsResult] = await Promise.allSettled(promises);

        // Dichiaro un object vuoto che utilizzero nel return dell'intera funzione
        const data = {};

        // Gestisco gli errori qualora la fetch fallisse, e in questo caso riesco a proseguire con l'esecuzione del codice successivo
        if (destinationsResult.status === 'rejected') {
            // Se c'è un problema, stampo l'errore in console e assegno null alle due KEYS del mio object
            console.error('Problema in destinations:', destinationsResult.reason)
            data.city = null;
            data.country = null;
        } else {
            // Altrimenti assegno i valori ottenuti alle suddette KEYS
            const destination = destinationsResult.value[0];
            data.city = destination ? destination.name : null;
            data.country = destination ? destination.country : null;
        }

        // Stessa gestione dell'errore per weather
        if (weathersResult.status === 'rejected') {
            console.error('Problema in weathers:', weathersResult.reason)
            data.temperature = null;
            data.weather = null;
        } else {
            const weather = weathersResult.value[0];
            data.temperature = weather ? weather.temperature : null;
            data.weather = weather ? weather.weather_description : null;
        }

        // Stessa gestione dell'errore per airport
        if (airportsResult.status === 'rejected') {
            console.error('Problema in weathers:', airportsResult.reason)
            data.airport = null;
        } else {
            const airport = airportsResult.value[0];
            data.airport = airport ? airport.name : null;
        }

        // Ottengo con return l'object completo di tutte le informazioni (o i null)
        return data;
    } catch (error) {
        // Altrimenti se si verifica un errore, lo stampo in console
        throw new Error('Errore durante la fetch:', error.message);
    }
}

const resultLondon = getDashboardData('london');
console.log(resultLondon);

const resultVienna = getDashboardData('vienna');
console.log(resultVienna);
