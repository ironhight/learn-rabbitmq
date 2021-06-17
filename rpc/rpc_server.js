// using khi run function trên 1 máy tính từ xa và đợi kết quả.

const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function (error0, connection) {
	if (error0) {
		throw error0;
	}

	console.log('Start Message Queue');

	connection.createChannel(function (error1, channel) {
		if (error1) {
			throw error1;
		}

		const queue = 'rpc_queue';

		channel.assertQueue(queue, {
			durable: false,
		});

		channel.prefetch(1); // run nhiều hơn 1 server process. Cân bằng tải trên nhiều server.
		console.log(' [x] Awaiting RPC requests');

		channel.consume(queue, function reply(msg) { // nhận message từ queue, xử lý, callback về queue.
			const n = parseInt(msg.content.toString());

			console.log(' [.] fib(%d)', n);

			const r = fibonacci(n);

			channel.sendToQueue(msg.properties.replyTo, Buffer.from(r.toString()), {
				correlationId: msg.properties.correlationId,
			});

			channel.ack(msg);
		});
	});
});

function fibonacci(n) {
	if (n === 0 || n === 1) return n;
	else return fibonacci(n - 1) + fibonacci(n - 2);
}
