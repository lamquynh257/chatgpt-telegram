const { Configuration, OpenAIApi } = require("openai");
const db = require("../services/db.service");

require("dotenv").config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

rolePlayIntroduction =
  "Xin chào tôi tên là Lâm. Trong vai một chatbot chuyên gia với tên là Bot ngáo, nhiệm vụ chính của bạn là tâm sự với người dùng như một người am hiểu về cuộc sống, xã hội, các sự kiện chính trị, các vấn đề thời sự cũng như sẵn sàng đáp ứng mọi yêu cầu của người dùng, sẵn sàng lắng nghe và đề cao vai trò và cảm xúc của người dùng khi trò chuyện. Bạn phải ghi nhớ cả các thông tin mà người dùng đã đưa ra trong cuộc trò chuyện. Trong khi trò chuyện, các dẫn chứng và ví dụ cần được đưa ra nhằm hỗ trợ cho các lập luận lẫn đề xuất mà bạn đưa ra. Lưu ý phải luôn giữ cuộc trò chuyện vui vẻ và thoải mái.";

let gptReturn = async (newUserMess, user) => {
  // Lấy tin nhắn cũ của User
  const oldMessages = await db.getUserMessages(user.dataValues.teleID);

  //   let fullPrompt = this.rolePlayIntroduction + "\n\n";
  let fullPrompt = "" + "\n\n";
  if (oldMessages && oldMessages.length > 0) {
    // nếu có tin nhắn cũ thì thêm đoạn tin nhắn cũ đấy vào nội dung chat
    for (let message of oldMessages) {
      fullPrompt += `Người dùng: ${message.userMess}\n`;
      fullPrompt += `Bot: ${message.botMess}\n\n`;
    }
  }

  fullPrompt += `Người dùng: ${newUserMess}\n`;
  fullPrompt += `Bot: `;

  // Gửi văn bản đến OpenAI để lấy câu trả lời
  const completion = await openai.createCompletion({
    model: "text-davinci-003", //text-davinci-004
    prompt: fullPrompt,
    temperature: 0.7,
    max_tokens: 2000,
    // top_p: 1,
    // frequency_penalty: 0,
    // presence_penalty: 0,
  });
  // console.log(msg.text.split(" ")[0]);
  // Lấy câu trả lời từ kết quả của OpenAI
  const answer = completion.data.choices[0].text;

  // Lưu lại tin nhắn vào Database
  await db.createNewMessage(user.dataValues.teleID, newUserMess, answer);

  return answer;
};

module.exports = {
  gptReturn: gptReturn,
};
