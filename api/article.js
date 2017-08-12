//Load required packages
var Article = require('../models/article');
const DEFAULT_NUM_ARTICLES = 4; //unused now

//Returns a number of Articles
exports.getArticles = function () {
  //find DEFAULT_NUM_ARTICLES articles
  return new Promise(function (resolve, reject) {
    Article.find().exec(function (err, articles) {
      if (err) {
        return reject(err);
      }
      resolve(articles);
    });
  });
};

//Gets articles by tag from the database
exports.getArticlesByTag = function (article_tag) {
  return new Promise(function (resolve, reject) {
    // Use the Article model to find a specific article
    Article.find({ "tags": new RegExp('^'+article_tag, 'i') }, function (err, articles) {
      if (err) {
        return reject(err);
      }

      resolve(articles);
    });
  });
};

//Inserts an article into the database
exports.postArticle = function (data) {
  return new Promise(function (resolve, reject) {

    //Create a new instance of the Article model
    var article = new Article();
    article.articleID = data.articleID;
    article.tags = data.tags;
    article.intro= data.intro;
    article.title=data.title;
    article.photos.smallcaption = data.photos.smallcaption;
    article.photos.smallurl= data.photos.smallurl;
    article.photos.caption = data.photos.caption;
    article.photos.url= data.photos.url;
    article.body=data.body;
    article.URL=data.URL;

    //save the article and check for errors
    article.save(function (err) {
      if (err) {
        return reject(err);
      }

      resolve({ message: 'article added', data: article });
    });
  });
};

//Gets a specific article from the database
exports.getArticle = function (article_id) {
  return new Promise(function (resolve, reject) {
    // Use the Article model to find a specific article
    Article.findOne({ articleID: article_id }, function (err, article) {
      if (err) {
        return reject(err);
      }

      resolve(article);
    });
  });
};


//Updates an article in the database
exports.putArticle = function (article_id, tagsArray) {
  //TODO: Update to do more than tags

  return new Promise(function (resolve, reject) {
    // Use the Article model to find a specific article
    Article.findOneAndUpdate({ articleID: article_id }, {$set:{tags:tagsArray}}, {new:true}, function (err, article) {
      if (err) {
        return reject(err);
      }
      if(!article)return reject("Article "+article_id+"not found");

      resolve(article);
      });
  });
};

//Deletes an article from the database
exports.deleteArticle = function (article_id) {
  return new Promise(function (resolve, reject) {
    // Use the Article model to find a specific article and remove it
    Article.remove({ articleID: article_id }, function (err) {
      if (err) {
        return reject(err);
      }

      resolve({ message: 'Article ' + article_id + ' removed' });
    });
  });
};
