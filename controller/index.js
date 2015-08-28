var videoList = {}
videoList = require('../data/videoList.json');
var pageTitle = 'momocall'

exports.index = function (req, res) {
  res.render('index', { title: pageTitle, list: videoList.list });
  console.log("index");
};
