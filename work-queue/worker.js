const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function (error, connection) {
	connection.createChannel(function (error, channel) {
		const queue = 'task_queue';

		channel.assertQueue(queue, {
			durable: true,
		});

		channel.prefetch(1); // Phân phối đến worker khác khi worker này đang processing

		console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', queue);

		channel.consume(
			queue,
			function (msg) {
				const secs = msg.content.toString().split('.').length - 1;

				console.log(' [x] Received %s', msg.content.toString()); // send message ở dạng Buffer nên phải toString()

				setTimeout(function () {
					console.log(' [x] Done');
					channel.ack(msg);
				}, secs * 1000);
			},
			{
				noAck: false, // consumer send back queue để xác nhận message đã gửi xong rồi, nếu consumer bị die => ko gửi lại ack => queue sẽ gửi lại 1 cái mới
			},
		);
	});
});
