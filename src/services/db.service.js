const db = require("../models/index");

let getAllUser = async () => {
  try {
    let data = await db.User.findAll();
    // console.log(data);
  } catch (error) {
    // console.log(error);
  }
};

let getUserByTelegramId = async (telegramID) => {
  // thử tìm trong Database
  let user = await db.User.findOne({
    where: { teleID: telegramID },
  });
  if (!user) {
    // Nếu chưa có thì tạo mới một user dựa trên Telegram ID
    user = await db.User.create({
      teleID: telegramID,
    });
  }
  //   console.log(user);
  return user;
};

let getUserMessages = async (userId) => {
  // Nhớ rằng cái userId này không phải là TelegramID
  const messages = await db.Message.findAll({
    where: {
      userId: userId,
    },
  });
  return messages;
};
let createNewMessage = async (userID, userMess, botMess) => {
  // Lưu tin nhắn vào Database
  return db.Message.create({
    userID: userID,
    userMess,
    botMess,
  });
};
let clearUserMessages = async (userId) => {
  // Xoá các tin nhắn của người dùng trong Database
  return db.Message.destroy({
    where: {
      userId: userId,
    },
  });
};

module.exports = {
  getAllUser: getAllUser,
  getUserByTelegramId: getUserByTelegramId,
  getUserMessages: getUserMessages,
  createNewMessage: createNewMessage,
  clearUserMessages: clearUserMessages,
};
