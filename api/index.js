import 'dotenv/config';
import { bot } from '../src/bot.mjs';
import TelegramBot from 'node-telegram-bot-api';

// В webhook-режиме нам не нужно использовать polling.
// Мы укажем только token, а потом настроим сам webhook.
const botToken = process.env.TELEGRAM_BOT_TOKEN;
const telegramBot = new TelegramBot(botToken);

// Экспортируем handler для Vercel
export default async (req, res) => {
  // Telegram шлет обновления методом POST
  if (req.method === 'POST') {
    const body = req.body;
    
    if (body && body.message && body.message.text) {
      const chatId = body.message.chat.id;
      const userText = body.message.text;

      // Отправляем "типинг", пока генерируем ответ
      await telegramBot.sendChatAction(chatId, 'typing');
      
      try {
        const gptResponse = await getChatGPTResponse(userText);
        await telegramBot.sendMessage(chatId, gptResponse);
      } catch (err) {
        console.error(err);
        await telegramBot.sendMessage(chatId, "Произошла ошибка. Попробуйте еще раз позже.");
      }
    }

    return res.status(200).send('OK');
  } else {
    // Если кто-то просто GET-ит этот endpoint, можно вернуть что-нибудь для проверки.
    return res.status(200).send('This is a Telegram bot webhook endpoint.');
  }
};