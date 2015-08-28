var pageTitle = 'momocall'

exports.video = function (req, res) {
  var videoId = req.params.id
  console.log('video : ' + videoId);

  res.render('video', {title: pageTitle, videoId: videoId});

};
