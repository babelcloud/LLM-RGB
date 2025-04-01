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
# Database to store metadata about each photo
- name: Photo
  kind: Database
  code: |+
    /**
     * Stores metadata for each uploaded photo.
     */
    export type PhotoRecord = {
      id: string;           // Unique identifier for the photo
      originalFilename: string; // Original filename during upload
      contentType: string;  // MIME type of the photo (e.g., 'image/jpeg')
      uploadTimestamp: number; // Timestamp when the photo was uploaded
    }

# Database to store album information
- name: Album
  kind: Database
  code: |+
    /**
     * Stores information about photo albums.
     */
    export type AlbumRecord = {
      id: string;         // Unique identifier for the album
      photoIds: string[]; // Array of photo IDs included in this album
    }

# Storage for the actual photo files
- name: PhotoStore
  kind: Storage
  maxFileSize: 10MB # Limit photo size to 10MB
  allowContentTypes:
  - 'image/*' # Allow only image file types

# Webpage to manage photos (view, upload, delete) and create albums
- name: ManagePhotosPage
  kind: HTTP
  method: GET
  pathname: /manage
  code: |+
    import { Photo } from '#elements';
    import { frontend } from "#elements";
    import * as Koa from "koa";
    import * as ejs from "ejs";
    /**
     * Renders the photo management page (manage.ejs).
     * Fetches all photo records from the Photo database and passes them to the template.
     */
    export default async function(request: Koa.Request, response: Koa.Response, ctx: Koa.Context) {
        const photos = await Photo.list();
        // Sort photos by upload time, newest first
        photos.sort((a, b) => b.uploadTimestamp - a.uploadTimestamp);
        const html = ejs.render(await frontend["/manage.ejs"].text(), { photos });
        return html;
    }

# Webpage to view a specific album
- name: ViewAlbumPage
  kind: HTTP
  method: GET
  pathname: /album/:id
  code: |+
    import { Album, Photo } from '#elements';
    import { frontend } from "#elements";
    import * as Koa from "koa";
    import * as ejs from "ejs";
    /**
     * Renders the album viewing page (album.ejs) for a specific album ID.
     * Fetches the album record and the corresponding photo records.
     */
    export default async function(request: Koa.Request, response: Koa.Response, ctx: Koa.Context) {
        const albumId = request.params.id;
        const album = await Album.get(albumId);
        if (!album) {
            response.status = 404;
            return "Album not found";
        }

        // Fetch details for each photo in the album
        // Note: In a real-world scenario with many photos, consider fetching in batches or optimizing.
        const photoPromises = album.photoIds.map(photoId => Photo.get(photoId));
        const photos = (await Promise.all(photoPromises)).filter(p => p !== null); // Filter out potential nulls if a photo was deleted

        const html = ejs.render(await frontend["/album.ejs"].text(), { photos, albumId });
        return html;
    }

# API endpoint to handle photo uploads
- name: UploadPhoto
  kind: HTTP
  method: POST
  pathname: /upload-photo
  code: |+
    import * as fs from 'fs';
    import uniqid from 'uniqid';
    import { Photo, PhotoStore } from '#elements';
    import { type PhotoRecord } from '#elements/Photo';
    import * as Koa from "koa";
    /**
     * API endpoint to handle photo uploads (HTTP POST /upload-photo).
     * Saves the photo file to PhotoStore and its metadata to the Photo database.
     */
    export default async function(request: Koa.Request, response: Koa.Response, ctx: Koa.Context) {
        const photoFile = request.files.photo;
        if (!photoFile) {
            response.status = 400;
            return { error: "No photo file uploaded." };
        }

        const { filepath, originalFilename, mimetype } = photoFile;
        const buffer = fs.readFileSync(filepath);

        const photoId = uniqid('photo-'); // Generate a unique ID for the photo

        // Store the photo file using its unique ID as the key
        await PhotoStore.put(photoId, new Blob([buffer], { type: mimetype }));

        // Create metadata record
        const newPhoto: PhotoRecord = {
            id: photoId,
            originalFilename: originalFilename || 'untitled',
            contentType: mimetype,
            uploadTimestamp: Date.now(),
        };

        // Save metadata to the database
        await Photo.set(photoId, newPhoto);

        // Redirect back to the management page after successful upload
        response.redirect('/manage');
        return; // Explicit return after redirect
    }

