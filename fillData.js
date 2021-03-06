var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB();

exports.handler = (event, context, callback) => {
    Promise.all(event.Records.map((record) => {
        var message = JSON.parse(record.body);
        console.log('MESSAGE: %j', message);

        // Build data object and ignore null values
        var data = {};
        for (let key in message.data) {
            if (message.data[key]) {
                data[key] = {
                    'S': message.data[key].toString()
                };
            }
        }

        // Build dynamodb item
        var item = {
            'TableName': 'Books',
            'Item': {
                'bookid': { N: message.bookid },
                'bookname': { S: message.bookname }
            }
        };
        console.log('ITEM: %j', item);

        // Insert dynamodb item
        return dynamodb.putItem(item).promise()
            .then(() => {
                console.log('Item inserted');
            })
            .catch((err) => {
                console.error(err);
            });
    }))
        .then(v => callback(null, v), callback);
};