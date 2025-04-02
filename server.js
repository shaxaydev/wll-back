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
    origin: '*', // Убедись, что это правильный URL для продакшн
  })
);

app.use(express.json());

// Настроим endpoint для обработки формы
app.post('/send-feedback', async (req, res) => {
  const { form_name, form_email, form_subject, form_phone, form_message } =
    req.body;

  // Логируем полученные данные для отладки
  console.log('Received feedback:', req.body);

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
    // Логируем перед отправкой запроса в Telegram
    console.log('Sending message to Telegram...');

    const response = await axios.post(
      `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
      {
        chat_id: process.env.ADMIN_CHAT_ID,
        text,
      }
    );

    // Проверка, успешно ли отправлено
    if (response.data.ok) {
      console.log('Message sent to Telegram successfully');
      res.status(200).json({ success: true });
    } else {
      console.error('Telegram API error:', response.data);
      res
        .status(500)
        .json({ success: false, error: 'Ошибка при отправке в Telegram' });
    }
  } catch (error) {
    // Логируем ошибку, если запрос не был успешным
    console.error('Error sending message:', error);
    res
      .status(500)
      .json({ success: false, error: 'Ошибка при отправке сообщения' });
  }
});

app.listen(PORT, () => {
  console.log(
    `Server is running on ${process.env.RAILWAY_PUBLIC_DOMAIN}:${PORT}`
  );
});
