amqp = {
    connection: undefined,
    connected: false,
    connect: function () {
        log.info('Opening AMQP channel to host', Meteor.settings.amqp_host);
        var amqpLib = Meteor.require('amqp');
        amqp.connection = amqpLib.createConnection({url: Meteor.settings.amqp_host});
        amqp.connection.on('close', function (err) {
            log.info('AMQP connection closed', err, arguments);
        });
        amqp.connection.on('error', function (err) {
            log.info('AMQP connection error', err, arguments);
        });
        amqp.connection.on('connect', function () {
            log.info('AMQP connection created');
        });
        var fut = new Future();
        amqp.connection.on('ready', function () {
            log.info('AMQP connection ready');
            if (!amqp.connected) {
                amqp.connected = true;
                fut.return();
            }
        });
        return fut.wait();
    },
    rpc: function (data, routingKey, callback) {
        log.info('AMQP rpc initiated', routingKey);

        var corrId = UUID.v1();
        function maybeAnswer (msg) {
            if (msg.properties.correlationId === corrId) {
                answer.resolve(msg.content.toString());
            }
        }
        var ctag = undefined;

        // reply queue
        var reply_queue = amqp.connection.queue(corrId, { exclusive: true, autoDelete: true }, function (queue) {
            log.info('[a] Reply queue created');
            log.info('[b] Ready to consume from reply queue');
            opts = { correlationId: corrId, replyTo: corrId };
            log.info('[c] Publishing message');
            amqp.connection.publish(routingKey, data, opts);
        });

        // store response to enable cancelling the timeout
        var response = false;
        reply_queue.subscribe(function (msg, headers, deliveryInfo) {
            response = true;
            log.info('[d] Got response');
            log.info('[e] starting callback');
            callback(msg);
            log.info('[f] Unsubscribing');
            reply_queue.unsubscribe(ctag);
        })
        .addCallback(function(ok) { ctag = ok.consumerTag; });

        // we timeout with an error after some time seconds
        setTimeout(function () {
            if (response) return;
            log.info('[d] Response timeout');
            log.info('[e] Unsubscribing');
            reply_queue.unsubscribe(ctag);
            callback({ sucess: false, message: 'Intet svar ved AMQP RPC' });
        }, Meteor.settings.amqp_timeout);
    }
};
