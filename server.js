// server.js - Backend API
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const mqtt = require('mqtt');
const cors = require('cors');

const app = express();
const PORT = 3000;
app.use(cors());
app.use(express.json());

// SQLite Database setup
const db = new sqlite3.Database('sensor_data.db', (err) => {
    if (err) console.error('Error opening database', err);
    else console.log('Connected to SQLite database');
});

db.run(`CREATE TABLE IF NOT EXISTS sensor (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    temperature REAL,
    humidity REAL
)`);

// MQTT Client Setup
const mqttClient = mqtt.connect('ws://157.173.101.159:9001');

mqttClient.on('connect', () => {
    console.log("Connected to MQTT Broker");
    mqttClient.subscribe("/work_group_01/room_temp/temperature");
    mqttClient.subscribe("/work_group_01/room_temp/humidity");
});

let temp = null, humidity = null;

mqttClient.on('message', (topic, message) => {
    const value = parseFloat(message.toString());
    if (topic.includes("temperature")) temp = value;
    if (topic.includes("humidity")) humidity = value;

    if (temp !== null && humidity !== null) {
        db.run(`INSERT INTO sensor (temperature, humidity) VALUES (?, ?)`, [temp, humidity], (err) => {
            if (err) console.error('Error inserting data', err);
        });
        temp = null; humidity = null;
    }
});

// API to get averaged data every 5 minutes
app.get('/data', (req, res) => {
    db.all(`SELECT strftime('%Y-%m-%d %H:%M', timestamp) as time,
                   AVG(temperature) as avg_temp,
                   AVG(humidity) as avg_humidity
            FROM sensor
            GROUP BY time
            ORDER BY time DESC
            LIMIT 50`, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
