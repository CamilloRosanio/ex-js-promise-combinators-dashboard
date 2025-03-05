/***********************************************************************
# DASHBOARD DELLA CITTA'
***********************************************************************/

async function fetchJson(url) {
    const response = await fetch(url);
    const object = await response.json();
    return object;

}

// EX. + Bonus 1
// async function getDashboardData(city) {

//     try {
//         console.log('Caricando la query per:', city)
//         const destinationPromise = fetchJson(`https://boolean-spec-frontend.vercel.app/freetestapi/destinations?search=${city}`);
//         const weathersPromise = fetchJson(`https://boolean-spec-frontend.vercel.app/freetestapi/weathers?search=${city}`);
//         const airportsPromise = fetchJson(`https://boolean-spec-frontend.vercel.app/freetestapi/airports?search=${city}`);

//         const promises = [destinationPromise, weathersPromise, airportsPromise];
//         const [destinations, weathers, airports] = await Promise.all(promises);

//         const destination = destinations[0];
//         const weather = weathers[0];
//         const airport = airports[0];

//         return {
//             city: destination ? destinations[0].name : null,
//             country: destination ? destinations[0].country : null,
//             temperature: weather ? weathers[0].temperature : null,
//             weather: weather ? weathers[0].weather_description : null,
//             airport: airport ? airports[0].name : null,
//         }
//     } catch (error) {
//         throw new Error('Errore durante la fetch:', error.message);
//     }
// }


// Bonus 2
async function getDashboardData(city) {

    try {
        console.log('Caricando la query per:', city)
        const destinationPromise = fetchJson(`https://boolean-spec-frontend.vercel.app/freetestapi/destinations?search=${city}`);
        const weathersPromise = fetchJson(`https://boolean-spec-frontend.vercel.app/freetestapi/weathers?search=${city}`);
        const airportsPromise = fetchJson(`https://boolean-spec-frontend.vercel.app/freetestapi/airports?search=${city}`);

        const promises = [destinationPromise, weathersPromise, airportsPromise];
        const [destinationsResult, weathersResult, airportsResult] = await Promise.allSettled(promises);

        const data = {};

        if (destinationsResult.status === 'rejected') {
            console.error('Problema in destinations:', destinationsResult.reason)
            data.city = null;
            data.country = null;
        } else {
            const destination = destinationsResult.value[0];
            data.city = destination ? destination.name : null;
            data.country = destination ? destination.country : null;
        }

        if (weathersResult.status === 'rejected') {
            console.error('Problema in weathers:', weathersResult.reason)
            data.temperature = null;
            data.weather = null;
        } else {
            const weather = weathersResult.value[0];
            data.temperature = weather ? weather.temperature : null;
            data.weather = weather ? weather.weather_description : null;
        }

        if (airportsResult.status === 'rejected') {
            console.error('Problema in weathers:', airportsResult.reason)
            data.airport = null;
        } else {
            const airport = airportsResult.value[0];
            data.airport = airport ? airport.name : null;
        }

        return data;
    } catch (error) {
        throw new Error('Errore durante la fetch:', error.message);
    }
}

const resultLondon = getDashboardData('london');
console.log(resultLondon);

const resultVienna = getDashboardData('vienna');
console.log(resultVienna);