# API endpoint to handle photo deletion
- name: DeletePhoto
  kind: HTTP
  method: DELETE
  pathname: /photos/:id
  code: |+
    import { Photo, PhotoStore, Album } from '#elements';
    import * as Koa from "koa";
    /**
     * API endpoint to delete a photo (HTTP DELETE /photos/:id).
     * Removes the photo file from PhotoStore and its metadata from the Photo database.
     * Also removes the photo ID from any albums it belongs to.
     */
    export default async function(request: Koa.Request, response: Koa.Response, ctx: Koa.Context) {
        const photoId = request.params.id;

        // Check if photo exists before attempting deletion
        const photo = await Photo.get(photoId);
        if (!photo) {
             response.status = 404;
             return { error: 'Photo not found' };
        }

        // Delete the photo file from storage
        try {
            await PhotoStore.delete(photoId);
        } catch (error) {
            // Log error but continue to attempt DB deletion
            console.error(`Error deleting photo ${photoId} from storage:`, error);
        }

        // Delete the photo metadata from the database
        await Photo.delete(photoId);

        // Remove the photo ID from all albums that contain it
        const albums = await Album.list();
        for (const album of albums) {
            const index = album.photoIds.indexOf(photoId);
            if (index > -1) {
                album.photoIds.splice(index, 1);
                // Update the album record in the database
                await Album.set(album.id, album);
            }
        }

        return { message: 'Photo deleted successfully' };
    }

# API endpoint to create a new album
- name: CreateAlbum
  kind: HTTP
  method: POST
  pathname: /create-album
  code: |+
    import uniqid from 'uniqid';
    import { Album } from '#elements';
    import { type AlbumRecord } from '#elements/Album';
    import * as Koa from "koa";
    /**
     * API endpoint to create a new album (HTTP POST /create-album).
     * Expects an array of 'photoIds' in the request body.
     * Generates a unique album ID and saves the album record.
     */
    export default async function(request: Koa.Request, response: Koa.Response, ctx: Koa.Context) {
        const photoIds = request.body.photoIds;

        if (!Array.isArray(photoIds) || photoIds.length === 0) {
            response.status = 400;
            return { error: "No photo IDs provided or invalid format." };
        }

        // Ensure all provided photo IDs are strings (basic validation)
        if (!photoIds.every(id => typeof id === 'string')) {
             response.status = 400;
             return { error: "Invalid photo IDs provided." };
        }

        const albumId = uniqid('album-'); // Generate a unique ID for the album

        const newAlbum: AlbumRecord = {
            id: albumId,
            photoIds: photoIds,
        };

        // Save the new album record to the database
        await Album.set(albumId, newAlbum);

        // Return the unique link to the newly created album
        const albumLink = `/album/${albumId}`;
        return {
             message: 'Album created successfully',
             albumLink: albumLink
        };
    }

# API endpoint to serve a photo image file
- name: GetPhotoImage
  kind: HTTP
  method: GET
  pathname: /photos/image/:id
  code: |+
    import { Photo, PhotoStore } from '#elements';
    import * as Koa from "koa";
    /**
     * API endpoint to serve a specific photo image file (HTTP GET /photos/image/:id).
     * Fetches the photo metadata to get the content type and then streams the file from PhotoStore.
     */
    export default async function(request: Koa.Request, response: Koa.Response, ctx: Koa.Context) {
        const photoId = request.params.id;

        // Get photo metadata to determine content type
        const photo = await Photo.get(photoId);
        if (!photo) {
            response.status = 404;
            return "Photo metadata not found";
        }

        try {
            // Retrieve the photo blob/buffer from storage using the photo ID
            const fileData = await PhotoStore.get(photoId);
            if (!fileData) {
                 response.status = 404;
                 return "Photo file not found in storage";
            }
            const fileBlob = await fileData.blob();

            // Set the correct Content-Type header based on stored metadata
            response.set('Content-Type', photo.contentType);
            // Set Cache-Control headers for better performance
            response.set('Cache-Control', 'public, max-age=31536000, immutable');

            // Return the image buffer
            return Buffer.from(await fileBlob.arrayBuffer());
        } catch (error) {
            console.error(`Error retrieving photo ${photoId}:`, error);
            response.status = 500;
            return "Error retrieving photo";
        }
    }

