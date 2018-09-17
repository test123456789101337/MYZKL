/*require('dotenv').config();
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
const getGithub=require("./get-github");
//const getJira=require("./get-jira")
// WARNING: app.listen(80) will NOT work here!
//app.listen('3000');
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  //socket.on('ping', function (data) {
    getGithub();
    //getJira();
    console.log("I did it!");
   // console.log(data);
 // });
}); 
io.on('disconnect',()=>{
  server.close();
  console.log('Disconnected!');
});
//app.listen(3002);
server.listen(5000, function(){ console.log("It's working?")});
//"uws": "~9.14.0",*/

var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
const getGithub=require("./get-github");
const getJira=require("./get-jira");
app.listen(3002);
server.listen(3001);
// WARNING: app.listen(80) will NOT work here!

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  console.log('Iz connected');
  getGithub();
  //getJira();
  socket.emit('connected', 'Server connected');
  
});


function update(){
  io.emit('update', 'Update databases, fetch new data from APIs and refresh the page with new data.');
  
  setTimeout(update, 10000);
}
update();
