module.exports = async (ctx, params) => {
  // console.log(params)
  if (params) {
    const ContactList = await ctx.getContacts();
    const Contact = ContactList.filter((contact) => {
      return contact.id._serialized === params.contactId;
    })[0];
    const chat = await Contact.getChat();
    chat.sendMessage(params.msg);
  }
};
