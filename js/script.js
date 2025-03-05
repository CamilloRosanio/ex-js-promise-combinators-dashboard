/***********************************************************************
# DASHBOARD DELLA CITTA'
***********************************************************************/

async function fetchJson(url) {
    const response = await fetch(url);
    const object = await response.json();
    return object;

}

async function getDashboardData(city) {

    try {
        console.log('Caricando la query per:', city)
        const destinationPromise = fetchJson(`https://boolean-spec-frontend.vercel.app/freetestapi/destinations?search=${city}`);
        console.log(destinationPromise);
        const weathersPromise = fetchJson(`https://boolean-spec-frontend.vercel.app/freetestapi/weathers?search=${city}`);
        console.log(weathersPromise);
        const airportsPromise = fetchJson(`https://boolean-spec-frontend.vercel.app/freetestapi/airports?search=${city}`);
        console.log(airportsPromise);

        const promises = [destinationPromise, weathersPromise, airportsPromise];
        const [destinations, weathers, airports] = await Promise.all(promises);

        return {
            city: destinations[0].name,
            country: destinations[0].country,
            temperature: weathers[0].temperature,
            weather: weathers[0].weather_description,
            airport: airports[0].name,
        }
    } catch (error) {
        throw new Error('Errore durante la fetch:', error.message);
    }
}

const finalResult = getDashboardData('london');
console.log(finalResult);
