const sendResponse = require('../utils/response');
const ragService = require('../services/rag.service');

async function handleChat(req, res) {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return sendResponse(res, {
        code: 400,
        success: false,
        message: 'Pesan tidak boleh kosong.',
        data: { reply: 'Pesan tidak boleh kosong.', context: [] },
      });
    }

    const result = await ragService.getAnswer(message.trim());

    return sendResponse(res, {
      code: 200,
      success: true,
      message: 'Berhasil mendapatkan jawaban chatbot',
      data: {
        reply: result.reply,
        context: result.context,
      },
    });
  } catch (error) {
    console.error('Error di handleChat:', error);
    return sendResponse(res, {
      code: 500,
      success: false,
      message: 'Terjadi kesalahan pada server. Silakan coba lagi nanti.',
      data: { reply: 'Terjadi kesalahan pada server. Silakan coba lagi nanti.', context: [] },
    });
  }
}

module.exports = { handleChat };
