var connection = new WebSocket('ws://34.209.104.210:45454');

connection.onopen = function() {
    connection.send("noob"); // send master command
};

connection.onerror = function (error) {
};

connection.onclose = function() {
};

connection.onmessage = function (e) {
    var resp = JSON.parse(e.data);
    
    $("#team1players").text(resp.teamOneSize);
    $("#team2players").text(resp.teamTwoSize);

    $("#team1score").text(resp.teamOnePoints);
    $("#team2score").text(resp.teamTwoPoints);
};