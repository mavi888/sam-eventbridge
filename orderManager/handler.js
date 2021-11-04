const AWSXRay = require('aws-xray-sdk-core');
const AWS = AWSXRay.captureAWS(require('aws-sdk'))
const eventbridge = new AWS.EventBridge();


function putEventInEventBridge(orderDetails) {

    const detail = { 
      restaurantName: orderDetails.restaurantName,
      order: orderDetails.order,
      customerName: orderDetails.name,
      amount: orderDetails.amount
    };
  
    var params = {
      Entries: [
        {
          Detail: JSON.stringify(detail),
          DetailType: 'order',
          Source: 'custom.orderManager'
        },
      ]
    };


    console.log(params);
    return eventbridge.putEvents(params).promise();
  }

exports.putOrder = async (event) => {
    console.log('putOrder');

    const orderDetails = JSON.parse(event.body);

    const segment = AWSXRay.getSegment();
    const subsegment = segment.addNewSubsegment('putEventInEventBridge');
    subsegment.addAnnotation("customerName", orderDetails.customerName);
    subsegment.addMetadata("orderDetails", orderDetails)
    
    const data = await putEventInEventBridge(orderDetails);
    console.log(data);
    
    subsegment.close();
    return {
      statusCode: 200,
      body: JSON.stringify(orderDetails),
      headers: {}
    }    
}