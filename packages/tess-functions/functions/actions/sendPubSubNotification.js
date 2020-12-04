module.exports = (app, params) => {
  if (params) {
    app.io.emit(params.event, params.data);
  }
}
