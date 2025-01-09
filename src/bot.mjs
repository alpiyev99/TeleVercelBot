import TeleBot from "telebot"

const bot = new TeleBot(process.env.TELEGRAM_TOKEN)
const openaiApiKey = process.env.OPENAI_API_KEY

bot.on('text', async msg => {
	const chatId = msg.chat.id
	const userMessage = msg.text

	if (!userMessage) {
		bot.sendMessage(chatId, 'Пожалуйста, отправьте текст для перевода.')
		return
	}

	try {
		// Запрос к OpenAI для перевода текста
		const response = await axios.post(
			'https://api.openai.com/v1/chat/completions',
			{
				model: 'o1-2024-12-17',
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

		bot.sendMessage(chatId, `${translation}`)
	} catch (error) {
		console.error(error)
		bot.sendMessage(chatId, 'Произошла ошибка при попытке перевести текст.')
	}
})

export default bot
