var TimestampUtil=require("../utils/TimestampUtil")

module.exports=function(tweet,username2){
  
  tweet.text_formatted = tweet.text.replace("@"+tweet.user.username,"");
  tweet.text_formatted = tweet.text_formatted.replace("@"+username2,"");

  tweet.created_at_timestamp=TimestampUtil.convertToTimestampTwitter(tweet.created_at);
  if(TimestampUtil.getDate(tweet.created_at_timestamp/1000) == TimestampUtil.getDate(Date.now()/1000)){
    //today
    tweet.created_at_formatted=TimestampUtil.getTimeAndA(tweet.created_at_timestamp/1000);

  }else{
    tweet.created_at_formatted=TimestampUtil.getDateTimeFormat1(tweet.created_at_timestamp/1000);

  }

  if(TimestampUtil.getDate(tweet.created_at_timestamp/1000) == TimestampUtil.getDate(Date.now()/1000)){
    //today
    tweet.created_at_formatted_short=TimestampUtil.getTimeAndA(tweet.created_at_timestamp/1000);
  }else{
    var days = Math.floor((Date.now()-tweet.created_at_timestamp)/86400000);
    tweet.created_at_formatted_short= days+" days ago";
  }
  return tweet;
}