const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function (error0, connection) {
	if (error0) {
		throw error0;
	}
	console.log('RabbitMQ start success');

	connection.createChannel(function (error1, channel) {
		if (error1) {
			throw error1;
		}
		const exchange = 'logs';

		channel.assertExchange(exchange, 'fanout', {
			durable: false,
		});

		// name queue đặt rỗng để RabbitMQ tự tạo name cho chúng ta

		channel.assertQueue(
			'',
			{
				exclusive: true, // queue sẽ bị xóa khi connection khởi tạo đóng - khi chúng ta disconnect với consumer
			},
			function (error2, q) {
				if (error2) {
					throw error2;
				}

				console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', q.queue);

				channel.bindQueue(q.queue, exchange, '');

				channel.consume(
					q.queue,
					function (msg) {
						if (msg.content) {
							console.log(' [x] %s', msg.content.toString());
						}
					},
					{
						noAck: true,
					},
				);
			},
		);
	});
});
