import TeleBot from 'telebot'
import axios from 'axios' // Импортируем axios

const bot = new TeleBot(process.env.TELEGRAM_TOKEN)
const openaiApiKey = process.env.OPENAI_API_KEY

bot.on('text', async msg => {
	const chatId = msg.chat.id
	const userMessage = msg.text

	if (!userMessage.trim()) {
		bot.sendMessage(chatId, 'Пожалуйста, отправьте текст для перевода.')
		return
	}

	try {
		// Запрос к OpenAI для обработки текста
		const response = await axios.post(
			'https://api.openai.com/v1/chat/completions',
			{
				model: 'gpt-4', // Убедитесь, что модель правильная
				messages: [
					{ role: 'system', content: 'Ты мой помощник в кодинге.' },
					{ role: 'user', content: userMessage },
				],
				max_tokens: 100,
				temperature: 0.5,
			},
			{
				headers: {
					Authorization: `Bearer ${openaiApiKey}`,
					'Content-Type': 'application/json',
				},
			}
		)

		const translation = response.data.choices[0].message.content

		bot.sendMessage(chatId, translation)
	} catch (error) {
		console.error('Ошибка при запросе к OpenAI:', error.message || error)
		bot.sendMessage(
			chatId,
			'Произошла ошибка при попытке обработать ваш запрос.'
		)
	}
})

export default bot
