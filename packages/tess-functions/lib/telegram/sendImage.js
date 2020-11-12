module.exports = async (ctx, params, image) => {
  if (params && params.length) { // Sending a scheduled message
    await ctx.telegram.sendMessage(params.chatId, params.msg);
    await ctx.telegram.sendChatAction(params.chatId, 'upload_photo')
    await ctx.telegram.sendPhoto(params.chatId, {source: image})
  } else { // Replying to a request
    await ctx.replyWithChatAction('upload_photo')
    await ctx.replyWithPhoto({source: image})
  }
}
