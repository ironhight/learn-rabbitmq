var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function (error0, connection) {
  if (error0) {
    throw error0;
  }

  connection.createChannel(function (error1, channel) {
    if (error1) {
      console.error('Error in Create Channel');
      throw error1;
    }

    var queue = 'hello';

    channel.assertQueue(queue, {
      durable: false,
    });

    console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', queue);

    //RabbitMQ push message to consume.
    channel.consume(
      queue,
      function (msg) {
        console.log(' [x] Received %s', msg.content.toString());
      },
      {
        noAck: true,
      }
    );
  });
});
