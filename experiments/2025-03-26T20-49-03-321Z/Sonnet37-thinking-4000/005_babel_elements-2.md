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
  sanitize-filename: 1.6.3
config: {}
elements:
  - name: Photo
    kind: Database
    code: |+
      /**
       * This element stores metadata for uploaded photos.
       */
      export type PhotoRecord = {
        id: string;         // Unique identifier for the photo
        filename: string;   // Original filename
        title: string;      // Photo title (optional)
        description: string; // Photo description (optional)
        uploadDate: number; // Timestamp when photo was uploaded
        contentType: string; // MIME type of the photo (e.g. image/jpeg)
      }

  - name: Album
    kind: Database
    code: |+
      /**
       * This element stores album metadata.
       */
      export type AlbumRecord = {
        id: string;        // Unique identifier for the album
        name: string;      // Album name
        description: string; // Album description
        creationDate: number; // Timestamp when album was created
        photoIds: string[]; // Array of photo IDs included in this album
      }

  - name: PhotoStore
    kind: Storage
    maxFileSize: 10MB
    allowContentTypes:
      - 'image/*'

  - name: PhotoManager
    kind: HTTP
    method: GET
    pathname: /
    code: |+
      import { Photo, Album } from '#elements';
      import { frontend } from "#elements";
      import * as Koa from "koa";
      import * as ejs from "ejs";
      
      /**
       * Renders the main photo management page where users can view, upload, and delete photos,
       * as well as create albums from selected photos.
       */
      export default async function(request: Koa.Request, response: Koa.Response, ctx: Koa.Context) {
        const photos = await Photo.list();
        const albums = await Album.list();
        
        // Sort photos by upload date (newest first)
        photos.sort((a, b) => b.uploadDate - a.uploadDate);
        
        // Sort albums by creation date (newest first)
        albums.sort((a, b) => b.creationDate - a.creationDate);
        
        const html = ejs.render(await frontend["/manager.ejs"].text(), {
          photos,
          albums
        });
        
        return html;
      }

  - name: UploadPhoto
    kind: HTTP
    method: POST
    pathname: /upload
    code: |+
      import * as fs from 'fs';
      import uniqid from 'uniqid';
      import sanitize from 'sanitize-filename';
      import { Photo, PhotoStore } from '#elements';
      import { type PhotoRecord } from '#elements/Photo';
      import * as Koa from "koa";
      
      /**
       * API endpoint to handle photo uploads.
       * Saves the photo to storage and adds its metadata to the database.
       */
      export default async function(request: Koa.Request, response: Koa.Response, ctx: Koa.Context) {
        try {
          const photo = request.files.photo;
          const { filepath, originalFilename, mimetype } = photo;
          
          // Ensure it's an image
          if (!mimetype.startsWith('image/')) {
            return {
              success: false,
              message: 'Only image files are allowed'
            };
          }
          
          // Read the file buffer
          const buffer = fs.readFileSync(filepath);
          
          // Generate a unique ID for the photo
          const id = uniqid();
          
          // Sanitize filename and create a storage key
          const safeFilename = sanitize(originalFilename);
          const storageKey = `${id}-${safeFilename}`;
          
          // Save the photo to storage
          await PhotoStore.put(storageKey, new Blob([buffer], {type: mimetype}));
          
          // Get metadata from the request
          const { title = '', description = '' } = request.body;
          
          // Create and save the photo record
          const newPhoto: PhotoRecord = {
            id,
            filename: originalFilename,
            title,
            description,
            uploadDate: Date.now(),
            contentType: mimetype
          };
          
          await Photo.set(id, newPhoto);
          
          return {
            success: true,
            message: 'Photo uploaded successfully',
            photo: newPhoto
          };
        } catch (error) {
          return {
            success: false,
            message: 'Failed to upload photo: ' + error.message
          };
        }
      }

  - name: DeletePhoto
    kind: HTTP
    method: DELETE
    pathname: /photo/:id
    code: |+
      import { Photo, Album, PhotoStore } from '#elements';
      import * as Koa from "koa";
      
      /**
       * API endpoint to delete a photo.
       * Removes the photo from storage and database, and also removes it from any albums.
       */
      export default async function(request: Koa.Request, response: Koa.Response, ctx: Koa.Context) {
        try {
          const { id } = request.params;
          
          // Get the photo record
          const photo = await Photo.get(id);
          if (!photo) {
            return {
              success: false,
              message: 'Photo not found'
            };
          }
          
          // Delete the photo file from storage
          // The storage key is constructed as id-filename
          const storageKey = `${id}-${sanitize(photo.filename)}`;
          await PhotoStore.delete(storageKey);
          
          // Remove photo from any albums that contain it
          const albums = await Album.list();
          for (const album of albums) {
            if (album.photoIds.includes(id)) {
              // Remove the photo ID from the album
              album.photoIds = album.photoIds.filter(photoId => photoId !== id);
              // Update the album
              await Album.set(album.id, album);
            }
          }
          
          // Delete the photo record from the database
          await Photo.delete(id);
          
          return {
            success: true,
            message: 'Photo deleted successfully'
          };
        } catch (error) {
          return {
            success: false,
            message: 'Failed to delete photo: ' + error.message
          };
        }
      }

  - name: CreateAlbum
    kind: HTTP
    method: POST
    pathname: /album
    code: |+
      import uniqid from 'uniqid';
      import { Album } from '#elements';
      import { type AlbumRecord } from '#elements/Album';
      import * as Koa from "koa";
      
      /**
       * API endpoint to create a new album from selected photos.
       */
      export default async function(request: Koa.Request, response: Koa.Response, ctx: Koa.Context) {
        try {
          const { name, description, photoIds } = request.body;
          
          if (!name || !photoIds || !Array.isArray(photoIds) || photoIds.length === 0) {
            return {
              success: false,
              message: 'Album name and at least one photo are required'
            };
          }
          
          // Generate a unique ID for the album
          const id = uniqid();
          
          // Create and save the album record
          const newAlbum: AlbumRecord = {
            id,
            name,
            description: description || '',
            creationDate: Date.now(),
            photoIds
          };
          
          await Album.set(id, newAlbum);
          
          return {
            success: true,
            message: 'Album created successfully',
            album: newAlbum
          };
        } catch (error) {
          return {
            success: false,
            message: 'Failed to create album: ' + error.message
          };
        }
      }

  - name: ViewAlbum
    kind: HTTP
    method: GET
    pathname: /album/:id
    code: |+
      import { Album, Photo } from '#elements';
      import { frontend } from "#elements";
      import * as Koa from "koa";
      import * as ejs from "ejs";
      
      /**
       * Renders a page to view a specific album using its unique ID.
       * This is the page that can be shared with friends.
       */
      export default async function(request: Koa.Request, response: Koa.Response, ctx: Koa.Context) {
        try {
          const { id } = request.params;
          
          // Get the album record
          const album = await Album.get(id);
          if (!album) {
            return {
              success: false,
              message: 'Album not found'
            };
          }
          
          // Get all photos in the album
          const photos = [];
          for (const photoId of album.photoIds) {
            const photo = await Photo.get(photoId);
            if (photo) {
              photos.push(photo);
            }
          }
          
          const html = ejs.render(await frontend["/album.ejs"].text(), {
            album,
            photos
          });
          
          return html;
        } catch (error) {
          return {
            success: false,
            message: 'Failed to load album: ' + error.message
          };
        }
      }

  - name: GetPhoto
    kind: HTTP
    method: GET
    pathname: /photo/:id
    code: |+
      import { Photo, PhotoStore } from '#elements';
      import * as Koa from "koa";
      import sanitize from 'sanitize-filename';
      
      /**
       * API endpoint to serve photo files.
       */
      export default async function(request: Koa.Request, response: Koa.Response, ctx: Koa.Context) {
        try {
          const { id } = request.params;
          
          // Get the photo record
          const photo = await Photo.get(id);
          if (!photo) {
            return {
              success: false,
              message: 'Photo not found'
            };
          }
          
          // The storage key is constructed as id-filename
          const storageKey = `${id}-${sanitize(photo.filename)}`;
          
          // Get the photo from storage
          const file = await (await PhotoStore.get(storageKey)).blob();
          
          // Set the appropriate content type
          response.set('Content-Type', photo.contentType);
          
          // Return the photo data
          return Buffer.from(await file.arrayBuffer());
        } catch (error) {
          return {
            success: false,
            message: 'Failed to load photo: ' + error.message
          };
        }
      }

  - name: frontend
    kind: Assets
    items:
      - path: /manager.ejs
        type: text/plain
        content: |
          <!DOCTYPE html>
          <html>
          <head>
            <title>Photo Manager</title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
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
                gap: 15px;
                margin-bottom: 30px;
              }
              .photo-item {
                border: 1px solid #ddd;
                border-radius: 5px;
                padding: 10px;
                position: relative;
              }
              .photo-item img {
                width: 100%;
                height: 150px;
                object-fit: cover;
                cursor: pointer;
              }
              .photo-item .title {
                font-weight: bold;
                margin-top: 8px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
              .photo-item .description {
                font-size: 0.8em;
                margin-top: 4px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
              .photo-item .delete-btn {
                position: absolute;
                top: 15px;
                right: 15px;
                background: rgba(255, 0, 0, 0.7);
                color: white;
                border: none;
                border-radius: 50%;
                width: 25px;
                height: 25px;
                font-size: 12px;
                cursor: pointer;
                display: none;
              }
              .photo-item:hover .delete-btn {
                display: block;
              }
              .photo-item .select-checkbox {
                position: absolute;
                top: 15px;
                left: 15px;
                width: 20px;
                height: 20px;
              }
              .upload-form {
                margin-bottom: 30px;
                padding: 15px;
                border: 1px solid #ddd;
                border-radius: 5px;
                background-color: #f9f9f9;
              }
              .upload-form input, .upload-form textarea {
                margin-bottom: 10px;
                width: 100%;
                padding: 8px;
                border: 1px solid #ddd;
                border-radius: 4px;
              }
              .upload-form button, .create-album-btn {
                background-color: #4CAF50;
                color: white;
                padding: 10px 15px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
              }
              .create-album-form {
                display: none;
                margin-bottom: 30px;
                padding: 15px;
                border: 1px solid #ddd;
                border-radius: 5px;
                background-color: #f9f9f9;
              }
              .album-list {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                gap: 15px;
              }
              .album-item {
                border: 1px solid #ddd;
                border-radius: 5px;
                padding: 15px;
              }
              .album-item h3 {
                margin-top: 0;
              }
              .album-item p {
                font-size: 0.9em;
                color: #666;
              }
              .album-item .album-link {
                display: block;
                margin-top: 10px;
                color: blue;
                text-decoration: none;
              }
              .album-item .album-link:hover {
                text-decoration: underline;
              }
            </style>
          </head>
          <body>
            <h1>Photo Manager</h1>
            
            <!-- Upload Form -->
            <div class="upload-form">
              <h2>Upload New Photo</h2>
              <form id="uploadForm" enctype="multipart/form-data">
                <input type="file" name="photo" accept="image/*" required>
                <input type="text" name="title" placeholder="Title (optional)">
                <textarea name="description" placeholder="Description (optional)"></textarea>
                <button type="submit">Upload</button>
              </form>
            </div>
            
            <!-- Create Album Button -->
            <div style="margin-bottom: 20px;">
              <button id="showCreateAlbumBtn" class="create-album-btn">Create New Album</button>
            </div>
            
            <!-- Create Album Form (initially hidden) -->
            <div id="createAlbumForm" class="create-album-form">
              <h2>Create New Album</h2>
              <form id="albumForm">
                <input type="text" name="name" placeholder="Album Name" required>
                <textarea name="description" placeholder="Album Description (optional)"></textarea>
                <p>Select photos to include in the album using the checkboxes below.</p>
                <button type="submit">Create Album</button>
              </form>
            </div>
            
            <!-- Photo Grid -->
            <h2>Your Photos</h2>
            <div class="photo-grid" id="photoGrid">
              <% if (photos.length === 0) { %>
                <p>No photos uploaded yet.</p>
              <% } else { %>
                <% photos.forEach(photo => { %>
                  <div class="photo-item" data-id="<%= photo.id %>">
                    <input type="checkbox" class="select-checkbox" name="photoIds" value="<%= photo.id %>">
                    <img src="/photo/<%= photo.id %>" alt="<%= photo.title || photo.filename %>">
                    <button class="delete-btn" onclick="deletePhoto('<%= photo.id %>')">✕</button>
                    <div class="title"><%= photo.title || photo.filename %></div>
                    <% if (photo.description) { %>
                      <div class="description"><%= photo.description %></div>
                    <% } %>
                  </div>
                <% }); %>
              <% } %>
            </div>
            
            <!-- Albums List -->
            <h2>Your Albums</h2>
            <div class="album-list" id="albumList">
              <% if (albums.length === 0) { %>
                <p>No albums created yet.</p>
              <% } else { %>
                <% albums.forEach(album => { %>
                  <div class="album-item">
                    <h3><%= album.name %></h3>
                    <p><%= album.description || 'No description' %></p>
                    <p>Contains <%= album.photoIds.length %> photos</p>
                    <p>Created: <%= new Date(album.creationDate).toLocaleDateString() %></p>
                    <a href="/album/<%= album.id %>" class="album-link">View Album</a>
                  </div>
                <% }); %>
              <% } %>
            </div>
            
            <script>
              // Handle file upload
              document.getElementById('uploadForm').addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const formData = new FormData(this);
                
                try {
                  const response = await fetch('/upload', {
                    method: 'POST',
                    body: formData
                  });
                  
                  const result = await response.json();
                  
                  if (result.success) {
                    alert('Photo uploaded successfully');
                    window.location.reload();
                  } else {
                    alert('Upload failed: ' + result.message);
                  }
                } catch (error) {
                  alert('Error uploading photo: ' + error.message);
                }
              });
              
              // Delete a photo
              async function deletePhoto(id) {
                if (confirm('Are you sure you want to delete this photo?')) {
                  try {
                    const response = await fetch(`/photo/${id}`, {
                      method: 'DELETE'
                    });
                    
                    const result = await response.json();
                    
                    if (result.success) {
                      alert('Photo deleted successfully');
                      window.location.reload();
                    } else {
                      alert('Delete failed: ' + result.message);
                    }
                  } catch (error) {
                    alert('Error deleting photo: ' + error.message);
                  }
                }
              }
              
              // Show/hide create album form
              document.getElementById('showCreateAlbumBtn').addEventListener('click', function() {
                const form = document.getElementById('createAlbumForm');
                form.style.display = form.style.display === 'none' || form.style.display === '' ? 'block' : 'none';
              });
              
              // Create a new album
              document.getElementById('albumForm').addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const name = this.elements.name.value;
                const description = this.elements.description.value;
                
                // Get all selected photo IDs
                const checkboxes = document.querySelectorAll('.select-checkbox:checked');
                const photoIds = Array.from(checkboxes).map(cb => cb.value);
                
                if (photoIds.length === 0) {
                  alert('Please select at least one photo for the album');
                  return;
                }
                
                try {
                  const response = await fetch('/album', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                      name,
                      description,
                      photoIds
                    })
                  });
                  
                  const result = await response.json();
                  
                  if (result.success) {
                    alert('Album created successfully');
                    window.location.reload();
                  } else {
                    alert('Failed to create album: ' + result.message);
                  }
                } catch (error) {
                  alert('Error creating album: ' + error.message);
                }
              });
            </script>
          </body>
          </html>

      - path: /album.ejs
        type: text/plain
        content: |
          <!DOCTYPE html>
          <html>
          <head>
            <title><%= album.name %> - Photo Album</title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
              body {
                font-family: Arial, sans-serif;
                max-width: 1200px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f5f5f5;
              }
              header {
                text-align: center;
                margin-bottom: 30px;
              }
              h1 {
                color: #333;
              }
              .album-description {
                color: #666;
                font-style: italic;
                margin-bottom: 20px;
              }
              .photo-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                gap: 20px;
              }
              .photo-item {
                background-color: white;
                border-radius: 8px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                overflow: hidden;
                transition: transform 0.3s ease;
              }
              .photo-item:hover {
                transform: translateY(-5px);
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
              }
              .photo-item img {
                width: 100%;
                height: 200px;
                object-fit: cover;
                cursor: pointer;
              }
              .photo-info {
                padding: 15px;
              }
              .photo-title {
                font-weight: bold;
                margin-bottom: 5px;
              }
              .photo-description {
                font-size: 0.9em;
                color: #666;
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
                background-color: rgba(0,0,0,0.9);
                z-index: 1000;
                justify-content: center;
                align-items: center;
              }
              .lightbox img {
                max-width: 90%;
                max-height: 90%;
              }
              .lightbox-close {
                position: absolute;
                top: 20px;
                right: 20px;
                color: white;
                font-size: 30px;
                cursor: pointer;
              }
            </style>
          </head>
          <body>
            <a href="/" class="back-link">← Back to Photo Manager</a>
            
            <header>
              <h1><%= album.name %></h1>
              <% if (album.description) { %>
                <div class="album-description"><%= album.description %></div>
              <% } %>
              <div>Created on <%= new Date(album.creationDate).toLocaleDateString() %></div>
            </header>
            
            <div class="photo-grid">
              <% if (photos.length === 0) { %>
                <p>This album has no photos.</p>
              <% } else { %>
                <% photos.forEach(photo => { %>
                  <div class="photo-item">
                    <img src="/photo/<%= photo.id %>" alt="<%= photo.title || photo.filename %>" onclick="openLightbox('<%= photo.id %>')">
                    <div class="photo-info">
                      <div class="photo-title"><%= photo.title || photo.filename %></div>
                      <% if (photo.description) { %>
                        <div class="photo-description"><%= photo.description %></div>
                      <% } %>
                    </div>
                  </div>
                <% }); %>
              <% } %>
            </div>
            
            <!-- Lightbox -->
            <div id="lightbox" class="lightbox" onclick="closeLightbox()">
              <span class="lightbox-close">×</span>
              <img id="lightbox-img" src="">
            </div>
            
            <script>
              // Lightbox functionality
              function openLightbox(photoId) {
                const lightbox = document.getElementById('lightbox');
                const lightboxImg = document.getElementById('lightbox-img');
                
                lightboxImg.src = `/photo/${photoId}`;
                lightbox.style.display = 'flex';
                
                // Prevent scrolling when lightbox is open
                document.body.style.overflow = 'hidden';
              }
              
              function closeLightbox() {
                document.getElementById('lightbox').style.display = 'none';
                document.body.style.overflow = 'auto';
              }
              
              // Close lightbox when Escape key is pressed
              document.addEventListener('keydown', function(event) {
                if (event.key === 'Escape') {
                  closeLightbox();
                }
              });
            </script>
          </body>
          </html>

