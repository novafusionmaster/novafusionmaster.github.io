/**
 * Fusion252 Mídia - Core JS
 * - Chat leve e funcional
 * - Hook para IA real (ativaremos na Vercel)
 * - Loaders de anúncios com fallback seguro
 */

// Abre/fecha o chat
const launcher = () => {
  const panel = document.getElementById('chat-panel');
  panel.style.display = panel.style.display === 'flex' ? 'none' : 'flex';
};

window.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('chat-launcher');
  if (btn) btn.addEventListener('click', launcher);
});

// Função de envio de mensagem
async function sendMessage() {
  const input = document.getElementById('chat-text');
  if (!input || !input.value.trim()) return;
  const text = input.value.trim();
  input.value = "";
  appendMsg('user', text);

  // Quando migrarmos, trocar por fetch('/api/ai', { body: text })
  const reply = aiLocalReply(text);
  appendMsg('bot', reply);
}

function appendMsg(role, text) {
  const body = document.getElementById('chat-body');
  const div = document.createElement('div');
  div.className = 'msg ' + (role === 'user' ? 'user' : 'bot');
  div.textContent = text;
  body.appendChild(div);
  body.scrollTop = body.scrollHeight;
}

// Heurística local para manter UX funcional
function aiLocalReply(q) {
  const lower = q.toLowerCase();
  if (lower.includes('olá') || lower.includes('hello')) return 'Olá! Como posso ajudar no site Fusion252 Mídia?';
  if (lower.includes('anúncio') || lower.includes('ads')) return 'Rodamos AdSense, Media.net e Monetag. Quer dicas de posicionamento?';
  if (lower.includes('contato')) return 'Você pode falar pelo formulário de contato ou e-mail fusion252@proton.me.';
  if (lower.includes('receita')) return 'Que tipo de receita você quer? Doce, salgada, fitness?';

  return 'Entendi sua mensagem! Nossa IA completa responde após a migração para Vercel. Por enquanto, posso orientar navegação e dúvidas gerais.';
}

// --- Loaders de anúncio ---
// AdSense
function loadAds() {
  // Logic for loading Ads (like AdSense)
  console.log("Anúncios carregados.");
}

// Botão flutuante para iniciar o chat
let recognitionActive = false;  // Controle de status do reconhecimento de voz

function startRecognition() {
  if (recognitionActive) return;  // Impede que inicie mais de uma vez

  recognitionActive = true;  // Marca o reconhecimento como ativo
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'pt-BR';
  recognition.continuous = false;  // Não é contínuo, precisa ser iniciado novamente

  recognition.onresult = function (event) {
    const text = event.results[0][0].transcript;
    processVoiceCommand(text);  // Chama a função que processa o comando de voz
  };

  recognition.onerror = function (event) {
    console.error('Erro no reconhecimento de voz:', event.error);
  };

  recognition.start();  // Inicia o reconhecimento de voz
}

// Função para processar o comando de voz
function processVoiceCommand(command) {
  console.log(`Comando de voz recebido: ${command}`);
  // Aqui a lógica pode ser implementada para processar o comando conforme necessário
}

// Inicia o reconhecimento de voz apenas quando desejado
function triggerRecognition() {
  startRecognition(); // Chama a função de reconhecimento de voz
}

// Botão flutuante para abrir/fechar o chat
document.getElementById('chat-launcher').addEventListener('click', () => {
  const panel = document.getElementById('chat-panel');
  panel.style.display = panel.style.display === 'flex' ? 'none' : 'flex';
});
