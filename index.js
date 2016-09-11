var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');
var _ = require('lodash');

var Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/myappdatabase');

// create a schema
var chatSchema = new Schema({
  txt: String,
  created_at: Date
});

var Chat = mongoose.model('Chat', chatSchema);

app.get('/', function(req, res){
  	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){

	// send all messages
	socket.on('get messages', function(msg){
		Chat.find(function (err, messages) {
  			if (err) return console.error(err);
  			io.emit('get messages', messages );
		});
  	});

	// get a message
	socket.on('chat message', function(msg){

		// Add new message to mongodb
		var message = new Chat({ txt: msg });
		message.save(function (err, mess) {
		  if (err) return console.error(err);
		});

		// send back
		io.emit('chat message', msg);
  	});

});

// Start server
http.listen(3000, function(){
  console.log('listening on *:3000');
});
