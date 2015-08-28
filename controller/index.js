var videoList = {}
videoList[0]={videoId: '-rgEZe18Dv8', videoTitle:'ももいろクローバーZ - なんてこったパンナコッタ.(full ver,)'};
videoList[1]={videoId: '0I8-yo5MPQM', videoTitle:'Who is Momoiro Clover Z?'};

var pageTitle = 'momocall'

exports.index = function (req, res) {
  res.render('index', { title: pageTitle, list: videoList });
  console.log("index");
};
