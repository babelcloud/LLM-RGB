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
  multer: 1.4.5-lts.1
config: {}
elements:
- name: Photo
  kind: Database
  code: |+
    /**
     * Database schema for storing photo metadata.
     */
    export type PhotoRecord = {
      id: string;        // Unique identifier for the photo
      filename: string;  // Original filename
      title: string;     // User-provided title for the photo
      description: string; // Optional description for the photo
      uploadDate: number; // Timestamp when the photo was uploaded
      contentType: string; // MIME type of the photo (e.g., "image/jpeg")
    }

- name: Album
  kind: Database
  code: |+
    /**
     * Database schema for storing album information.
     */
    export type AlbumRecord = {
      id: string;          // Unique identifier for the album
      name: string;        // User-provided name for the album
      description: string; // Description of the album
      photoIds: string[];  // Array of photo IDs included in this album
      creationDate: number; // Timestamp when the album was created
    }

- name: PhotoStorage
  kind: Storage
  maxFileSize: 10MB
  allowContentTypes:
    - 'image/*'

- name: ManagePhotos
  kind: HTTP
  method: GET
  pathname: /photos
  code: |+
    import { Photo, Album } from '#elements';
    import { frontend } from "#elements";
    import * as Koa from "koa";
    import * as ejs from "ejs";

    /**
     * Renders the main photo management page.
     * This page displays all photos and allows users to upload, delete photos, 
     * and select photos to create albums.
     */
    export default async function(request: Koa.Request, response: Koa.Response, ctx: Koa.Context) {
      const photos = await Photo.list();
      const albums = await Album.list();
      
      const html = ejs.render(await frontend["/manage-photos.ejs"].text(), {
        photos,
        albums
      });
      
      return html;
    }

- name: UploadPhoto
  kind: HTTP
  method: POST
  pathname: /photos/upload
  code: |+
    import * as fs from 'fs';
    import uniqid from 'uniqid';
    import { Photo, PhotoStorage } from '#elements';
    import { type PhotoRecord } from '#elements/Photo';
    import * as Koa from "koa";

    /**
     * Handles photo upload requests.
     * Saves the photo to storage and creates a record in the Photo database.
     */
    export default async function(request: Koa.Request, response: Koa.Response, ctx: Koa.Context) {
      const photo = request.files.photo;
      
      if (!photo) {
        return { error: 'No photo provided' };
      }
      
      const { filepath, originalFilename, mimetype } = photo;
      const buffer = fs.readFileSync(filepath);
      
      // Generate unique ID for the photo
      const photoId = uniqid();
      const storageKey = `${photoId}-${originalFilename}`;
      
      // Save photo to storage
      await PhotoStorage.put(storageKey, new Blob([buffer], { type: mimetype }));
      
      // Create photo record
      const photoRecord: PhotoRecord = {
        id: photoId,
        filename: originalFilename,
        title: request.body.title || originalFilename,
        description: request.body.description || '',
        uploadDate: Date.now(),
        contentType: mimetype
      };
      
      await Photo.set(photoId, photoRecord);
      
      return {
        success: true,
        photo: photoRecord
      };
    }

- name: DeletePhoto
  kind: HTTP
  method: DELETE
  pathname: /photos/:id
  code: |+
    import { Photo, PhotoStorage, Album } from '#elements';
    import { type AlbumRecord } from '#elements/Album';
    import * as Koa from "koa";

    /**
     * Handles photo deletion requests.
     * Removes the photo from storage and all albums that contain it.
     */
    export default async function(request: Koa.Request, response: Koa.Response, ctx: Koa.Context) {
      const photoId = request.params.id;
      
      // Get photo data
      const photo = await Photo.get(photoId);
      if (!photo) {
        return { error: 'Photo not found' };
      }
      
      // Delete photo from storage
      const storageKey = `${photoId}-${photo.filename}`;
      await PhotoStorage.delete(storageKey);
      
      // Remove photo from all albums
      const albums = await Album.list();
      for (const album of albums) {
        if (album.photoIds.includes(photoId)) {
          const updatedPhotoIds = album.photoIds.filter(id => id !== photoId);
          const updatedAlbum: AlbumRecord = {
            ...album,
            photoIds: updatedPhotoIds
          };
          await Album.set(album.id, updatedAlbum);
        }
      }
      
      // Delete photo record
      await Photo.delete(photoId);
      
      return {
        success: true,
        message: 'Photo deleted successfully'
      };
    }

