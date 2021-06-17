const amqp = require('amqplib/callback_api');

// không thể log dựa trên nhiều tiêu chí, như log từ mức độ nghiệm trọng và nguồn phát ra mức độ
amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    console.log('Start Message Queue');

    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        const exchange = 'direct_logs';
        const args = process.argv.slice(2); // process.argv là những gì nhập sau khi chạy server
        const msg = args.slice(1).join(' ') || 'Hello World!';
        const severity = (args.length > 0) ? args[0] : 'info';

        channel.assertExchange(exchange, 'direct', { // filter message cho mỗi consumer nhận tương ứng, dùng direct
            durable: false
        });

        channel.publish(exchange, severity, Buffer.from(msg)); 

        console.log(" [x] Sent %s: '%s'", severity, msg);
    });

    setTimeout(function() {
        connection.close();
        console.log('Close Message Queue');

        process.exit(0);
    }, 500);
});