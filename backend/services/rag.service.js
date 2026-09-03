const fs = require('fs');
const path = require('path');
const config = require('../config/env');

const knowledgeBasePath = path.join(__dirname, '..', 'data', 'knowledgeBase.json');
const knowledgeBase = JSON.parse(fs.readFileSync(knowledgeBasePath, 'utf-8'));

/**
 * Meratakan knowledgeBase.json jadi daftar "dokumen" kecil yang bisa dicari
 * satu per satu. Dipisah dari data mentahnya biar retrieval gak perlu tau
 * bentuk asli JSON-nya, cukup baca daftar { id, category, content }.
 */
function buildDocuments() {
  const documents = [];

  const profil = knowledgeBase.profil_klinik;
  documents.push({
    id: 'profil-1',
    category: 'Profil Klinik',
    content: `Nama klinik: ${profil.nama}. Alamat: ${profil.alamat}. Jam operasional Senin-Jumat: ${profil.jam_operasional.senin_jumat}, Sabtu: ${profil.jam_operasional.sabtu}, Minggu: ${profil.jam_operasional.minggu}.`,
  });
  documents.push({
    id: 'profil-2',
    category: 'Kontak Klinik',
    content: `Kontak klinik: Telepon ${profil.kontak.telepon}, WhatsApp ${profil.kontak.whatsapp}, Email ${profil.kontak.email}, Instagram ${profil.kontak.instagram}.`,
  });
  documents.push({
    id: 'profil-3',
    category: 'Fasilitas Klinik',
    content: `Fasilitas yang tersedia di klinik: ${profil.fasilitas.join(', ')}.`,
  });

  knowledgeBase.layanan_poliklinik.forEach((layanan) => {
    documents.push({
      id: `layanan-${layanan.id}`,
      category: 'Layanan Poliklinik',
      content: `${layanan.nama}: ${layanan.deskripsi} Harga konsultasi sekitar ${layanan.harga_konsultasi}.`,
    });
  });

  knowledgeBase.jadwal_dokter.forEach((dokter, idx) => {
    documents.push({
      id: `dokter-${idx}`,
      category: 'Jadwal Dokter',
      content: `${dokter.nama} (${dokter.spesialisasi}) praktik pada hari ${dokter.hari_praktik.join(', ')} pukul ${dokter.jam_praktik}.`,
    });
  });

  documents.push({
    id: 'prosedur-baru',
    category: 'Prosedur Pendaftaran Pasien Baru',
    content: `Prosedur pendaftaran pasien baru: ${knowledgeBase.prosedur_pendaftaran.pasien_baru.join(' ')}`,
  });
  documents.push({
    id: 'prosedur-lama',
    category: 'Prosedur Pendaftaran Pasien Lama',
    content: `Prosedur pendaftaran pasien lama: ${knowledgeBase.prosedur_pendaftaran.pasien_lama.join(' ')}`,
  });
  documents.push({
    id: 'prosedur-online',
    category: 'Pendaftaran Online',
    content: knowledgeBase.prosedur_pendaftaran.pendaftaran_online,
  });

  knowledgeBase.faq.forEach((item, idx) => {
    documents.push({
      id: `faq-${idx}`,
      category: 'FAQ',
      content: `Pertanyaan: ${item.pertanyaan} Jawaban: ${item.jawaban}`,
    });
  });

  return documents;
}

const DOCUMENTS = buildDocuments();

function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\sÀ-ÿ]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

const STOPWORDS = new Set([
  'yang', 'dan', 'di', 'ke', 'dari', 'untuk', 'pada', 'adalah', 'apa',
  'apakah', 'bagaimana', 'dengan', 'itu', 'ini', 'saya', 'kamu', 'ada',
  'tolong', 'min', 'kak', 'gimana', 'cara', 'atau', 'the', 'is', 'a',
]);

/**
 * Retrieval sederhana berbasis keyword overlap (bukan embedding/vector DB,
 * cukup buat scope tugas akhir). Kata di query dicocokkan ke tiap dokumen,
 * exact match dapet skor lebih tinggi daripada partial match.
 */
function retrieveRelevantDocuments(query, topN = 3) {
  const queryTokens = normalize(query).filter((t) => !STOPWORDS.has(t));

  if (queryTokens.length === 0) {
    return [];
  }

  const scored = DOCUMENTS.map((doc) => {
    const docTokens = normalize(doc.content + ' ' + doc.category);
    let score = 0;

    queryTokens.forEach((qt) => {
      docTokens.forEach((dt) => {
        if (dt === qt) {
          score += 3;
        } else if (dt.includes(qt) || qt.includes(dt)) {
          score += 1;
        }
      });
    });

    return { ...doc, score };
  });

  return scored
    .filter((doc) => doc.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);
}

/**
 * Fallback kalau LLM_API_KEY kosong atau request ke LLM gagal, biar server
 * tetap bisa dites lokal tanpa API key dan gak crash.
 */
function buildFallbackAnswer(contextDocs) {
  if (contextDocs.length === 0) {
    return 'Maaf, saya belum menemukan informasi yang relevan dengan pertanyaan Anda di basis data klinik. Silakan hubungi klinik langsung di (0274) 123456 atau WhatsApp 0812-3456-7890 untuk informasi lebih lanjut.';
  }

  const intro = 'Berdasarkan data klinik yang saya miliki, berikut informasinya:\n\n';
  const body = contextDocs
    .map((doc, idx) => `${idx + 1}. [${doc.category}] ${doc.content}`)
    .join('\n\n');

  return `${intro}${body}`;
}

async function generateWithLLM(query, contextDocs) {
  if (!config.groqApiKey) {
    return null;
  }

  try {
    const Groq = require('groq-sdk');
    const groq = new Groq({ apiKey: config.groqApiKey });

    const contextText = contextDocs
      .map((doc, idx) => `[Dokumen ${idx + 1} - ${doc.category}]\n${doc.content}`)
      .join('\n\n');

    const systemPrompt = `Kamu adalah asisten virtual resmi Klinik Sehat Sentosa. Jawab pertanyaan pasien HANYA berdasarkan konteks dokumen yang diberikan di bawah ini. Jika informasi tidak ditemukan dalam konteks, katakan dengan sopan bahwa informasi tersebut tidak tersedia dan sarankan pasien menghubungi klinik langsung. Jawab dengan bahasa Indonesia yang ramah, jelas, dan ringkas.

Konteks:
${contextText}`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: query },
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    return completion.choices[0]?.message?.content?.trim() || null;
  } catch (error) {
    console.error('LLM generation error, fallback ke jawaban berbasis dokumen:', error.message);
    return null;
  }
}

async function getAnswer(query) {
  const contextDocs = retrieveRelevantDocuments(query, 3);

  let reply = await generateWithLLM(query, contextDocs);

  if (!reply) {
    reply = buildFallbackAnswer(contextDocs);
  }

  return {
    reply,
    context: contextDocs.map((doc) => ({
      id: doc.id,
      category: doc.category,
      content: doc.content,
    })),
  };
}

module.exports = {
  getAnswer,
  retrieveRelevantDocuments,
};
