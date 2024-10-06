const express = require('express');
const {open} = require('sqlite');
const sqlite3 = require('sqlite3');
const shortid = require('shortid');
const cors = require('cors');
const app = express();
const PORT = 5000;
const path = require('path');
const userAgent = require('user-agent');

dotenv.config();

const filepath = path.join(__dirname,'database.db');

// Middleware for parsing JSON
app.use(express.json());
app.use(cors());

// Create SQLite database
let db = null;
const connectdb = async() => {
  try{
    db = await open({
      filename : filepath,
      driver : sqlite3.Database
    });
    // Start the server
    app.listen(env.process.PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  }
  catch(error){
    console.log(error);
  }

}
connectdb();

const createTable = async() => {
  const query = `CREATE TABLE urls 
  (id INTEGER PRIMARY KEY AUTOINCREMENT,original_url TEXT NOT NULL,short_code VARCHAR(10) NOT NULL,created_at DATE);`
  try{
    await db.run(query);
    console.log('DB Created');
  }
  catch(error){
    console.log('Table not created');
  }
}

const generateRandomStringHelper = (length) => {
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  
  for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
  }
  return result;
}

function generateRandomString(len,arr){
  let result = generateRandomStringHelper(len);
  const check = arr.some(element => element === result);
  if(check) {
    result = generateRandomStringHelper(len);
  }
  return result;
}


// API to shorten a URL
app.post('/shorten', async(req, res) => {
  const { original_url } = req.body;

  if (!original_url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  if(original_url.includes(`localhost:${PORT}/r`)){
    return res.status(400).json({error: 'Try Another Domain'})
  }

  const length = 5; // custom length

  try{
    const data = await db.get(`SELECT * FROM urls WHERE original_url = ?`,[original_url]);
    if(data){
      return res.json({short_url : `http://localhost:${PORT}/r/${data.short_code}`});
    }
    const arr = await db.all(`SELECT short_code FROM urls`);
    const short_code = generateRandomString(length,arr);

    const query = `INSERT INTO urls (original_url, short_code, created_at) VALUES (?, ?, ?)`;
    const date = new Date();//present date
    const formtDate = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;//date formatting
    await db.run(query, [original_url, short_code,formtDate]);
    res.json({ short_url: `http://localhost:${PORT}/r/${short_code}` })
  }
  catch(error){
    return res.status(500).json({ error: 'Failed to shorten URL' });
  }
});

// API for redirecting to original URL
app.get('/r/:short_code', async(req, res) => {
  const { short_code } = req.params;
  const user_ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const agent = userAgent.parse(req.headers['user-agent']);
  const deviceType = (agent && agent.device && agent.device.type) ? agent.device.type : 'desktop';


  const query = `SELECT * FROM urls WHERE short_code = ?`;
    try{
      const data = await db.get(query, [short_code]);
      await updateTracking(data.id,user_ip,deviceType);
      res.redirect(data.original_url);
    }
    catch(error) {
      return res.status(404).json({ error: 'URL not found' });
    }
  }
);

app.get('/:short_code', async (req, res) => {
  const { short_code } = req.params;

  try {
    // Get the original URL and short code ID
    let query = `SELECT * FROM urls WHERE short_code = ?;`;
    const output = await db.get(query, [short_code]);

    // Check if the output is undefined (i.e., no matching short code found)
    if (!output) {
      return res.status(404).json({ error: 'Short code not found' });
    }

    const originalUrl = output.original_url;
    const shortCodeId = output.id;

    // Get total visit count
    query = `SELECT COUNT(*) AS total FROM analytics WHERE short_code_id = ?;`;
    const totalVisitCount = await db.get(query, [shortCodeId]);

    // Get unique visit count
    query = `SELECT COUNT(DISTINCT visiter_id) AS uniqueCount FROM analytics WHERE short_code_id = ?;`;
    const uniqueVisitCount = await db.get(query, [shortCodeId]);

    // Get device type counts
    query = `SELECT device_type AS deviceTypes, COUNT(*) AS count FROM analytics WHERE short_code_id = ? GROUP BY device_type;`;
    const deviceTypeVisits = await db.all(query, [shortCodeId]);

    // Get average visits per hour
    query = `SELECT AVG(visits_per_hour) AS avgVisitsPerHour
              FROM (
                SELECT COUNT(*) AS visits_per_hour
                FROM analytics
                WHERE short_code_id = ?
                GROUP BY strftime('%Y-%m-%d %H', visit_time)
              );`;
    const avgPerHourData = await db.get(query, [shortCodeId]);
    const avgVisitsPerHour = avgPerHourData ? avgPerHourData.avgVisitsPerHour : 0; // Handle potential null result

    // Get average visits per day
    query = `SELECT AVG(visits_per_day) AS avgVisitsPerDay
              FROM (
                SELECT COUNT(*) AS visits_per_day
                FROM analytics
                WHERE short_code_id = ?
                GROUP BY strftime('%Y-%m-%d', visit_time)
              );`;
    const avgPerDayData = await db.get(query, [shortCodeId]);
    const avgVisitsPerDay = avgPerDayData ? avgPerDayData.avgVisitsPerDay : 0; // Handle potential null result

    // Send the response
    res.json({
      deviseTypeVisits: deviceTypeVisits,
      originalUrl: originalUrl,
      visitersCount: totalVisitCount.total, // Get count from object
      uniqueVisiters: uniqueVisitCount.uniqueCount, // Get unique count from object
      avgVisitsPerDay: avgVisitsPerDay ?? 0,
      avgVisitsPerHour: avgVisitsPerHour ?? 0
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to retrieve analytics data' });
  }
});


const createAnalyticsTable = async() => {
  try{
    let query = `CREATE TABLE user_address (
      user_id INTEGER PRIMARY KEY AUTOINCREMENT,
      ip_address VARCHAR(200) NOT NULL
    );`
    await db.run(query);

    query = `CREATE TABLE analytics(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      short_code_id INTEGER,
      visiter_id INTEGER,
      device_type TEXT CHECK(device_type IN ('mobile','desktop','tablet')),
      visit_time DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (short_code_id) REFERENCES urls(id),
      FOREIGN KEY (visiter_id) REFERENCES user_address(user_id)
    );`
    await db.run(query);
    console.log('table created');
  }
  catch(error){
    return res.status(500).json({error : 'Connection Failed'});
  }
}


const updateTracking = async(urlId,user_ip,deviceType) => {
  let user_ip_id = await checkUser(user_ip);
  if(! user_ip_id){
    const query = `INSERT INTO user_address (ip_address) VALUES (?) ;`
    const result = await db.run(query,[user_ip]);
    user_ip_id = result.lastID;
  }

  const query = `INSERT INTO analytics (short_code_id,visiter_id,device_type) VALUES (?,?,?);`
  await db.run(query,[urlId,user_ip_id,deviceType]);
  console.log('new Entry Registered');
}


const checkUser = async(ip) => {
  const query = `SELECT user_id FROM user_address WHERE ip_address = ?;`
  const data = await db.get(query,[ip]);
  return data;
}