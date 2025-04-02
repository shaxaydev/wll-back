import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Разрешаем только наш фронт для CORS
app.use(
  cors({
    origin: 'https://whitelanelogistics.com/', // заменим на URL фронтенда, когда будем деплоить
  })
);

app.use(express.json());

// Настроим endpoint для обработки формы
app.post('/send-feedback', async (req, res) => {
  const { form_name, form_email, form_subject, form_phone, form_message } =
    req.body;

  const text = `
📩 New message from website:

👤 Name: ${form_name}
📧 Email: ${form_email}
📞 Phone: ${form_phone}
📌 Subject: ${form_subject}
📝 Message:
${form_message}
`;

  try {
    const response = await axios.post(
      `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
      {
        chat_id: process.env.ADMIN_CHAT_ID,
        text,
      }
    );

    if (response.data.ok) {
      res.status(200).json({ success: true });
    } else {
      res
        .status(500)
        .json({ success: false, error: 'Ошибка при отправке в Telegram' });
    }
  } catch (error) {
    console.error('Ошибка:', error);
    res
      .status(500)
      .json({ success: false, error: 'Ошибка при отправке сообщения' });
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
