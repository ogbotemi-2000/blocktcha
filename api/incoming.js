module.exports = function(request, response) {
  const EventSource = require("eventsource"), 
        config      = require('./config.json');
        es          = new EventSource(`https://horizon-testnet.stellar.org/accounts/${config.WALLET_ADDRESS}/payments`);

es.onmessage = function (message) {
  let result = message.data ? JSON.parse(message.data) : message;
  console.log('\n', "_".repeat(4), "New payment:", result);
};
es.onerror = function (error) {
  console.log("An error occurred!");
};
}