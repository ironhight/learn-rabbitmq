const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function (error0, connection) {
  if (error0) {
    console.log('error connect amqp', error0);
    throw error0;
  }

  console.log('CONNECT AMQP SUCCESSFULLY');

  connection.createChannel(function (error1, channel) {
    if (error1) {
      console.error('Error create channel', error1);
      throw error1;
    }

    var queue = 'hello';
    var msg = 'Day la message ten la: Hello world';
    //create queue
    channel.assertQueue(queue, {
      durable: false,
    });

    channel.sendToQueue(queue, Buffer.from(msg));
    console.log(' [x] Sent %s', msg);
  });

  setTimeout(function () {
    connection.close();
    console.log('Close connection');
    process.exit(0);
  }, 500);
});

//In order to make sure a message is never lost, RabbitMQ supports message acknowledgments. 