const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
        throw error0;
    }

	console.log('RabbitMQ start success');
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }
        const exchange = 'logs';
        const msg = process.argv.slice(2).join(' ') || 'Hello World!';
		
// mối quan hệ giữa exchange và queue là binding
        channel.assertExchange(exchange, 'fanout', { // 'fanout': exchange sẽ gửi tất cả message mà nó nhận được đến tất cả queue được kết nối với nó
            durable: false
        });

        channel.publish(exchange, '', Buffer.from(msg));

        console.log(" [x] Sent %s", msg);
    });

    setTimeout(function() {
        connection.close();
        process.exit(0);
    }, 500);
});
