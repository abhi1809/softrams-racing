const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const hsts = require('hsts');
const path = require('path');
const xssFilter = require('x-xss-protection');
const nosniff = require('dont-sniff-mimetype');
const request = require('request');
const fs = require('fs');

const data =  fs.readFileSync('db.json');
const mydata = JSON.parse(data);

var port = process.env.PORT || 8000;
const app = express();

app.use(cors());
app.use(express.static('assets'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.disable('x-powered-by');
app.use(xssFilter());
app.use(nosniff());
app.set('etag', false);
app.use(
  helmet({
    noCache: true
  })
);
app.use(
  hsts({
    maxAge: 15552000 // 180 days in seconds
  })
);

app.use(
  express.static(path.join(__dirname, 'src'), {
    etag: false
  })
);


app.get('/members', (req, res) => {
  request('http://localhost:3000/members', (err, response, body) => {
    if (response.statusCode <= 500) {
      res.send(body);
    }
  });
});

app.get('/teams', (req, res) => {
  request('http://localhost:3000/teams', (err, response, body) => {
    if (response.statusCode <= 500) {
      res.send(body);
    }
  });
});

app.post('/members', (req, res) => {
  const data = fs.readFileSync('db.json');

  const teams = JSON.parse(data);

  teams.members.push(req.body);

  const stringifyTeams = JSON.stringify(teams, null, 2);
  fs.writeFile('db.json', stringifyTeams, finished);
  function finished(err) {
    console.log("ADDED!!!");
  }
  res.json(teams.members);
});

app.put('/members/:id', (req, res) => {
  //Read json data from db.json
  const data = fs.readFileSync('db.json');
  //Parsing json
  const teams = JSON.parse(data);
  //replacing member to json file
  index = teams.members.findIndex(x => x.id == req.params.id);
  teams.members.splice(index,1, req.body);
  const stringifyTeams = JSON.stringify(teams, null, 2);
  fs.writeFile('db.json', stringifyTeams, finished);
  function finished(err) {
    console.log("EDITED");
  }
  res.status(200).json(teams.members);
})

app.delete('/members/:id', (req, res) => {
  //Getting json data from db.json
  const data = fs.readFileSync('db.json');
  //Parsing json
  const teams = JSON.parse(data);
  //Deleting member fron json file
  index = teams.members.findIndex(x => x.id == req.params.id);
  teams.members.splice(index,1);
  const stringifyTeams = JSON.stringify(teams, null, 2);
  fs.writeFile('db.json', stringifyTeams, finished);
  function finished(err) {
    console.log("DELETED");
  }
  res.status(200).json(teams.members);
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/index.html'));
});

app.listen(port, () => {
  console.log('Vrrrum Vrrrum! Server starting!');
});
