# 003_context_code_fix

## Prompt

There is an error in the following code "Cannot redeclare block-scoped variable 'result'.". Please only change one line to fix the code. Generate the changed line.
export default async function(startDate:string, endDate:string) {
    const searchParams = {
        fly_from: 'HKG',
        fly_to: 'SFO',
        date_from: startDate,
        date_to: endDate,
        max_fly_duration: 24,
        curr: 'USD',
        sort: 'price',
        limit: 20
    };
    const result = await axios.get('https://api.tequila.kiwi.com/v2/search', {
        params: searchParams,
        headers: {
        'apikey': Config.KIWI_API_KEY,
        },
    })
    const result = result.data.data.map(flight => {
        return {
        price: flight.price,
        departureTime: new Date(flight.local_departure),
        arrivalTime: new Date(flight.local_arrival),
        airline: flight.airlines, // airline is an array
        flightNumber: flight.route.map(route => route.flight_no), // flightNumber is an array
        non_stop: flight.route.length === 1 // Add non_stop info to the ticket
        };
    });
    const random = Math.floor(Math.random() * (flights.length + 1));
    return flights[random];
}

## Response

Change the second `const result` declaration to `const flights = result.data.data.map(flight => {`. So the fixed code would be:

```js
export default async function(startDate:string, endDate:string) {
    const searchParams = {
        fly_from: 'HKG',
        fly_to: 'SFO',
        date_from: startDate,
        date_to: endDate,
        max_fly_duration: 24,
        curr: 'USD',
        sort: 'price',
        limit: 20
    };
    const result = await axios.get('https://api.tequila.kiwi.com/v2/search', {
        params: searchParams,
        headers: {
        'apikey': Config.KIWI_API_KEY,
        },
    });
    const flights = result.data.data.map(flight => {
        return {
        price: flight.price,
        departureTime: new Date(flight.local_departure),
        arrivalTime: new Date(flight.local_arrival),
        airline: flight.airlines, // airline is an array
        flightNumber: flight.route.map(route => route.flight_no), // flightNumber is an array
        non_stop: flight.route.length === 1 // Add non_stop info to the ticket
        };
    });
    const random = Math.floor(Math.random() * (flights.length + 1));
    return flights[random];
}
```

Here we renamed the second variable that was incorrectly trying to redeclare `result` to `flights` which is more meaningful in the context of it being an array of flight data. Also note that you'll need to have the `axios` library imported and the `Config` object properly defined with the `KIWI_API_KEY` for this code to work fully.

