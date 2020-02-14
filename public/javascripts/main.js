const loadingText = document.getElementById("loading");
const input_field = document.getElementById("input_tweet");
const btn_create_tweet = document.getElementById("btn_create_tweet");
const list_container_right = document.getElementById("list_container_right");
const input_section = document.getElementById("input_section");

var selectedTweetId, lastTweetId, selectedTweetUsername;

loadingText.style.display = "none";
input_section.style.display = "none";

btn_create_tweet.addEventListener("click", onCreateTweetClicked);

function onCreateTweetClicked(event) {
  if (!selectedTweetId) {
    window.alert("Select a thread to start conversation");
    return;
  }
  if(!input_field.value){
    return;
  }
  var value ="@" + selectedTweetUsername + " "+ input_field.value;
  loadingText.style.display = "inline-block";
  axios
    .post(
      "/tweet",
      {
        status: value,
        in_reply_to: lastTweetId
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      }
    )
    .then(function(response) {
      // handle success
      addTweetInChatList(response.data.tweetHtml,response.data.tweet);
      input_field.value="";
    })
    .catch(function(error) {
      // handle error
      console.log(error);
    })
    .finally(function() {
      // always executed
      loadingText.style.display = "none";
    });
}

[].forEach.call(document.getElementsByClassName("tweet_root"), function(el) {
  el.addEventListener("click", function(event) {
    onTweetClicked(el); //as event.target does not include data-username attribute . check why
  });
});

function onTweetClicked(el) {
  console.log(el);
  selectedTweetUsername = el.attributes["data-username"].value;

  loadingText.style.display = "inline-block";
  axios
    .post(
      "/thread",
      {
        id: el.id,
        username: selectedTweetUsername
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      }
    )
    .then(function(response) {
      // handle success
      refreshTweetThread(el, response.data);
    })
    .catch(function(error) {
      // handle error
      console.log(error);
    })
    .finally(function() {
      // always executed
      loadingText.style.display = "none";
    });
}

function refreshTweetThread(el, responseData) {
  input_section.style.display = "block";

  input_field.value="";
  selectedTweetId = el.id;
  list_container_right.innerHTML = responseData.tweetHtml;
  lastTweetId = responseData.lastTweetId;
  selectedTweetUsername = selectedTweetUsername;
  list_container_right.scrollTop = list_container_right.scrollHeight;

  [].forEach.call(document.getElementsByClassName("tweet_root"), function(el) {
    el.classList.remove("tweet_selected");
  });
  el.classList.add("tweet_selected");
}

var addTweetInChatList=function(html,tweet){
  if(!selectedTweetId){
    return;
  }
  
  list_container_right.innerHTML += html;
  list_container_right.scrollTop = list_container_right.scrollHeight;
  lastTweetId = tweet.id_str;

}