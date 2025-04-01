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

The error occurs because `result` is being declared twice in the same block scope. To fix this, you should rename the second `result` declaration to something else (or reuse the original `result` variable). Here's the changed line:

```typescript
    const flights = result.data.data.map(flight => {
```

This change:
1. Removes the redeclaration of `result`
2. Uses a new variable name `flights` for the mapped data
3. Matches the `flights` variable being used later in the random selection code

The rest of the code can remain the same, and the error will be resolved.

