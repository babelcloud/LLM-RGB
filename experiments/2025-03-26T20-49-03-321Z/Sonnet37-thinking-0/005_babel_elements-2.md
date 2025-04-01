# 005_babel_elements

## Prompt

You are an AI programming assistant for Babel applications. Babel is a custom DSL(YAML) that defines an application. Babel consists of requirements, dependencies, config and elements. Elements are the major part of a babel which has following kinds: Database, Function, HTTP, Worker, Assets. Database element can be used to define data structure and save data. Function element can be used to execute any task. HTTP element can be used to respond to http request such as GET, POST. Worker element can be used as cron job. Assets element can be used to put static files such as html, css, js. The code part of an element should be a TypeScript module. 

You will be provided with some examples of babel YAML code delimited by triple hashtag. Based on the requirements delimited by triple quotes, write the corresponding babel elements including detailed comments, starting from "dependencies". 

Code only, no explanations. Respond without code block wrap:
dependencies:
<Your response goes here>

###
schemaVersion: v2-alpha4
requirements:
  title: Build a party invitation system.
  database: true
  content:
  - type: webpage
    renderType: ssr
    desc:
    - "This page asks the invitees to select their preferred type of alcohol: whisky, wine, or beer."
  - type: webpage
    renderType: ssr
    desc:
    - "This page displays the alcohol preferences of the invitees."
  - type: action
    desc:
    - "This action sends invitation emails to the specified friends (Ella: ella@gmail.com, hailong: zhlmmc@gmail.com)."
    - "The email includes a link to the webpage where they can select their alcohol preference."
  - type: api
    desc:
    - "Handle HTTP POST request to submit the alcohol choice of a friend. The email and alcohol choice are provided in the POST message."
dependencies:
  ejs: 3.1.9
  nodemailer: 6.4.18
config:
  EMAIL_ACCOUNT: 
  EMAIL_PASSWORD: 
elements:
- name: sendEmail
  kind: Function
  code: |+
    import nodemailer from "nodemailer";
    import Config from "#config";
    /**
    * Send an email to the specified recipients with a link to select their preferred alcohol.
    * @param to - email address of the recipient.
    * @param subject - subject of the email.
    * @param message - content of the email.
    **/
    export default async function () {
        const emails = [
            { name: "ella", email: "ella@gmail.com" },
            { name: "Hailong", email: "zhlmmc@gmail.com" }
        ];
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: Config.EMAIL_ACCOUNT,
                pass: Config.EMAIL_PASSWORD,
            },
        });
        
        for (const friend of emails) {
            const link = `/select-alcohol/${friend.email}`;
            const message = `
                Hi ${friend.name},
                
                You are invited to the party tomorrow night! Please click the link below to choose your preferred alcohol:
                
                ${link}
                
                Cheers!
            `;
            const mailOptions = {
                from: Config.EMAIL_ACCOUNT,
                to: friend.email,
                subject: "Party Invitation",
                html: message,
            };
            await transporter.sendMail(mailOptions);
        }
    }
- name: AlcoholChoice
  kind: Database
  code: |+
    /**
     * This element saves friends' alcohol choices.
     **/
    export type AlcoholChoiceRecord = {
        email: string; // The email address of the friend.
        choice: string; // The preferred alcohol choice (Whisky, Wine, or Beer).
    }
- name: SelectAlcohol
  kind: HTTP
  method: GET
  pathname: /select-alcohol/:email
  code: |+
    import { frontend } from "#elements";
    import * as Koa from "koa";
    import * as ejs from "ejs";
    /**
     * Renders choose.ejs, a web page with the available alcohol choices, get the email address of the friend from the url path.
     **/
    export default async function (request: Koa.Request, response: Koa.Response, ctx: Koa.Context) {
        const email = request.params.email;
        const html = ejs.render(await frontend["/choose.ejs"].text(), { email });
        return html;
    }
- name: SubmitAlcoholChoice
  kind: HTTP
  method: POST
  pathname: /submit-choice
  code: |+
    import { AlcoholChoice } from "#elements";
    import { type AlcoholChoiceRecord } from "#elements/AlcoholChoice";
    import * as Koa from "koa";
    /**
     * API endpoint, handles HTTP POST /submit-choice. Get the email address and alcohol choice through POST message. Save the alcohol choice to the AlcoholChoice database.
     **/
    export default async function (request: Koa.Request, response: Koa.Response, ctx: Koa.Context) {
        const friendChoice: AlcoholChoiceRecord = {
            email: request.body.email,
            choice: request.body.choice
        }

        await AlcoholChoice.set(friendChoice.email, friendChoice);
        return 'Your choice has been submitted. Thank you!';
    }
- name: DisplayChoices
  kind: HTTP
  method: GET
  pathname: /choices
  code: |+
    import { AlcoholChoice } from "#elements";
    import { frontend } from "#elements";
    import * as Koa from "koa";
    import * as ejs from "ejs";
    /**
     * Renders selections.ejs, retrieves alcohol choices from database and return a web page that shows friends' alcohol choices.
     **/
    export default async function(request: Koa.Request, response: Koa.Response, ctx: Koa.Context) {
        const choices = await AlcoholChoice.list();
        const html = ejs.render(await frontend["/selections.ejs"].text(), {choices});
        return html;
    }
