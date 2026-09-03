import { useState, useRef, useEffect } from 'react';
import { apiPost } from '../utils/api';

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: 'Halo! Saya asisten virtual Klinik Sehat Sentosa. Ada yang bisa saya bantu seputar layanan, jadwal dokter, atau prosedur pendaftaran?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isLoading]);

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    setMessages((prev) => [...prev, { role: 'user', text: trimmed }]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await apiPost('/api/chat', { message: trimmed });

      if (result.success) {
        setMessages((prev) => [...prev, { role: 'bot', text: result.data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: 'bot', text: result.data?.reply || result.message || 'Maaf, terjadi kesalahan. Silakan coba lagi.' },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          text: 'Tidak dapat terhubung ke server. Pastikan backend sudah berjalan di http://localhost:3000.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 h-[28rem] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
          <div className="bg-teal-600 text-white px-4 py-3 flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm">Asisten Klinik Sehat Sentosa</p>
              <p className="text-xs text-teal-100">Online 24/7</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-teal-700 rounded-full w-7 h-7 flex items-center justify-center transition"
              aria-label="Tutup chat"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 bg-gray-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm whitespace-pre-line ${
                    msg.role === 'user'
                      ? 'bg-teal-600 text-white rounded-br-sm'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-2 flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="border-t border-gray-200 p-2 flex gap-2 bg-white">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tulis pertanyaan Anda..."
              className="flex-1 px-3 py-2 text-sm rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-teal-600 hover:bg-teal-700 disabled:bg-gray-300 text-white rounded-full w-10 h-10 flex items-center justify-center transition flex-shrink-0"
              aria-label="Kirim pesan"
            >
              ➤
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="bg-teal-600 hover:bg-teal-700 text-white rounded-full w-14 h-14 shadow-xl flex items-center justify-center text-2xl transition transform hover:scale-105"
        aria-label="Buka chat"
      >
        {isOpen ? '✕' : '💬'}
      </button>
    </div>
  );
}

export default ChatWidget;
