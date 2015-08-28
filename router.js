module.exports = function(app, controller) {
  app.get('/'    , controller.index.index);
  app.get('/video/:id', controller.video.video);
}