- name: frontend
  kind: Assets
  items:
  - path: /selections.ejs
    type: text/plain
    content: |
      <!DOCTYPE html>
      <html>
      <head>
          <title>Friends' Alcohol Choices</title>
          <style>
              table, th, td {
                  border: 1px solid black;
              }
          </style>
      </head>
      <body>
          <h1>Friends' Alcohol Choices</h1>
          <table>
              <tr>
                  <th>Email</th>
                  <th>Alcohol Choice</th>
              </tr>
      <% choices.forEach(choice => { %>
              <tr>
                  <td><%= choice.email %></td>
                  <td><%= choice.choice %></td>
              </tr>
      <% }); %>
          </table>
      </body>
      </html>
  - path: /choose.ejs
    type: text/html
    content: |
      <!DOCTYPE html>
      <html>
          <head>
          <title>Select Alcohol Choice</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          </head>
          <body>
          <h1>Select Alcohol Choice</h1>
          <form action="/submit-choice" method="post">
              <input type="hidden" name="email" value="<%= email %>">
              <label>
              <input type="radio" name="choice" value="Whisky" required>
              Whisky
              </label><br>
              <label>
              <input type="radio" name="choice" value="Wine">
              Wine
              </label><br>
              <label>
              <input type="radio" name="choice" value="Beer">
              Beer
              </label><br>
              <button type="submit">Submit</button>
          </form>
          </body>
      </html>
###
schemaVersion: v2-alpha4
requirements:
  title: Build a flight ticket monitor.
  database: true
  content:
  - type: webpage
    renderType: ssr
    desc:
    - "This page display the current random ticket details for the specified date from Hong Kong to San Francisco."
    - "The url path for this page is /ticket/{date}."
    - Date format should be 2023-10-01.
  - type: webpage
    renderType: ssr
    desc:
    - 'This page shows the lowest priced ticket information from database. '
  - type: action
    desc:
    - 'This action runs at 6:00AM every morning. '
    - 'This action checks flight ticket prices from Hong Kong to San Francisco for
      the period from 2023-10-01 to 2023-10-30 and saves a random ticket infomaton in database, if the ticket does not exist in the database.'
dependencies:
  ejs: 3.1.9
  axios: 0.24.0
config:
  KIWI_API_KEY: 
elements:
- name: FlightInfo
  kind: Database
  code: |+
    export type FlightInfoRecord = {
      price: number
      departureTime: string
      arrivalTime: string
      airline: array
      flightNumber: array
      non_stop: boolean
    }
- name: CheckFlightPrice
  kind: Worker
  schedule: "0 */6 * * *"
  scheduleEnabled: true
  code: |+
    import { FlightInfo, getTicket, checkDuplicate } from '#elements';
    /**
    * Every 6 hours, check flight ticket between 2023-10-01 to 2023-10-30 and save a random ticket info to database.
    **/
    export default async function() {
        const startDate = '2023-10-01';
        const endDate = '2023-10-30';
        const ticket = await getTicket(startDate, endDate);
        if (! await checkDuplicate(ticket)) {
            await FlightInfo.set(Date.now().toString(), ticket); 
        }
    }
- name: checkDuplicate
  kind: Function
  code: |+
    import { type FlightInfoRecord } from "#elements/FlightInfo"
    import { FlightInfo } from "#elements"
    /**
     * Check if the given ticket already exist in database.
     */
    export default async function (flightInfo: FlightInfoRecord) {
        const flights = await FlightInfo.query({
            flightNumber: flightInfo.flightNumber
        });
        if (flights.length > 0) {
            return true;
        }
        return false;
    }
- name: GetRandomTicketByDate
  kind: HTTP
  method: GET
  pathname: /ticket/:date
  code: |+
    import { getTicket } from '#elements';
    import { frontend } from "#elements";
    import * as Koa from "koa";
    import * as ejs from "ejs";
    /**
     * Renders index.ejs, a webpage that shows the current random ticket of the given date, e.g. 2023-10-01. The date is provided through URL. Calls getTicket to get the ticket info.
     **/
    export default async function(request: Koa.Request, response: Koa.Response, ctx: Koa.Context) {
        const ticket = await getTicket(request.params.date, request.params.date);
        const html = ejs.render(await frontend["/index.ejs"].text(), {ticket});
        return html;
    }
- name: GetLowestTicket
  kind: HTTP
  method: GET
  pathname: /ticket/hk-sfo
  code: |+
    import { getLowestTicket } from '#elements';
    import { frontend } from "#elements";
    import * as Koa from "koa";
    import * as ejs from "ejs";
    /**
     * Render index.ejs, a webpage that shows loweset price ticket in database. Calls getLowestTicket element to get the current lowest price ticket in database.
     **/
    export default async function(request: Koa.Request, response: Koa.Response, ctx: Koa.Context) {
        const ticket = await getLowestTicket();
        const html = ejs.render(await frontend["/index.ejs"].text(), {ticket});
        return html;
    }
