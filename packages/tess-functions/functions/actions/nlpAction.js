const nlp = require('../../lib/nlp');

module.exports = async (ctx) => {
    const reaction = await nlp(ctx.distPath, ctx.message.text);
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
