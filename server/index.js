const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const ROCKET_CHAT_HOST = 'http://localhost:3000';
const ROCHET_CHAT_API_PATH = 'api/v1';

function getResourceUrl(resource) {
  return `${ROCKET_CHAT_HOST}/${ROCHET_CHAT_API_PATH}/${resource}`;
}

// CORS in case you need
app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*'); // this should be rocket.chat URL
  res.set('Access-Control-Allow-Headers', '*');
  res.set('Access-Control-Allow-Credentials', 'true');
  next();
});

// API Gateway for clients
app.post('/register', async (req, res) => {
  //Handle registration for Aplication
  // ...

  // Handle registration for Rocket.Chat server
  const { username, password: pass } = req.body;
  const email = `${username}@email.com`;

  try {
    await axios.post(getResourceUrl('users.register'), {
      username,
      email,
      pass,
      name: 'User '.concat(username),
    });
    res.sendStatus(201);
  } catch (err) {
    if (err.response) {
      res.statusCode = 400;
      res.send(err.response.data);
    } else {
      throw err;
    }
  }
});

app.post('/login', async (req, res) => {
  //Handle login for Aplication
  // ...

  // Handle login for Rocket.Chat server
  const { username, password: pass } = req.body;
  try {
    const response = await axios.post(getResourceUrl('login'), {
      username,
      password: pass,
    });
    res.send(response.data.data);
  } catch (err) {
    if (err.response) {
      res.statusCode = 400;
      res.send(err.response.data);
    } else {
      throw err;
    }
  }
});

app.get('/roomUrl', async (req, res) => {
  try {
    const authToken = req.get('X-Auth-Token');
    const userId = req.get('X-User-Id');
    const response = await axios.get(getResourceUrl('rooms.get'), {
      headers: { 'X-Auth-Token': authToken, 'X-User-Id': userId },
    });
    // we assume that user belongs to only one channel just for sake of this demo
    const data = response.data.update;
    if (!data || data.length === 0) {
      res.sendStatus(404);
      return;
    }
    const roomName = data[0].name;
    const groupOrChannel = data[0]._id === 'GENERAL' ? 'channel' : 'group';
    res.send({
      url: `${ROCKET_CHAT_HOST}/${groupOrChannel}/${roomName}?layout=embedded`,
    });
  } catch (err) {
    if (err.response) {
      res.statusCode = 400;
      res.send(err.response.data);
    } else {
      throw err;
    }
  }
});

app.listen(3030, function () {
  console.log('Example app listening on port 3030!');
});
