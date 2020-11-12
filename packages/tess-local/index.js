const sayLib = require('say');
const voice = "Luciana";

const say = (message) => {
  sayLib.speak(message, voice, 1);
}

module.exports =  {
  say
}