- name: GetPhoto
  kind: HTTP
  method: GET
  pathname: /photos/:id
  code: |+
    import { Photo, PhotoStorage } from '#elements';
    import * as Koa from "koa";

    /**
     * Retrieves and serves a specific photo.
     */
    export default async function(request: Koa.Request, response: Koa.Response, ctx: Koa.Context) {
      const photoId = request.params.id;
      
      // Get photo metadata
      const photo = await Photo.get(photoId);
      if (!photo) {
        return { error: 'Photo not found' };
      }
      
      // Get the photo from storage
      const storageKey = `${photoId}-${photo.filename}`;
      const photoFile = await PhotoStorage.get(storageKey);
      if (!photoFile) {
        return { error: 'Photo file not found' };
      }
      
      const blob = await photoFile.blob();
      
      // Set appropriate content type
      response.set('Content-Type', photo.contentType);
      return Buffer.from(await blob.arrayBuffer());
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
     * Handles album creation requests.
     * Creates a new album with selected photos.
     */
    export default async function(request: Koa.Request, response: Koa.Response, ctx: Koa.Context) {
      const { name, description, photoIds } = request.body;
      
      if (!name) {
        return { error: 'Album name is required' };
      }
      
      if (!photoIds || !Array.isArray(photoIds)) {
        return { error: 'At least one photo must be selected' };
      }
      
      // Generate a unique ID for the album
      const albumId = uniqid();
      
      // Create the album record
      const albumRecord: AlbumRecord = {
        id: albumId,
        name,
        description: description || '',
        photoIds: photoIds,
        creationDate: Date.now()
      };
      
      await Album.set(albumId, albumRecord);
      
      return {
        success: true,
        album: albumRecord,
        shareLink: `/albums/${albumId}`
      };
    }

- name: ManageAlbums
  kind: HTTP
  method: GET
  pathname: /albums
  code: |+
    import { Album } from '#elements';
    import { frontend } from "#elements";
    import * as Koa from "koa";
    import * as ejs from "ejs";

    /**
     * Renders the album management page.
     * Lists all albums and provides options to view or delete them.
     */
    export default async function(request: Koa.Request, response: Koa.Response, ctx: Koa.Context) {
      const albums = await Album.list();
      
      const html = ejs.render(await frontend["/manage-albums.ejs"].text(), {
        albums
      });
      
      return html;
    }

- name: ViewAlbum
  kind: HTTP
  method: GET
  pathname: /albums/:id
  code: |+
    import { Album, Photo } from '#elements';
    import { frontend } from "#elements";
    import * as Koa from "koa";
    import * as ejs from "ejs";

    /**
     * Renders a page to view a specific album.
     * This is the shareable page that can be sent to friends.
     */
    export default async function(request: Koa.Request, response: Koa.Response, ctx: Koa.Context) {
      const albumId = request.params.id;
      
      // Get album data
      const album = await Album.get(albumId);
      if (!album) {
        return { error: 'Album not found' };
      }
      
      // Get photo data for all photos in the album
      const photos = [];
      for (const photoId of album.photoIds) {
        const photo = await Photo.get(photoId);
        if (photo) {
          photos.push(photo);
        }
      }
      
      const html = ejs.render(await frontend["/view-album.ejs"].text(), {
        album,
        photos
      });
      
      return html;
    }

- name: DeleteAlbum
  kind: HTTP
  method: DELETE
  pathname: /albums/:id
  code: |+
    import { Album } from '#elements';
    import * as Koa from "koa";

    /**
     * Handles album deletion requests.
     * Removes the album but keeps the photos.
     */
    export default async function(request: Koa.Request, response: Koa.Response, ctx: Koa.Context) {
      const albumId = request.params.id;
      
      // Check if album exists
      const album = await Album.get(albumId);
      if (!album) {
        return { error: 'Album not found' };
      }
      
      // Delete the album
      await Album.delete(albumId);
      
      return {
        success: true,
        message: 'Album deleted successfully'
      };
    }

- name: frontend
  kind: Assets
  items:
  - path: /manage-photos.ejs
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
          .photo-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 20px;
            margin-top: 20px;
          }
          .photo-card {
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 10px;
            position: relative;
          }
          .photo-card img {
            width: 100%;
            height: 150px;
            object-fit: cover;
          }
          .photo-title {
            margin-top: 10px;
            font-weight: bold;
          }
          .photo-controls {
            margin-top: 10px;
            display: flex;
            justify-content: space-between;
          }
          .upload-form {
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 20px;
            margin-bottom: 20px;
          }
          .album-form {
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 20px;
            margin-top: 30px;
            margin-bottom: 20px;
          }
          .form-group {
            margin-bottom: 15px;
          }
          label {
            display: block;
            margin-bottom: 5px;
          }
          input[type="text"], textarea {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
          }
          button {
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 4px;
            cursor: pointer;
          }
          button.delete {
            background-color: #f44336;
          }
          .nav-links {
            margin-bottom: 20px;
          }
          .nav-links a {
            margin-right: 15px;
            text-decoration: none;
            color: #2196F3;
          }
        </style>
      </head>
      <body>
        <h1>Photo Manager</h1>
        
        <div class="nav-links">
          <a href="/photos">Manage Photos</a>
          <a href="/albums">Manage Albums</a>
        </div>
        
        <div class="upload-form">
          <h2>Upload New Photo</h2>
          <form id="uploadForm" enctype="multipart/form-data">
            <div class="form-group">
              <label for="photo">Select Photo:</label>
              <input type="file" id="photo" name="photo" accept="image/*" required>
            </div>
            <div class="form-group">
              <label for="title">Title:</label>
              <input type="text" id="title" name="title" required>
            </div>
            <div class="form-group">
              <label for="description">Description:</label>
              <textarea id="description" name="description" rows="3"></textarea>
            </div>
            <button type="submit">Upload Photo</button>
          </form>
        </div>
        
        <h2>My Photos (<%= photos.length %>)</h2>
        
        <div class="album-form">
          <h2>Create New Album</h2>
          <form id="albumForm">
            <div class="form-group">
              <label for="albumName">Album Name:</label>
              <input type="text" id="albumName" name="name" required>
            </div>
            <div class="form-group">
              <label for="albumDescription">Description:</label>
              <textarea id="albumDescription" name="description" rows="3"></textarea>
            </div>
            <p>Select photos below to include in the album</p>
            <button type="submit">Create Album</button>
          </form>
        </div>
        
        <div class="photo-grid">
          <% photos.forEach(photo => { %>
            <div class="photo-card" id="photo-<%= photo.id %>">
              <img src="/photos/<%= photo.id %>" alt="<%= photo.title %>">
              <div class="photo-title"><%= photo.title %></div>
              <p><small><%= new Date(photo.uploadDate).toLocaleDateString() %></small></p>
              <div class="photo-controls">
                <input type="checkbox" class="photo-select" data-id="<%= photo.id %>">
                <button class="delete" onclick="deletePhoto('<%= photo.id %>')">Delete</button>
              </div>
            </div>
          <% }); %>
        </div>
        
        <script>
          // Handle photo upload
          document.getElementById('uploadForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            
            try {
              const response = await fetch('/photos/upload', {
                method: 'POST',
                body: formData
              });
              
              const result = await response.json();
              if (result.success) {
                alert('Photo uploaded successfully!');
                window.location.reload();
              } else {
                alert('Error: ' + (result.error || 'Unknown error'));
              }
            } catch (error) {
              alert('Error uploading photo: ' + error.message);
            }
          });
          
          // Handle album creation
          document.getElementById('albumForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get all selected photos
            const selectedPhotoIds = [];
            document.querySelectorAll('.photo-select:checked').forEach(checkbox => {
              selectedPhotoIds.push(checkbox.dataset.id);
            });
            
            if (selectedPhotoIds.length === 0) {
              alert('Please select at least one photo for the album.');
              return;
            }
            
            const formData = new FormData(this);
            const albumData = {
              name: formData.get('name'),
              description: formData.get('description'),
              photoIds: selectedPhotoIds
            };
            
            try {
              const response = await fetch('/albums/create', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(albumData)
              });
              
              const result = await response.json();
              if (result.success) {
                alert(`Album created successfully! Share link: ${window.location.origin}${result.shareLink}`);
                window.location.href = '/albums';
              } else {
                alert('Error: ' + (result.error || 'Unknown error'));
              }
            } catch (error) {
              alert('Error creating album: ' + error.message);
            }
          });
          
          // Handle photo deletion
          async function deletePhoto(photoId) {
            if (confirm('Are you sure you want to delete this photo? This cannot be undone.')) {
              try {
                const response = await fetch(`/photos/${photoId}`, {
                  method: 'DELETE'
                });
                
                const result = await response.json();
                if (result.success) {
                  document.getElementById(`photo-${photoId}`).remove();
                  alert('Photo deleted successfully!');
                } else {
                  alert('Error: ' + (result.error || 'Unknown error'));
                }
              } catch (error) {
                alert('Error deleting photo: ' + error.message);
              }
            }
          }
        </script>
      </body>
      </html>

  - path: /manage-albums.ejs
    type: text/plain
    content: |
      <!DOCTYPE html>
      <html>
      <head>
        <title>Album Manager</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
          }
          .album-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
            margin-top: 20px;
          }
          .album-card {
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 15px;
          }
          .album-title {
            font-size: 1.2em;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .album-info {
            margin-bottom: 15px;
            color: #555;
          }
          .album-controls {
            display: flex;
            justify-content: space-between;
          }
          button {
            padding: 8px 15px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }
          button.view {
            background-color: #2196F3;
            color: white;
          }
          button.delete {
            background-color: #f44336;
            color: white;
          }
          .share-link {
            margin-top: 10px;
            word-break: break-all;
            color: #2196F3;
          }
          .nav-links {
            margin-bottom: 20px;
          }
          .nav-links a {
            margin-right: 15px;
            text-decoration: none;
            color: #2196F3;
          }
        </style>
      </head>
      <body>
        <h1>Album Manager</h1>
        
        <div class="nav-links">
          <a href="/photos">Manage Photos</a>
          <a href="/albums">Manage Albums</a>
        </div>
        
        <h2>My Albums (<%= albums.length %>)</h2>
        
        <div class="album-grid">
          <% albums.forEach(album => { %>
            <div class="album-card" id="album-<%= album.id %>">
              <div class="album-title"><%= album.name %></div>
              <div class="album-info">
                <div><%= album.description %></div>
                <div><small>Created: <%= new Date(album.creationDate).toLocaleDateString() %></small></div>
                <div><small><%= album.photoIds.length %> photos</small></div>
              </div>
              <div class="album-controls">
                <button class="view" onclick="window.location.href='/albums/<%= album.id %>'">View</button>
                <button class="delete" onclick="deleteAlbum('<%= album.id %>')">Delete</button>
              </div>
              <div class="share-link">
                Share link: <a href="/albums/<%= album.id %>" target="_blank"><%= new URL(`/albums/${album.id}`, window.location.origin).href %></a>
              </div>
            </div>
          <% }); %>
        </div>
        
        <script>
          async function deleteAlbum(albumId) {
            if (confirm('Are you sure you want to delete this album? The photos will not be deleted.')) {
              try {
                const response = await fetch(`/albums/${albumId}`, {
                  method: 'DELETE'
                });
                
                const result = await response.json();
                if (result.success) {
                  document.getElementById(`album-${albumId}`).remove();
                  alert('Album deleted successfully!');
                } else {
                  alert('Error: ' + (result.error || 'Unknown error'));
                }
              } catch (error) {
                alert('Error deleting album: ' + error.message);
              }
            }
          }
        </script>
      </body>
      </html>

  - path: /view-album.ejs
    type: text/plain
    content: |
      <!DOCTYPE html>
      <html>
      <head>
        <title><%= album.name %> - Photo Album</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
          }
          .album-header {
            margin-bottom: 30px;
          }
          .album-description {
            color: #555;
            margin-bottom: 15px;
          }
          .photo-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
          }
          .photo-card {
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 10px;
            transition: transform 0.3s;
            cursor: pointer;
          }
          .photo-card:hover {
            transform: scale(1.03);
          }
          .photo-card img {
            width: 100%;
            height: 200px;
            object-fit: cover;
            border-radius: 3px;
          }
          .photo-title {
            margin-top: 10px;
            font-weight: bold;
          }
          .photo-date {
            color: #777;
            font-size: 0.8em;
          }
          .lightbox {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.9);
            z-index: 1000;
            justify-content: center;
            align-items: center;
          }
          .lightbox-content {
            max-width: 90%;
            max-height: 90%;
          }
          .lightbox-content img {
            max-width: 100%;
            max-height: 90vh;
            display: block;
            margin: 0 auto;
          }
          .lightbox-caption {
            color: white;
            text-align: center;
            padding: 10px;
          }
          .close-lightbox {
            position: absolute;
            top: 20px;
            right: 30px;
            color: white;
            font-size: 30px;
            cursor: pointer;
          }
        </style>
      </head>
      <body>
        <div class="album-header">
          <h1><%= album.name %></h1>
          <div class="album-description"><%= album.description %></div>
          <div class="album-date">Created: <%= new Date(album.creationDate).toLocaleDateString() %></div>
        </div>
        
        <div class="photo-grid">
          <% photos.forEach(photo => { %>
            <div class="photo-card" onclick="openLightbox('<%= photo.id %>', '<%= photo.title %>')">
              <img src="/photos/<%= photo.id %>" alt="<%= photo.title %>">
              <div class="photo-title"><%= photo.title %></div>
              <div class="photo-date"><%= new Date(photo.uploadDate).toLocaleDateString() %></div>
            </div>
          <% }); %>
        </div>
        
        <!-- Lightbox -->
        <div id="lightbox" class="lightbox" onclick="closeLightbox()">
          <span class="close-lightbox">&times;</span>
          <div class="lightbox-content" onclick="event.stopPropagation()">
            <img id="lightbox-img" src="" alt="">
            <div id="lightbox-caption" class="lightbox-caption"></div>
          </div>
        </div>
        
        <script>
          function openLightbox(photoId, title) {
            const lightbox = document.getElementById('lightbox');
            const lightboxImg = document.getElementById('lightbox-img');
            const lightboxCaption = document.getElementById('lightbox-caption');
            
            lightboxImg.src = `/photos/${photoId}`;
            lightboxCaption.innerText = title;
            
            lightbox.style.display = 'flex';
            document.body.style.overflow = 'hidden';
          }
          
          function closeLightbox() {
            const lightbox = document.getElementById('lightbox');
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
          }
          
          // Close lightbox when pressing Escape key
          document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
              closeLightbox();
            }
          });
        </script>
      </body>
      </html>