- name: getTicket
  kind: Function
  code: |+
    import axios from "axios";
    import Config from "#config";
    import { type FlightInfoRecord } from "#elements/FlightInfo";
    /**
     * Calls KIWI API to get the lowest price ticket between the given dates from HK to SFO.
     * @param startDate - The start date, e.g. 2023-10-01
     * @param endDate - The end date, e.g. 2023-10-30
     **/
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
        const flights: FlightInfoRecord[] = result.data.data.map(flight => {
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
- name: getLowestTicket
  kind: Function
  code: |+
    import { FlightInfo } from '#elements';
    /**
     * Return the loweset price ticket in database.
     **/
    export default async function() {
        const tickets = await FlightInfo.list();
        let lowestPrice = Number.MAX_SAFE_INTEGER;
        let lowestTicket = null;
        for (const ticket of tickets) {
            const price = ticket.price;
            if (price < lowestPrice) {
            lowestPrice = price;
            lowestTicket = ticket;
            }
        }
        return lowestTicket;
    }
- name: frontend
  kind: Assets
  items:
  - path: /index.ejs
    type: text/plain
    content: |
      <!DOCTYPE html>
      <html>
          <head>
          <title>Lowest Ticket from HKG to SFO</title>
          <style>
              header {
                  background-color: #4CAF50;
                  color: white;
                  text-align: center;
              }
              span {
                  text-align: left;
                  display: block;
              }
              </style>
          </head>
          <body>
          <header>
              <h1>Current Lowest Ticket from HKG to SFO</h1>
          </header>
          <div>
              <span>Flight Number: <b><%= ticket.flightNumber %></b></span>
              <span>Departure Time: <b><%= new Date(ticket.departureTime).toLocaleString() %></b></span>
              <span>Arrival Time: <b><%= new Date(ticket.arrivalTime).toLocaleString() %></b></span>
              <span>Air Line: <b><%= ticket.airline %></b></span>
              <span>Ticket Price: <b>$<%= ticket.price %></b></span>
              <span>Non-Stop: <b><%= ticket.non_stop %></b></span>
          </div>
          </body>
      </html>
###
schemaVersion: v2-alpha4
requirements: 
  title: Build a weather information application.
  database: false
  content: 
  - type: webpage
    renderType: ssr
    desc:
      - "This page displays the weather information for a given city."
      - "This page incorporates a feature that allows the input of an email address."
      - "When user click Send button, send weather information to the email address."
      - "Use weahter data from openweathermap."
  - type: api
    desc:
      - "Handle HTTP request to send email of city weather to the given address."
dependencies:
  ejs: 3.1.9
  axios: 0.24.0
  nodemailer: 6.4.18
config:
  WEATHER_API_KEY: ""
  EMAIL_ACCOUNT: ""
  EMAIL_PASSWORD: ""
elements:
- name: GetWeather
  kind: HTTP
  method: GET
  pathname: /weather/:city
  code: |+
    import { getWeatherData } from '#elements';
    import { frontend } from "#elements";
    import * as Koa from "koa";
    import * as ejs from "ejs";
    /**
     * Renders index.ejs, city weather webpage. The city is specified in url path. Calls getWeatherData element to get weather info.
     **/
    export default async function(request: Koa.Request, response: Koa.Response, ctx: Koa.Context) {
        const { temperature, description } = await getWeatherData(request.params.city);
        const html = ejs.render(await frontend["/index.ejs"].text(), {
            temperature,
            description,
            city: request.params.city
        });
        return html;
    }
- name: SendEmail
  kind: HTTP
  method: POST
  pathname: /send-email
  code: |+
    import nodemailer from "nodemailer";
    import Config from "#config";
    import * as Koa from "koa";
    /**
     * API endpoint, handles HTTP POST "/send-email". Get the email address and city through POST message. Calls getWeatherData to get weather info by city. Send email with weather info to the email address.
     **/
    export default async function(request: Koa.Request, response: Koa.Response, ctx: Koa.Context) {
        const email = request.body.email;
        const city = request.body.city;
        const temperature = request.body.temperature;
        const description = request.body.description;
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
            user: Config.EMAIL_ACCOUNT,
            pass: Config.EMAIL_PASSWORD
            }
        });
        const mailOptions = {
            from: Config.EMAIL_ACCOUNT,
            to: email,
            subject: 'Weather Info for ' + city,
            text: `The temperature in ${city} is ${temperature} degrees Celsius and the weather is ${description}.`
        };
        await transporter.sendMail(mailOptions);
        return "Email Sent to " + email;
    }
