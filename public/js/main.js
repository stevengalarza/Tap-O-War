var connection = new WebSocket('ws://54.227.222.163:45454');
//var connection = new WebSocket('ws://127.0.0.1:45454');
var colorEnabled = false;
var timer = -1;

connection.onopen = function() {
    connection.send("noob"); // send master command
};

connection.onerror = function (error) {
};

connection.onclose = function() {
};

connection.onmessage = function (e) {
    switch (e.data) {
        case "red":
        case "yellow":
        case "blue":
        case "green":
            if (timer == -1) {
                timer = 45;
                var timerInterval = setInterval(function() {
                    timer--;
                    $("#time").text("Time: 0:" + (timer < 10 ? "0" : "") + timer); // cheap haxs tbh
                    if (timer < 10) {
                        $("#time").css("color", "red");
                    }
                    if (timer < 1) {
                        clearInterval(timerInterval);
                    }
                }, 1000);
            }
            $("#colortap").css("background-color", e.data);
        return;
    }
    var resp = JSON.parse(e.data);
    
    $("#team1players").text(resp.teamOneSize);
    $("#team2players").text(resp.teamTwoSize);

    $("#team1score").text(resp.teamOnePoints);
    $("#team2score").text(resp.teamTwoPoints);
};

// Lazy at this point
$("#colortap").click(function() {
    if (!colorEnabled && connection && connection.readyState == 1) {
        connection.send("startcolor");
        colorEnabled = true;
    }
});