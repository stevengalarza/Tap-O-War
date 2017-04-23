
var express = require("express");
var webSocket = require("nodejs-websocket");
var cors = require("cors");

var app = express();

var players = [];

var teamSizes = [0, 0];
var teamPoints = [0, 0];

var viewDir = __dirname + '/views/';

var code = "noob";// generateCode();
var masterCommand = "noob";
var masterConnection;
var masterTimer;

// Configure express

app.use(cors());
app.set('views', viewDir);
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public/'));

app.get('/game', function(req, res){
  res.render('index.ejs', {code: code});
});

app.listen(80, function(){
	console.log("HTTP Server online");
});


// Configure web socket
var server = webSocket.createServer(function(conn) {
    conn.on("text", function (str) {
        if (str === masterCommand) {
            masterConnection = conn;
            if (masterTimer) {
                clearInterval(masterTimer);
            }
            masterTime = setInterval(function() {
            conn.sendText(JSON.stringify({ 
                teamOneSize: teamSizes[0],
                teamTwoSize: teamSizes[1],
                teamOnePoints: teamPoints[0],
                teamTwoPoints: teamPoints[1]
            }));
            }, 300);
        }
        if (str.startsWith("join=")) {
            str = str.substring("join=".length);
            if (str === code) {
                conn.playerTeam = findTeam();
                conn.sendText("team" + conn.playerTeam);
            } else {
                conn.sendText("unabletojoin");
            }
        }
        if (str === "poke") {
            poke(conn);
        }
    });
    conn.on("error", function(err) {
        if (masterConnection == conn && masterTime) {
            clearInterval(masterTime);
            masterTime = null;
        }
    });
    conn.on("close", function (code, reason) {
        if (conn) {
            teamSizes[conn.playerTeam]--;
        }
        if (masterConnection == conn && masterTime) {
            clearInterval(masterTime);
            masterTime = null;
        }
    });
});

server.listen(45454, function() {
    console.log("Web server online");
});

function poke(conn) {
     teamPoints[conn.playerTeam]++;
}

function findTeam() {
    var team = (teamSizes[0] == 0 || teamSizes[0] < teamSizes[1]) ? 0 : 1;
    teamSizes[team]++;
    return team;
}

function generateCode() {
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var code = "";
    for(var i = 0; i < 5; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
}