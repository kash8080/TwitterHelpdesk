module.exports.getLive = function(user) {
  return {
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_KEY_SECRET,
    app_only_auth: false, //true only for application level context
    access_token: user.accesstoken, //for  user context
    access_token_secret: user.accesstokenSecret, //for  user context
    timeout_ms: 60 * 1000 // optional HTTP request timeout to apply to all requests.
    //strictSSL:            true,     // optional - requires SSL certificates to be valid.
  };
};

module.exports.getTest = function() {
  return {
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_KEY_SECRET,
    app_only_auth: false, //true only for application level context
    access_token: "asds", //for  user context
    access_token_secret: "dfsf", //for  user context
    timeout_ms: 60 * 1000 // optional HTTP request timeout to apply to all requests.
    //strictSSL:            true,     // optional - requires SSL certificates to be valid.
  };
};
