MQTT Weather Station

This project collects temperature and humidity data via MQTT, stores it in an SQLite database, and displays it in real-time graphs using Chart.js.
Setup Instructions
1. Install Node.js

Make sure you have Node.js installed. If not, download it from:
https://nodejs.org
2. Clone the Repository

Run this command in your terminal:
git clone https://github.com/your-username/mqtt-weather-station.git
cd mqtt-weather-station
3. Install Dependencies

Inside the project folder, run:
npm install express sqlite3 mqtt cors
4. Start the Server

Run the following command to start the backend:
node server.js

This will store MQTT data in SQLite and provide an API.
5. Open the Frontend

    Open public/index.html in a browser.
    You will see live temperature & humidity readings in a graph.

How It Works

    The Node.js server connects to an MQTT broker and listens for data.
    The data is saved in SQLite every few seconds.
    The frontend fetches and displays the last 5-minute average values.

Testing

To test, send MQTT messages manually using:
mosquitto_pub -h broker.hivemq.com -t "/work_group_01/room_temp/temperature" -m "25.3"
mosquitto_pub -h broker.hivemq.com -t "/work_group_01/room_temp/humidity" -m "55"

Or fetch data from the API:
curl http://localhost:3000/data
