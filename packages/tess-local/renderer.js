// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const socket = require('socket.io-client')('http://localhost:3000')
const { say } = require('./lib/say')

socket.on('connect', function () {
  console.log('is connected')
})
socket.on('notification', function (data) {
  console.log(data)
  const myNotification = new Notification('Title', {
    body: data.msg,
  })

  myNotification.onclick = () => {
    console.log('Notification clicked')
  }
  say(data.msg)
  console.log(data.msg)
})
socket.on('disconnect', function () {
  console.log('disconnected')
})
