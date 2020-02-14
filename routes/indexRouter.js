const router = require("express").Router();
const Twit = require("twit");
const ejs = require("ejs");
const fs = require("fs");
const TimestampUtil = require("../utils/TimestampUtil");

router.post("/tweet", function(req, res, next) {

  if (req.body && req.body.status && req.body.in_reply_to) {
    var T = new Twit(require("../utils/TwitterConfig").getLive(req.user));
    T.post(
      "statuses/update",
      {
        status: req.body.status,
        in_reply_to_status_id: req.body.in_reply_to
      },
      function(err, data, response) {
        if (err) {
          return res.status(404).send();
        }

        data = require("../libs/ParseTweetText")(data,screen_name);

        var filename = __dirname + "/../views/tweets/tweetReply.ejs";
        var messageHtml = fs.readFileSync(filename, "utf8");
        var renderedHtml = ejs.render(messageHtml, {
          tweet: data,
          my_screen_name: req.user.username
        });
        res.json({ tweetHtml: renderedHtml, tweet: data });
      }
    );
  } else {
    res.status(404).send("Invalid data");
  }
});

router.post("/thread", function(req, res, next) {

  if (req.body && req.body.id && req.body.username) {
    var T = new Twit(require("../utils/TwitterConfig").getLive(req.user));
    getRepliesOf(T, req.user.username, req.body.id, req.body.username, function(
      err,
      data
    ) {
      if (err) {
        return res.status(404).send();
      }

      var renderedHtml = "",
        lastTweetId = req.body.id;
      if (data.length > 0) {
        var filename = __dirname + "/../views/tweets/tweetReply.ejs";
        var messageHtml = fs.readFileSync(filename, "utf8");
        lastTweetId = data[data.length - 1].id_str;
        data.forEach(tweet => {
          renderedHtml += ejs.render(messageHtml, {
            tweet: tweet,
            my_screen_name: req.user.username
          });
        });
      }

      res.json({ tweetHtml: renderedHtml, lastTweetId: lastTweetId });
    });
  } else {
    res.status(404).send("Invalid data");
  }
});

router.get("/", function(req, res, next) {

  var T = new Twit(require("../utils/TwitterConfig").getLive(req.user));
  getRootMentions(T, req.user.username, function(err, data) {
    if (err) {
      return res.render("index", { title: "Home", tweets: [], err: err });
    }
    res.render("index", {
      title: "Home",
      tweets: data,
      err: null,
      selectedId: "",
      my_screen_name: req.user.username
    });
  });
});

router.get("/logout", function(req, res, next) {
  req.session.destroy(function(err) {
    if (err) {
      return;
    }
    res.redirect("/auth/login");
  });
});

const getRepliesOf = (
  T,
  screen_name,
  tweetId,
  fromTwitterAccount,
  callback
) => {
  T.get(
    "search/tweets",
    {
      q: `(from:${fromTwitterAccount} @${screen_name}) OR (from:${screen_name} @${fromTwitterAccount}) -filter:retweets`,
      count: 100,
      include_entities: false,
      trim_user: false,
      result_type: "recent"
    },
    function(err, data, response) {
      if (err || !data || !data.statuses) {
        return callback(err, data);
      }

      return callback(null, filterTweetsForThisThread(data.statuses,tweetId,screen_name));

    }
  );
};


/*
basically trying to make a linked list of thread to link all tweets in a row and to remove any tweet from another thread.. 
If the thread is small and is recent then all the tweets for the thread will be available 
but it can also be that this list is incomplete so we will just show all tweets from that user
*/
function filterTweetsForThisThread(tweets,tweetId,screen_name){

  //we can also use a map here to speed things up.. 
  var tweetsData = {};
  var firstReply;
  tweets.forEach(tweet => {
    
    tweet = require("../libs/ParseTweetText")(tweet,screen_name);

    if (tweet.id_str === tweetId) {
      //TODO if the thread is big then first reply will not be available
      tweetsData[tweet.id_str] = {
        data: tweet,
        next: null
      };
      firstReply = tweetsData[tweet.id_str];//the root tweet which started the thread
    } else if (tweet.in_reply_to_status_id_str) {
      tweetsData[tweet.id_str] = {
        data: tweet,
        next: null
      };
    }
  });
  var singleTweet, tweetWrapper;
  Object.keys(tweetsData).forEach(tweetWrapperIdStr => {
    tweetWrapper = tweetsData[tweetWrapperIdStr];
    singleTweet = tweetWrapper.data;
    if (tweetsData[singleTweet.in_reply_to_status_id_str]) {
      tweetsData[singleTweet.in_reply_to_status_id_str].next = tweetWrapper;
    }
  });
  var finalRepliesList = [];
  if (firstReply) {

    finalRepliesList.push(firstReply.data);
    var nextTweetWrapper = firstReply.next;
    while (nextTweetWrapper) {
      finalRepliesList.push(nextTweetWrapper.data);
      
      nextTweetWrapper = nextTweetWrapper.next;
    }
    return finalRepliesList;
  } else {
    //show all list, sort it with time
    return tweets;
  }
}


/*
mentions can include alot of tweets .. we can periodically fetch tweets and save in our own database and we can also filter tweets according to time
*/
const getRootMentions = (T, screen_name, callback) => {
  T.get(
    "search/tweets",
    {
      q: `to:${screen_name}) -filter:retweets`,
      count: 100,
      include_entities: false,
      trim_user: false,
      result_type: "recent"
    },
    function(err, data, response) {
      if (err || !data || !data.statuses) {
        return callback(err, data);
      }

      var tweetsData = [];
      data.statuses.forEach(tweet => {
        if (!tweet.in_reply_to_status_id_str) {
          
          tweet = require("../libs/ParseTweetText")(tweet,screen_name);

          tweetsData.push(tweet);
        }
      });

      return callback(null, tweetsData);
    }
  );
};
function getDemoTweets() {
  return [
    {
      id_str: "122647763423615361",
      created_at: "Sun Feb 09",
      text: "thanks for replying",
      user: { screen_name: "addfg", name: "Bot" }
    },
    {
      id_str: "122664564515361",
      created_at: "Sun Feb 09",
      text: "thanks for replying",
      user: { screen_name: "sdghfg", name: "Rahul" }
    },
    {
      id_str: "12264fsdg361",
      created_at: "Sun Feb 09",
      text: "thanks for replying",
      user: { screen_name: "addfg", name: "Bot" }
    },
    {
      id_str: "1226dfgd8111593615361",
      created_at: "Sun Feb 09",
      text: "thanks for replying",
      user: { screen_name: "dfdsf", name: "Rahul" }
    }
  ];
}
module.exports = router;
