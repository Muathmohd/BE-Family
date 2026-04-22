const axios = require('axios');
const ResponseHelper = require('../helpers/responseHelper');

const aiController = {
  async rewriteText(req, res) {
    try {
      const { text } = req.body;

      console.log(`[${req.platform}] AI Rewrite request`);

      if (!text) {
        return res.status(400).json(
          ResponseHelper.error('1001', 'النص مطلوب')
        );
      }

      try {
        // Call DeepSeek API
        const response = await axios.post(
          'https://api.deepseek.com/chat/completions',
          {
            model: 'deepseek-chat',
            messages: [
              {
                role: 'system',
                content: 'You are a helpful assistant.'
              },
              {
                role: 'user',
                content: `Rewrite the content to avoid the copyright. I want only output without what you did or note or comment: ${text}`
              }
            ],
            stream: false
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
            },
            timeout: 30000 // 30 seconds timeout
          }
        );

        // Extract the rewritten text from the response
        const rewrittenText = response.data?.choices?.[0]?.message?.content || text;

        console.log(`[${req.platform}] AI Rewrite successful`);

        res.status(200).json(
          ResponseHelper.success({
            original_text: text,
            rewritten_text: rewrittenText,
            success: true
          })
        );

      } catch (apiError) {
        // If external API fails, return original text
        console.error('DeepSeek API Error:', apiError.message);
        
        console.log(`[${req.platform}] AI Rewrite failed, returning original text`);

        res.status(200).json(
          ResponseHelper.success({
            original_text: text,
            rewritten_text: text,
            success: false,
            message: 'فشل إعادة الكتابة، تم إرجاع النص الأصلي'
          })
        );
      }

    } catch (error) {
      console.error('AI Rewrite Error:', error);
      res.status(500).json(
        ResponseHelper.error('2009')
      );
    }
  }
};

module.exports = aiController;
