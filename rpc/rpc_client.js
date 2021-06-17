// client request message đến queue -> server. Server thực hiện job -> callback về queue -> về client kiểm tra phải message đó ko -> hiển thị.
const amqp = require('amqplib/callback_api');

const args = process.argv.slice(2);

if (args.length === 0) {
	console.log('Usage: rpc_client.js num');
	process.exit(1);
}

amqp.connect('amqp://localhost', function (error0, connection) {
	if (error0) {
		throw error0;
	}

	console.log('Start Message Queue');

	connection.createChannel(function (error1, channel) {
		if (error1) {
			throw error1;
		}

		channel.assertQueue(
			'',
			{
				exclusive: true,
			},
			function (error2, q) {
				if (error2) {
					throw error2;
				}

				const correlationId = generateUuid();
				const num = parseInt(args[0]);

				console.log(' [x] Requesting fib(%d)', num);

				channel.consume( // lấy message từ callback queue
					q.queue,
					function (msg) {
						if (msg.properties.correlationId === correlationId) { // check đúng message hay ko
							console.log(' [.] Got %s', msg.content.toString());
							setTimeout(function () {
								connection.close();
								process.exit(0);
							}, 500);
						}
					},
					{
						noAck: true,
					},
				);

				channel.sendToQueue('rpc_queue', Buffer.from(num.toString()), { // send message to queue, 
					correlationId: correlationId, // unique key check đúng message cho mỗi request
					replyTo: q.queue, // đặt queue để callback.
				});
			},
		);
	});
});

function generateUuid() {
	return Math.random().toString() + Math.random().toString() + Math.random().toString();
}
