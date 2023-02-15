const TelegramBot = require("node-telegram-bot-api");
const db = require("./src/services/db.service");
const gpt = require("./src/services/gpt.service");

require("dotenv").config();

// db.getUserByTelegramId("lam");

// Thiết lập bot Telegram
const token = process.env.TELE_API_KEY;
const bot = new TelegramBot(token, { polling: true });

// // Thiết lập OpenAI API
// const apiKey = "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";
// const openaiClient = new openai(apiKey);

// Xử lý tin nhắn mới
bot.on("message", async (msg) => {
  const authorId = msg.from.id; // Lấy id của người gửi
  const chatId = msg.chat.id; // ID của cuộc trò chuyện hiện tại
  const chatMsg = msg.text; // Nội dung của tin nhắn đã nhận
  // Đầu tiên sẽ lấy thông tin user ra
  const user = await db.getUserByTelegramId(authorId);
  // console.log(user.dataValues.teleID);

  const messageId = msg.message_id;

  // Trích dẫn câu hỏi của người dùng
  let replyOptions = {
    reply_to_message_id: messageId,
    parse_mode: "Markdown",
  };

  if (msg.text.startsWith("/gpt")) {
    // Trả lời tin nhắn dựa trên các tin nhắn cũ
    gpt.gptReturn(chatMsg, user).then((answer) => {
      bot.sendMessage(chatId, answer, replyOptions);
    });
  }
  if (msg.text.startsWith("/clear")) {
    // Xoá phiên trò chuyện
    db.clearUserMessages(user.dataValues.teleID);
    bot.sendMessage(chatId, "_Xoá phiên trò chuyện thành công!_", replyOptions);
  }
  if (msg.text.startsWith("/help")) {
    bot.sendMessage(
      chatId,
      "_Để chat với ChatGPT bạn hãy gõ mã /gpt ở đầu\nĐể xoá phiên trò chuyện gõ /clear _",
      replyOptions
    );
  }
});
