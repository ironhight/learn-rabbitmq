const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function (error0, connection) {
	if (error0) {
		throw error0;
	}
	connection.createChannel(function (error1, channel) {
		if (error1) {
			throw error1;
		}

		console.log('Create channel success');

		const queue = 'task_queue';
		console.log(process.argv);
		const msg = process.argv.slice(2).join(' ') || '.....';

		channel.assertQueue(queue, {
			durable: true, // đảm bảo message queue ko bao giờ bị mất nếu restart RabbitMQ
		});

		channel.sendToQueue(queue, Buffer.from(msg), {
			persistent: true, // đảm bảo message ko bao giờ bị mất, muốn kỹ hơn thì dùng Publisher Confirm
		});

		console.log(" [x] Sent '%s'", msg);
	});

	setTimeout(function () {
		connection.close();
		console.log('Close Message Queue');

		process.exit(0);
	}, 500);
});