- name: getWeatherData
  kind: Function
  code: |+
    import axios from "axios";
    import Config from "#config";
    /**
     * Calls weather API to get the weather data of the specified city.
     * @param city - The name of the city. If contains space, space should be converted to %20.
     **/
    export default async function(city:string) {
        const result = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${Config.WEATHER_API_KEY}`);
        const { temp: temperature } = result.data.main;
        const { description } = result.data.weather[0];
        return { "temperature": temperature, "description": description };
    }
- name: frontend
  kind: Assets
  items:
  - path: /index.ejs
    type: text/plain
    content: |
      <!DOCTYPE html>
      <html>
        <head>
          <title>Weather Info for <%= city %></title>
        </head>
        <body>
          <h1>Current Weather in <%= city %></h1>
          <p>The temperature is <%= temperature %> degrees Celsius and the weather is <%= description %>.</p>
          <form action="/send-email" method="post">
            <input type="hidden" id="city" name="city" value="<%= city %>"/>
            <input type="hidden" id="temperature" name="temperature" value="<%= temperature %>"/>
            <input type="hidden" id="description" name="description" value="<%= description %>"/>
            <label for="email">Email:</label>
            <input type="email" id="email" name="email">
            <button type="submit">Send</button>
          </form>
        </body>
      </html>
###
schemaVersion: v2-alpha4
requirements:
  title: Build a music box application.
  database: true
  content:
  - type: webpage
    renderType: ssr
    desc:
    - "This page allows user to manage songs, including upload songs and delete songs."
  - type: webpage
    renderType: ssr
    desc:
    - 'This page shows the uploaded songs and provide play button for users to play
      songs. '
  - type: api
    desc:
    - Handle HTTP request to upload a song. Save the uploaded song to storage.
  - type: api
    desc:
    - Handle HTTP request to delete specified song. Remove the song from storage.
  - type: api
    desc:
    - Handle HTTP request to return the specified song.
dependencies:
  ejs: 3.1.9
  uniqid: 5.4.0
  unidecode: 0.1.8
config: {}
elements:
- name: UploadMusic
  kind: HTTP
  method: POST
  pathname: /upload
  code: |+
    import * as fs from 'fs';
    import uniqid from 'uniqid';
    import { Song, SongStore} from '#elements';
    import { type SongRecord } from '#elements/Song';
    import unidecode from 'unidecode';
    import * as Koa from "koa";
    /**
    * API endpoint, handles HTTP POST /upload. 
    * Upload a new music file, save to storage, and add it to the song list.
    **/
    export default async function(request: Koa.Request, response: Koa.Response, ctx: Koa.Context) {
        const song = request.files.song;
        const { filepath, originalFilename, mimetype, size } = song;
        const buffer = fs.readFileSync(filepath);
        const storageKey = unidecode(originalFilename).replace(/ /g, '_');
        await SongStore.put(storageKey, new Blob([buffer], {type: mimetype}));

        const id = uniqid();
        const { title, artist, album } = request.body;
        const duration = Math.round(size / 22050);  // Rough estimate assumes audio is mono, 22.05 kHz, 8-bit 
        const newSong: SongRecord = {
            id,
            title,
            artist,
            album,
            duration,
            filename: storageKey,
        };
        await Song.set(id, newSong);
        return {
            message: 'Song uploaded successfully',
            song: newSong
        };
    }
- name: RemoveSong
  kind: HTTP
  method: DELETE
  pathname: /songs/:id
  code: |+
    import { Song, SongStore } from '#elements';
    import * as Koa from "koa";
    /**
    * API endpoint, handles HTTP DELETE /songs/:id.
    * Remove a specific song identified by id from song list, and delete the file from storage.
    **/
    export default async function(request: Koa.Request, response: Koa.Response, ctx: Koa.Context) {
        const { id } = request.params;
        const song = await Song.get(id);
        await SongStore.delete(song.filename);
        await Song.delete(id);
        return 'Song deleted successfully';
    }
- name: Song
  kind: Database
  code: |+
    /**
     * This element defines the song structure to save in your music player.
     **/
    export type SongRecord = {
        id: string; // The id of the song.
        title: string; // The title of the song.
        artist: string; // The artist or the band who performed the song.
        album: string; // The name of the album where the song is from.
        duration: number; // The duration of the song in seconds.
        filename: string; // The filename of the song.
    }
- name: PlaySong
  kind: HTTP
  method: GET
  pathname: /songs/:id
  code: |+
    import { Song, SongStore } from '#elements';
    import * as Koa from "koa";
    /**
    * API endpoint, handles HTTP GET /songs/:id.
    * Stream the specific song identified by id.
    **/
    export default async function(request: Koa.Request, response: Koa.Response, ctx: Koa.Context) {
        const { id } = request.params;
        const song = await Song.get(id);
        const file = await (await SongStore.get(song.filename)).blob();
        response.set('Content-Type', (file.type));
        return Buffer.from(await file.arrayBuffer());
    }
- name: SongPage
  kind: HTTP
  method: GET
  pathname: /song-page
  code: |+
    import { Song } from '#elements';
    import { frontend } from "#elements";
    import * as Koa from "koa";
    import * as ejs from "ejs";
    /**
    * Renders manage.ejs, the song upload and management page.
    **/
    export default async function(request: Koa.Request, response: Koa.Response, ctx: Koa.Context) {
        const songs = await Song.list();
        const html = ejs.render(await frontend["/manage.ejs"].text(), {songs});
        return html;
    }
- name: PlayerPage
  kind: HTTP
  method: GET
  pathname: /player
  code: |+
    import { Song } from '#elements';
    import { frontend } from "#elements";
    import * as Koa from "koa";
    import * as ejs from "ejs";
    /**
    * Renders player.ejs, display the music player page which plays songs from the song list.
    **/
    export default async function(request: Koa.Request, response: Koa.Response, ctx: Koa.Context) {
        const songs = await Song.list();
        let html = ejs.render(await frontend["/player.ejs"].text(), {songs});
        return html;
    }
- name: frontend
  kind: Assets
  items:
  - path: /player.ejs
    type: text/plain
    content: |
        <!DOCTYPE html>
        <html>
        <head>
            <title>Music Player</title>
            <style>
                table, th, td {
                    border: 1px solid black;
                }
            </style>
        </head>
        <body>
            <h1>Music Player</h1>
            <table>
                <tr>
                    <th>Title</th>
                    <th>Artist</th>
                    <th>Album</th>
                    <th>Duration</th>
                    <th>Control</th>
                </tr>
        <%
        songs.forEach(song => {
        const durationMinutes = Math.floor(song.duration / 60);
        const durationSeconds = song.duration % 60;
        %>
                <tr>
                    <td><%= song.title %></td>
                    <td><%= song.artist %></td>
                    <td><%= song.album %></td>
                    <td><%= durationMinutes %>:<%= durationSeconds < 10 ? '0' : '' %><%= durationSeconds %></td>
                    <td>
                        <button onclick="playSong('<%= song.id %>')">Play</button>   
                    </td>
                </tr>
        <% }); %>
            </table>
            <script>
                function playSong(id) {
                    //const audio = new Audio('/songs/' + id);
                    //audio.play();
                    document.querySelector('video[name="media"] source').src = '/songs/' + id;
                    document.querySelector('video[name="media"]').load();
                }
            </script>
            <video controls="" autoplay="" name="media">
                <source src="" type="audio/mpeg">
            </video>
        </body>
        </html>
  - path: /manage.ejs
    type: text/plain
    content: |
        <!DOCTYPE html>
        <html>
        <head>
            <title>Song Management</title>
            <style>
                table, th, td {
                    border: 1px solid black;
                }
            </style>
        </head>
        <body>
            <h1>Song Management</h1>
            <form action="/upload" method="post" enctype="multipart/form-data">
                <label>
                    Title: <input type="text" name="title" required>
                </label><br>
                <label>
                    Artist: <input type="text" name="artist" required>
                </label><br>
                <label>
                    Album: <input type="text" name="album">
                </label><br>
                <label>
                    Song file: <input type="file" name="song" required>
                </label><br>
                <button type="submit">Upload</button>
            </form>
            <h2>Song List</h2>
            <table>
                <tr>
                    <th>Title</th>
                    <th>Artist</th>
                    <th>Album</th>
                    <th>Duration</th>
                    <th>Actions</th>
                </tr>
        <% songs.forEach(song => { %>
                <tr>
                    <td><%= song.title %></td>
                    <td><%= song.artist %></td>
                    <td><%= song.album %></td>
                    <td><%= Math.floor(song.duration / 60) %>:<%= song.duration % 60 %></td>
                    <td>
                        <button onclick="deleteSong('<%= song.id %>')">Delete</button> 
                        <script>
                            async function deleteSong(id) {
                                let result = await fetch('/songs/' + id, {
                                    method: 'DELETE',
                                });
                                if(result.ok) { 
                                    alert('Song Deleted!');
                                } else {
                                    alert('Delete Failed!');
                                }
                                window.location.reload();
                            }
                        </script>
                    </td>
                </tr>
        <% }); %>
            </table>
        </body>
        </html>
- name: SongStore
  kind: Storage
  maxFileSize: 10MB
  allowContentTypes:
  - '*/*'
###

"""
requirements:
    - I need a webpage to manage my photos including view, upload and delete. Also I can select photos to create albums. Each album should have an unique link so that I can send it to my friends to see the selected photos on a webpage.
"""

## Response

dependencies:
ejs: 3.1.9
uniqid: 5.4.0
config: {}
elements:
- name: Photo
  kind: Database
  code: |+
    /**
     * This element defines the photo structure to save in the photo manager.
     **/
    export type PhotoRecord = {
      id: string;        // Unique identifier for the photo
      title: string;     // Title of the photo
      description: string; // Description of the photo
      filename: string;  // Filename in storage
      uploadDate: string; // Date when the photo was uploaded
    }
- name: Album
  kind: Database
  code: |+
    /**
     * This element defines the album structure to save in the photo manager.
     **/
    export type AlbumRecord = {
      id: string;        // Unique identifier for the album
      title: string;     // Title of the album
      description: string; // Description of the album
      photoIds: string[]; // Array of photo IDs included in this album
      creationDate: string; // Date when the album was created
    }
- name: PhotoStore
  kind: Storage
  maxFileSize: 10MB
  allowContentTypes:
    - 'image/*'
- name: UploadPhoto
  kind: HTTP
  method: POST
  pathname: /photos/upload
  code: |+
    import * as fs from 'fs';
    import uniqid from 'uniqid';
    import { Photo, PhotoStore } from '#elements';
    import { type PhotoRecord } from '#elements/Photo';
    import * as Koa from "koa";
    
    /**
     * API endpoint, handles HTTP POST /photos/upload.
     * Upload a new photo file, save to storage, and add it to the photo database.
     **/
    export default async function(request: Koa.Request, response: Koa.Response, ctx: Koa.Context) {
      const photo = request.files.photo;
      const { filepath, originalFilename, mimetype } = photo;
      
      // Read the file and store it
      const buffer = fs.readFileSync(filepath);
      const id = uniqid();
      const filename = `${id}-${originalFilename}`;
      
      await PhotoStore.put(filename, new Blob([buffer], {type: mimetype}));
      
      // Create photo record
      const { title, description } = request.body;
      const newPhoto: PhotoRecord = {
        id,
        title: title || originalFilename,
        description: description || '',
        filename,
        uploadDate: new Date().toISOString()
      };
      
      await Photo.set(id, newPhoto);
      
      return {
        message: 'Photo uploaded successfully',
        photo: newPhoto
      };
    }
- name: DeletePhoto
  kind: HTTP
  method: DELETE
  pathname: /photos/:id
  code: |+
    import { Photo, PhotoStore, Album } from '#elements';
    import * as Koa from "koa";
    
    /**
     * API endpoint, handles HTTP DELETE /photos/:id.
     * Delete a photo from storage and database, and remove it from any albums it's in.
     **/
    export default async function(request: Koa.Request, response: Koa.Response, ctx: Koa.Context) {
      const { id } = request.params;
      
      // Get the photo to find its filename
      const photo = await Photo.get(id);
      if (!photo) {
        response.status = 404;
        return { error: 'Photo not found' };
      }
      
      // Delete from storage
      await PhotoStore.delete(photo.filename);
      
      // Delete from database
      await Photo.delete(id);
      
      // Remove from any albums
      const albums = await Album.list();
      for (const album of albums) {
        if (album.photoIds.includes(id)) {
          album.photoIds = album.photoIds.filter(photoId => photoId !== id);
          await Album.set(album.id, album);
        }
      }
      
      return { message: 'Photo deleted successfully' };
    }
- name: GetPhoto
  kind: HTTP
  method: GET
  pathname: /photos/:id/image
  code: |+
    import { Photo, PhotoStore } from '#elements';
    import * as Koa from "koa";
    
    /**
     * API endpoint, handles HTTP GET /photos/:id/image.
     * Stream the specific photo identified by id.
     **/
    export default async function(request: Koa.Request, response: Koa.Response, ctx: Koa.Context) {
      const { id } = request.params;
      const photo = await Photo.get(id);
      
      if (!photo) {
        response.status = 404;
        return { error: 'Photo not found' };
      }
      
      const file = await (await PhotoStore.get(photo.filename)).blob();
      response.set('Content-Type', file.type);
      return Buffer.from(await file.arrayBuffer());
    }
- name: CreateAlbum
  kind: HTTP
  method: POST
  pathname: /albums/create
  code: |+
    import uniqid from 'uniqid';
    import { Album } from '#elements';
    import { type AlbumRecord } from '#elements/Album';
    import * as Koa from "koa";
    
    /**
     * API endpoint, handles HTTP POST /albums/create.
     * Create a new album with selected photos.
     **/
    export default async function(request: Koa.Request, response: Koa.Response, ctx: Koa.Context) {
      const { title, description, photoIds } = request.body;
      
      // Validate input
      if (!title) {
        response.status = 400;
        return { error: 'Album title is required' };
      }
      
      if (!photoIds || !Array.isArray(photoIds) || photoIds.length === 0) {
        response.status = 400;
        return { error: 'At least one photo must be selected' };
      }
      
      const id = uniqid();
      const newAlbum: AlbumRecord = {
        id,
        title,
        description: description || '',
        photoIds,
        creationDate: new Date().toISOString()
      };
      
      await Album.set(id, newAlbum);
      
      return {
        message: 'Album created successfully',
        album: newAlbum
      };
    }
- name: DeleteAlbum
  kind: HTTP
  method: DELETE
  pathname: /albums/:id
  code: |+
    import { Album } from '#elements';
    import * as Koa from "koa";
    
    /**
     * API endpoint, handles HTTP DELETE /albums/:id.
     * Delete an album (but not the photos in it).
     **/
    export default async function(request: Koa.Request, response: Koa.Response, ctx: Koa.Context) {
      const { id } = request.params;
      
      // Check if album exists
      const album = await Album.get(id);
      if (!album) {
        response.status = 404;
        return { error: 'Album not found' };
      }
      
      // Delete the album
      await Album.delete(id);
      
      return { message: 'Album deleted successfully' };
    }
- name: HomePage
  kind: HTTP
  method: GET
  pathname: /
  code: |+
    import { Photo, Album } from '#elements';
    import { frontend } from "#elements";
    import * as Koa from "koa";
    import * as ejs from "ejs";
    
    /**
     * Renders home.ejs, the main photo management page.
     * Shows all photos and albums, with options to upload, delete, and create albums.
     **/
    export default async function(request: Koa.Request, response: Koa.Response, ctx: Koa.Context) {
      const photos = await Photo.list();
      const albums = await Album.list();
      
      const html = ejs.render(await frontend["/home.ejs"].text(), {
        photos,
        albums
      });
      
      return html;
    }
- name: ViewAlbum
  kind: HTTP
  method: GET
  pathname: /albums/:id
  code: |+
    import { Photo, Album } from '#elements';
    import { frontend } from "#elements";
    import * as Koa from "koa";
    import * as ejs from "ejs";
    
    /**
     * Renders album.ejs, displays all photos in a specific album.
     **/
    export default async function(request: Koa.Request, response: Koa.Response, ctx: Koa.Context) {
      const { id } = request.params;
      const album = await Album.get(id);
      
      if (!album) {
        response.status = 404;
        return "Album not found";
      }
      
      // Get all photos in the album
      const albumPhotos = [];
      for (const photoId of album.photoIds) {
        const photo = await Photo.get(photoId);
        if (photo) {
          albumPhotos.push(photo);
        }
      }
      
      const html = ejs.render(await frontend["/album.ejs"].text(), {
        album,
        photos: albumPhotos
      });
      
      return html;
    }
- name: frontend
  kind: Assets
  items:
  - path: /home.ejs
    type: text/plain
    content: |
      <!DOCTYPE html>
      <html>
      <head>
        <title>Photo Manager</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
          }
          h1, h2 {
            color: #333;
          }
          .photo-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 20px;
            margin-top: 20px;
          }
          .photo-item {
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 10px;
            position: relative;
          }
          .photo-item img {
            width: 100%;
            height: 150px;
            object-fit: cover;
          }
          .photo-title {
            margin-top: 8px;
            font-weight: bold;
          }
          .photo-desc {
            font-size: 0.8em;
            color: #666;
            margin-top: 4px;
          }
          .album-list {
            margin-top: 20px;
          }
          .album-item {
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 10px;
            margin-bottom: 10px;
          }
          .upload-form, .album-form {
            background: #f9f9f9;
            padding: 20px;
            border-radius: 4px;
            margin-bottom: 20px;
          }
          button, input[type="submit"] {
            background: #4CAF50;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
          }
          button.delete {
            background: #f44336;
          }
          input, textarea {
            width: 100%;
            padding: 8px;
            margin-bottom: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
          }
        </style>
      </head>
      <body>
        <h1>Photo Manager</h1>
        
        <div class="upload-form">
          <h2>Upload New Photo</h2>
          <form action="/photos/upload" method="post" enctype="multipart/form-data">
            <input type="text" name="title" placeholder="Photo Title" required>
            <textarea name="description" placeholder="Description"></textarea>
            <input type="file" name="photo" accept="image/*" required>
            <input type="submit" value="Upload">
          </form>
        </div>
        
        <h2>Your Photos</h2>
        <div class="photo-grid">
          <% photos.forEach(photo => { %>
            <div class="photo-item">
              <img src="/photos/<%= photo.id %>/image" alt="<%= photo.title %>">
              <div class="photo-title"><%= photo.title %></div>
              <div class="photo-desc"><%= photo.description %></div>
              <input type="checkbox" class="photo-select" data-id="<%= photo.id %>" data-title="<%= photo.title %>">
              <button class="delete" onclick="deletePhoto('<%= photo.id %>')">Delete</button>
            </div>
          <% }); %>
        </div>
        
        <div class="album-form">
          <h2>Create New Album</h2>
          <form id="album-form">
            <input type="text" id="album-title" placeholder="Album Title" required>
            <textarea id="album-description" placeholder="Album Description"></textarea>
            <div id="selected-photos">No photos selected</div>
            <button type="submit">Create Album</button>
          </form>
        </div>
        
        <h2>Your Albums</h2>
        <div class="album-list">
          <% if (albums.length === 0) { %>
            <p>No albums yet. Create one above!</p>
          <% } else { %>
            <% albums.forEach(album => { %>
              <div class="album-item">
                <h3><%= album.title %></h3>
                <p><%= album.description %></p>
                <p>Contains <%= album.photoIds.length %> photos</p>
                <a href="/albums/<%= album.id %>">
                  <button>View Album</button>
                </a>
                <button class="delete" onclick="deleteAlbum('<%= album.id %>')">Delete Album</button>
              </div>
            <% }); %>
          <% } %>
        </div>
        
        <script>
          // Handle photo selection for albums
          const selectedPhotos = new Set();
          const selectedPhotosDiv = document.getElementById('selected-photos');
          
          document.querySelectorAll('.photo-select').forEach(checkbox => {
            checkbox.addEventListener('change', function() {
              const photoId = this.dataset.id;
              const photoTitle = this.dataset.title;
              
              if (this.checked) {
                selectedPhotos.add(photoId);
              } else {
                selectedPhotos.delete(photoId);
              }
              
              updateSelectedPhotosDisplay();
            });
          });
          
          function updateSelectedPhotosDisplay() {
            if (selectedPhotos.size === 0) {
              selectedPhotosDiv.textContent = 'No photos selected';
            } else {
              selectedPhotosDiv.textContent = `${selectedPhotos.size} photos selected`;
            }
          }
          
          // Handle album creation
          document.getElementById('album-form').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (selectedPhotos.size === 0) {
              alert('Please select at least one photo for the album');
              return;
            }
            
            const title = document.getElementById('album-title').value;
            const description = document.getElementById('album-description').value;
            
            try {
              const response = await fetch('/albums/create', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  title,
                  description,
                  photoIds: Array.from(selectedPhotos)
                })
              });
              
              const result = await response.json();
              
              if (response.ok) {
                alert('Album created successfully!');
                window.location.reload();
              } else {
                alert(`Error: ${result.error}`);
              }
            } catch (error) {
              alert('An error occurred while creating the album');
              console.error(error);
            }
          });
          
          // Handle photo deletion
          async function deletePhoto(id) {
            if (confirm('Are you sure you want to delete this photo? It will also be removed from any albums.')) {
              try {
                const response = await fetch(`/photos/${id}`, {
                  method: 'DELETE'
                });
                
                if (response.ok) {
                  alert('Photo deleted successfully');
                  window.location.reload();
                } else {
                  const result = await response.json();
                  alert(`Error: ${result.error}`);
                }
              } catch (error) {
                alert('An error occurred while deleting the photo');
                console.error(error);
              }
            }
          }
          
          // Handle album deletion
          async function deleteAlbum(id) {
            if (confirm('Are you sure you want to delete this album? The photos will not be deleted.')) {
              try {
                const response = await fetch(`/albums/${id}`, {
                  method: 'DELETE'
                });
                
                if (response.ok) {
                  alert('Album deleted successfully');
                  window.location.reload();
                } else {
                  const result = await response.json();
                  alert(`Error: ${result.error}`);
                }
              } catch (error) {
                alert('An error occurred while deleting the album');
                console.error(error);
              }
            }
          }
        </script>
      </body>
      </html>
  - path: /album.ejs
    type: text/plain
    content: |
      <!DOCTYPE html>
      <html>
      <head>
        <title><%= album.title %> - Photo Album</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
          }
          h1, h2 {
            color: #333;
          }
          .album-info {
            margin-bottom: 20px;
          }
          .photo-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
          }
          .photo-item {
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 10px;
          }
          .photo-item img {
            width: 100%;
            height: 200px;
            object-fit: cover;
            cursor: pointer;
          }
          .photo-title {
            margin-top: 8px;
            font-weight: bold;
          }
          .photo-desc {
            font-size: 0.8em;
            color: #666;
            margin-top: 4px;
          }
          .back-link {
            display: inline-block;
            margin-bottom: 20px;
            color: #4CAF50;
            text-decoration: none;
          }
          .back-link:hover {
            text-decoration: underline;
          }
          /* Lightbox styles */
          .lightbox {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.9);
            z-index: 1000;
            text-align: center;
            padding: 20px;
          }
          .lightbox img {
            max-width: 90%;
            max-height: 80vh;
            margin-top: 5vh;
          }
          .lightbox-close {
            position: absolute;
            top: 20px;
            right: 30px;
            color: white;
            font-size: 30px;
            cursor: pointer;
          }
          .lightbox-title {
            color: white;
            margin-top: 10px;
            font-size: 18px;
          }
          .lightbox-desc {
            color: #ccc;
            margin-top: 5px;
          }
        </style>
      </head>
      <body>
        <a href="/" class="back-link">← Back to Photo Manager</a>
        
        <div class="album-info">
          <h1><%= album.title %></h1>
          <p><%= album.description %></p>
          <p>Created on <%= new Date(album.creationDate).toLocaleDateString() %></p>
          <p>Share this album: <input type="text" readonly value="<%= `${request.protocol}://${request.get('host')}/albums/${album.id}` %>" onclick="this.select()"></p>
        </div>
        
        <div class="photo-grid">
          <% photos.forEach(photo => { %>
            <div class="photo-item">
              <img src="/photos/<%= photo.id %>/image" alt="<%= photo.title %>" onclick="openLightbox('<%= photo.id %>', '<%= photo.title %>', '<%= photo.description %>')">
              <div class="photo-title"><%= photo.title %></div>
              <div class="photo-desc"><%= photo.description %></div>
            </div>
          <% }); %>
        </div>
        
        <!-- Lightbox for photo viewing -->
        <div id="lightbox" class="lightbox">
          <span class="lightbox-close" onclick="closeLightbox()">&times;</span>
          <img id="lightbox-img" src="">
          <div id="lightbox-title" class="lightbox-title"></div>
          <div id="lightbox-desc" class="lightbox-desc"></div>
        </div>
        
        <script>
          function openLightbox(id, title, description) {
            const lightbox = document.getElementById('lightbox');
            const lightboxImg = document.getElementById('lightbox-img');
            const lightboxTitle = document.getElementById('lightbox-title');
            const lightboxDesc = document.getElementById('lightbox-desc');
            
            lightboxImg.src = `/photos/${id}/image`;
            lightboxTitle.textContent = title;
            lightboxDesc.textContent = description;
            lightbox.style.display = 'block';
          }
          
          function closeLightbox() {
            document.getElementById('lightbox').style.display = 'none';
          }
          
          // Close lightbox when clicking outside the image
          document.getElementById('lightbox').addEventListener('click', function(e) {
            if (e.target === this) {
              closeLightbox();
            }
          });
          
          // Close lightbox with escape key
          document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
              closeLightbox();
            }
          });
        </script>
      </body>
      </html>

