const nlp = require('tess-nlp')
const path = require('path')
const DEFAULT_MODEL_PATH = path.join(__dirname, '../../', '/dist')

module.exports = async (ctx) => {
    const reaction = await nlp(DEFAULT_MODEL_PATH, ctx.message.text);
    if (reaction){
        if (reaction.action && reaction.action !== 'None'){
            const action = require(`${__dirname}/${reaction.action}`);
            ctx.reply(reaction.msg);
            action(ctx);
        } else {
            ctx.reply(reaction.msg);
        }
    }
}
