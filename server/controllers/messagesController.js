const Messages = require("../model/messageModel");

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    if (data) {
      return res.json({ msg: " Message added succesfully" });
    } else {
      return res.json({ msg: " Failed to add message to the database" });
    }
  } catch (ex) {
    next(ex);
  }
};

module.exports.getAllMessage = async (req, res, next) => {
  try {
    const { from, to } = req.body;
    const messages = Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectMessages = (await messages).map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });

    return res.json(projectMessages);
  } catch (ex) {
    next(ex);
  }
};