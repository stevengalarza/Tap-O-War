var connection;
var team;

var feedback;
var currentColor = "";
var colors = ["red", "green", "blue", "yellow"];

$(function() {
    feedback = $("#feedback");

    var clickTouch = ("ontouchstart" in window) ? 'touchstart' : 'click';
    $(".square").on(clickTouch, function(e) {
        e.preventDefault();
        if (currentColor == "") {
            return;
        }
        poke($(this).children(".butt").hasClass(currentColor) ? "" : "bad");
    });
    $("#join-btn").click(function() {
        feedback.text("Joining...");
        try {
            connect($("#gameCode").val());
        } catch (err) {
            feedback.text("An unexpected error happened.");
        }
    });
});



function connect(code) {
    currentColor = "";
    connection = new WebSocket('ws://54.227.222.163:45454');
    //connection = new WebSocket('ws://127.0.0.1:45454');

    connection.onopen = function() {
        connection.send("join=" + code);
    };

    connection.onerror = function (error) {
        feedback.text("An error occurred when attempting to join!");
        connection = null;
    };

    connection.onclose = function() {
        connection = null;
        onGameDisconnect();
    }

    connection.onmessage = function (e) {
        var resp = e.data;
        switch (resp) {
            case "unabletojoin":
                team = -1;
                feedback.text("Invalid code entered!");
            break;
            case "team0":
                team = 1;
            break;
            case "team1":
                team = 2;
            break;
            case "red":
            case "green":
            case "blue":
            case "yellow":
                currentColor = resp;
                shuffleColors();
                $(".butt").removeClass("red blue yellow green");
                $(".butt").each(function(index, element) {
                    $(this).addClass(colors[index]);
                });
            break;
        }
        if (team != -1) {
            $("#teamnumber").text(team);
            $("#join").hide();
            $("#game").show();
            $("#gameCode").val("");
        }
    };
}

function onGameDisconnect() {
    $("#join").show();
    $("#game").hide();
    feedback.text("Game not in session.");
}


function poke(param) {
    connection.send(param + "poke");
}

function shuffleColors() {
    for (var i = colors.length - 1; i > 0; i--) {
        var tempIdx = Math.floor(Math.random() * (i + 1));
        var temp = colors[i];
        colors[i] = colors[tempIdx];
        colors[tempIdx] = temp;
    }
}