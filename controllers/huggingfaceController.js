import axios from 'axios';
const userContexts = {}; // Simple in-memory context store

export const chatWithModel = async (req, res) => {
  const { prompt } = req.body;
  const userId = req.user.userId;

  // Initialize or append to user's context
  if (!userContexts[userId]) userContexts[userId] = [];
  userContexts[userId].push(`User: ${prompt}`);

  // Limit context size (e.g., last 5 interactions)
  const contextWindow = userContexts[userId].slice(-5).join('\n');

  try {
    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${process.env.HF_MODEL}`
, // You can change model
      {
        inputs: contextWindow
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
        },
      }
    );

    const reply = response.data?.[0]?.generated_text || '🤖 No response';
    userContexts[userId].push(`Bot: ${reply}`);

    // Admin Commands
    if (req.user.role === 'admin' && prompt.startsWith('/')) {
      const parts = prompt.split(' ');
      const command = parts[0];
      const target = parts[1];

      if (command === '/remove') {
        // In real app, delete from DB
        return res.json({ reply: `✅ Simulated user removal: ${target}` });
      } else if (command === '/msg') {
        const message = parts.slice(1).join(' ');
        return res.json({ reply: `📢 System message sent: "${message}"` });
      } else {
        return res.json({ reply: `❌ Unknown command: ${command}` });
      }
    }

    res.json({ reply });
  } catch (err) {
    res.status(500).json({
      error: '❌ Hugging Face API error',
      message: err.message,
    });
  }
};
