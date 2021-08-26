const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME

exports.blueDragonDLQ = async (event) => {
    console.log(event);

    const eventPackages = JSON.parse(event.Records[0].body);
    console.log(eventPackages);

    await saveItem(eventPackages);
    return;
}


async function saveItem(item) {
    const params = {
		TableName: TABLE_NAME,
		Item: item
	};

    console.log(params)
    
    return dynamo.put(params).promise();
};