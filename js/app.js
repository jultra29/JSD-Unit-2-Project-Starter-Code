'use strict';

//handlebars

var articleTemplate = Handlebars.compile($("#articleTemplate").html());
var modalTemplate = Handlebars.compile($("#modalTemplate").html());

// isolating functions to Feedr scope
var Feedr = {
  loadData: function(url, type) {
    //removing the hidden class, so spinner starts
    $("#popUp").removeClass('hidden');
    //ajax call
    $.get(url, function(results){
      //
      var articleHTML = "";
      results.articles.forEach(function(article, index) {
        // creating a switch because we are taking original api data and putting it in our format (formatEspnArticle)
        switch (type) {
          case 'espn':
            articleHTML += Feedr.formatESPNArticle(article, index);
            break;
          case 'reddit':
            articleHTML += Feedr.formatRedditArticle(article, index);
            break;
          case 'nytimes':
            articleHTML = Feedr.formatNyTimesArticle(article, index);
            break;
          default:
            articleHTML += Feedr.formatNewsApiArticle(article, index);
        }
          // need a way to attach click handler to each individual article (index corresponds with article)
        $("#main").on('click', '#'+index, function() {
          console.log('click');
          Feedr.popUpData(article);
        })
      });

      $("#popUp").addClass('hidden');
      //.html replaces each individual source. not using append because it loads same data every time you select a source. html replaces
      $("#main").html(articleHTML);
    })

  },


  formatESPNArticle: function(article, index) {
    return articleTemplate({
      id: index,
      title: article.title,
      image: article.urlToImage,
      category: 'ESPN',
      impressions: Math.round(Math.random() * 1000)
    });
  },

  formatRedditArticle: function(article, index) {
    return articleTemplate({
      id: index,
      title: article.title,
      image: article.urlToImage,
      category: 'Reddit',
      impressions: Math.round(Math.random() * 1000)
    });
  },

  formatNyTimesArticle: function(article, index) {
    return articleTemplate({
      id: index,
      title: article.title,
      image: article.urlToImage,
      category: 'NYTimes',
      impressions: Math.round(Math.random() * 1000)
    });
  },



//function that runs when you click on the article title

  popUpData: function(article) {
    var popUpHTML = modalTemplate({
      title: article.title,
      content: article.description,
      url: article.url
    })

//adds html into the container
    $("#popUp .container").html(popUpHTML);
    Feedr.showPopUp();
  },
// generic helper functions
  hidePopUp: function() {
    $("#popUp").addClass('hidden').addClass('loader');
  },

  showPopUp: function() {
    $("#popUp").removeClass('hidden').removeClass('loader');
  },

  showEspn: function() {
    Feedr.loadData(config.sources.espn, 'espn');
  },

  showReddit: function() {
    Feedr.loadData(config.sources.reddit, 'reddit');
  },

  showNyTimes: function() {
    Feedr.loadData(config.sources.nytimes, 'nytimes');
  },

}

// initialization, calling loadData

$(document).ready(function(){
  Feedr.showEspn();
  $(".closePopUp").on('click', Feedr.hidePopUp);
  $("#search").on('click', function() {
    $(this).toggleClass('active');
  })
});