# Frontend asset files (EJS templates)
- name: frontend
  kind: Assets
  items:
  - path: /manage.ejs # Template for the photo management page
    type: text/plain # Use text/plain for EJS source
    content: |
      <!DOCTYPE html>
      <html>
      <head>
          <title>Manage Photos</title>
          <style>
              body { font-family: sans-serif; margin: 20px; }
              h1, h2 { color: #333; }
              .photo-gallery { display: flex; flex-wrap: wrap; gap: 15px; margin-bottom: 30px; }
              .photo-item { border: 1px solid #ccc; padding: 10px; border-radius: 5px; background-color: #f9f9f9; text-align: center; }
              .photo-item img { max-width: 150px; max-height: 150px; display: block; margin-bottom: 10px; }
              .photo-item label { font-size: 0.9em; }
              .upload-form, .create-album-form { margin-bottom: 30px; padding: 15px; border: 1px solid #ddd; border-radius: 5px; background-color: #f0f0f0; }
              button { padding: 8px 15px; cursor: pointer; margin-left: 5px; }
              .delete-btn { background-color: #f44336; color: white; border: none; border-radius: 3px; }
              .create-album-btn { background-color: #4CAF50; color: white; border: none; border-radius: 3px; }
              #albumLinkContainer { margin-top: 15px; font-weight: bold; }
              #albumLink a { color: #007bff; text-decoration: none; }
              #albumLink a:hover { text-decoration: underline; }
          </style>
      </head>
      <body>
          <h1>Photo Management</h1>

          <!-- Upload Form -->
          <div class="upload-form">
              <h2>Upload New Photo</h2>
              <form action="/upload-photo" method="post" enctype="multipart/form-data">
                  <input type="file" name="photo" accept="image/*" required>
                  <button type="submit">Upload</button>
              </form>
          </div>

          <!-- Photo Gallery & Album Creation -->
          <h2>My Photos</h2>
          <form id="albumForm">
              <div class="photo-gallery">
                  <% if (photos.length === 0) { %>
                      <p>No photos uploaded yet.</p>
                  <% } else { %>
                      <% photos.forEach(photo => { %>
                          <div class="photo-item">
                              <img src="/photos/image/<%= photo.id %>" alt="<%= photo.originalFilename %>">
                              <input type="checkbox" name="photoIds" value="<%= photo.id %>" id="photo-<%= photo.id %>">
                              <label for="photo-<%= photo.id %>"><%= photo.originalFilename %></label><br>
                              <button type="button" class="delete-btn" onclick="deletePhoto('<%= photo.id %>')">Delete</button>
                          </div>
                      <% }); %>
                  <% } %>
              </div>

              <% if (photos.length > 0) { %>
                  <div class="create-album-form">
                      <button type="button" class="create-album-btn" onclick="createAlbum()">Create Album from Selected</button>
                      <div id="albumLinkContainer" style="display: none;">
                          Album created! Share this link: <span id="albumLink"></span>
                      </div>
                  </div>
              <% } %>
          </form>

          <script>
              // Function to delete a photo
              async function deletePhoto(photoId) {
                  if (!confirm('Are you sure you want to delete this photo? It will also be removed from any albums.')) {
                      return;
                  }
                  try {
                      const response = await fetch(`/photos/${photoId}`, {
                          method: 'DELETE'
                      });
                      const result = await response.json();
                      if (response.ok) {
                          alert(result.message || 'Photo deleted successfully!');
                          window.location.reload(); // Reload the page to reflect changes
                      } else {
                          alert('Error deleting photo: ' + (result.error || 'Unknown error'));
                      }
                  } catch (error) {
                      console.error('Error:', error);
                      alert('An error occurred while trying to delete the photo.');
                  }
              }

              // Function to create an album
              async function createAlbum() {
                  const form = document.getElementById('albumForm');
                  const formData = new FormData(form);
                  const selectedPhotoIds = formData.getAll('photoIds'); // Gets all checked photo IDs

                  if (selectedPhotoIds.length === 0) {
                      alert('Please select at least one photo to create an album.');
                      return;
                  }

                  try {
                      const response = await fetch('/create-album', {
                          method: 'POST',
                          headers: {
                              'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({ photoIds: selectedPhotoIds })
                      });
                      const result = await response.json();
                      if (response.ok) {
                          const linkContainer = document.getElementById('albumLinkContainer');
                          const linkSpan = document.getElementById('albumLink');
                          linkSpan.innerHTML = `<a href="${result.albumLink}" target="_blank">${window.location.origin}${result.albumLink}</a>`;
                          linkContainer.style.display = 'block';
                          alert(result.message || 'Album created!');
                          // Optionally clear checkboxes after creation
                          form.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => cb.checked = false);
                      } else {
                          alert('Error creating album: ' + (result.error || 'Unknown error'));
                      }
                  } catch (error) {
                      console.error('Error:', error);
                      alert('An error occurred while trying to create the album.');
                  }
              }
          </script>
      </body>
      </html>
  - path: /album.ejs # Template for viewing a specific album
    type: text/plain
    content: |
      <!DOCTYPE html>
      <html>
      <head>
          <title>Photo Album</title>
           <style>
              body { font-family: sans-serif; margin: 20px; }
              h1 { color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px; }
              .album-gallery { display: flex; flex-wrap: wrap; gap: 15px; margin-top: 20px; }
              .album-photo { border: 1px solid #ccc; padding: 10px; border-radius: 5px; background-color: #f9f9f9; text-align: center; }
              .album-photo img { max-width: 250px; max-height: 250px; display: block; margin-bottom: 5px; }
              .album-photo p { font-size: 0.9em; color: #555; margin: 0; }
          </style>
      </head>
      <body>
          <h1>Album View</h1>
          <div class="album-gallery">
              <% if (photos.length === 0) { %>
                  <p>This album is empty or the photos could not be loaded.</p>
              <% } else { %>
                  <% photos.forEach(photo => { %>
                      <div class="album-photo">
                          <img src="/photos/image/<%= photo.id %>" alt="<%= photo.originalFilename %>">
                          <p><%= photo.originalFilename %></p>
                      </div>
                  <% }); %>
              <% } %>
          </div>
          <p><a href="/manage">Back to Photo Management</a></p>
      </body>
      </html>

