// api/openai.js
const axios = require('axios');

async function getChatGPTResponse(message) {
  const apiKey = process.env.OPENAI_API_KEY;
  
  const response = await axios.post('https://api.openai.com/v1/chat/completions', {
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        
        content: 'Ты переводчик. Твоя задача — переводить любой входящий текст на русский язык, сохраняя смысл и стиль оригинала.'
      },
      {
        role: 'user',
        content: userMessage
      }
    ],
    temperature: 0.7
  }, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    }
  });
  
  return response.data.choices[0].message.content;
}

module.exports = { getChatGPTResponse };