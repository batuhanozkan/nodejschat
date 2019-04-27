


$(function(){

   	//make connection
	var socket = io.connect('http://localhost:3000')

	//buttons and inputs
	var message = $("#message")
	var username = $("#username")
	var send_message = $("#send_message")
	var send_message1 = $("#send_message1")
	var send_username = $("#send_username")
	var chatroom = $("#chatroom")
	var feedback = $("#feedback")
	var kullan = $("#kullan")
	var baslik =$("#baslik")
	//var uyeler = $(".uyeler")
	//var users = $("#veri");
	var su;
	var ka;
		//kullan.append("<li>"+users[1].text()+"</li>")
	

 

	//Emit message
	send_message.click(function(){
		console.log("geldi");
		socket.emit('new_message', {message : message.val()})
	})

	send_message1.click(function(){
		// console.log("geldi"+su)
		 socket.emit('private_message1', {username:su,message : message.val(),gonderen:ka1})
		//baslik.text(su)
	})
	var ka1;
	$('li[id^="uyeler"]').on('click', function() {
		//kullan.append("<li>"+$(this).text()+"</li>");
		// socket.emit('private_message', {alan : $(this).text()})
		// su=$(this).text()
		// console.log("su "+su)

		baslik.text($(this).text()+"ile özel sohbet")
		su=$(this).text()
		send_message.hide()
		send_message1.show()
		ka1=ka
	})
	socket.on("kullaniciadi", (data) => {
		ka=data.username;
	})
	

	//Listen on new_message
	socket.on("new_message1", (data) => {
		feedback.html('');
		message.val('');
		chatroom.append("<div id=container> 	<p class='message'>" + data.username + ": " + data.message + "</p>  </div>")
		//kullan.append("<li>"+name.username +"</li>");
	})

	socket.on("new_message2", (data) => {
		feedback.html('');
		message.val('');
		//kullan.append("<li>"+name.username +"</li>");
		chatroom.append("<div id=container> 	<p class='message2'>" + data.username  + ": " + data.message + "</p>  </div>")
	})
	
	socket.on("private_message2", (data) => {
	 	feedback.html('');
	 	message.val('');
		//kullan.append("<li>"+name.username +"</li>");
	 	chatroom.append("<div id=container> 	<p class='message2'>" + data.gonderen  + " sana özelden yazdı: " + data.message + "</p>  </div>")
	
	})

	//Emit a username
	send_username.click(function(){
		socket.emit('change_username', {username : username.val()})
	})

	//Emit typing
	message.bind("keypress", () => {
		socket.emit('typing')
	})

	//Listen on typing
	socket.on('typing', (data) => {
		feedback.html("<p><i>" + data.username + " is typing a message..." + "</i></p>")
	})
});


