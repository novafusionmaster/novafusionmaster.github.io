// Código de interação de chat e IA
let recognition;
let isListening = false;

function startRecognition(callback) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.lang = "pt-BR";
  recognition.interimResults = false;
  recognition.continuous = false;

  recognition.onresult = function (event) {
    const text = event.results[0][0].transcript;
    callback(text);
  };

  recognition.onerror = function (event) {
    console.error("Erro no reconhecimento de voz:", event.error);
  };

  recognition.onend = function () {
    if (isListening) {
      recognition.start();
    }
  };

  isListening = true;
  recognition.start();
}

function stopRecognition() {
  if (recognition) {
    recognition.stop();
    isListening = false;
  }
}

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "pt-BR";
  speechSynthesis.speak(utterance);
}

// Função de processamento de IA
async function iaraProcess(command) {
  try {
    console.log("Comando recebido:", command);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getApiKey()}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Você é a Iara, assistente integrada no site do Otávio. Responda em português." },
          { role: "user", content: command }
        ]
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Não entendi o comando.";

    speak(reply);
    showInChat("Iara", reply);

  } catch (error) {
    console.error("Erro no processamento:", error);
    speak("Ocorreu um erro ao processar seu pedido.");
  }
}

// Funções de interação no chat
function showInChat(sender, message) {
  const chatBox = document.getElementById("iara-chat");
  if (!chatBox) return;

  const bubble = document.createElement("div");
  bubble.className = sender === "Iara" ? "iara-bubble" : "user-bubble";
  bubble.textContent = message;

  chatBox.appendChild(bubble);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function initIara() {
  const micBtn = document.getElementById("iara-mic");
  const chatInput = document.getElementById("iara-input");
  const sendBtn = document.getElementById("iara-send");

  if (micBtn) {
    micBtn.addEventListener("click", () => {
      if (isListening) {
        stopRecognition();
        micBtn.textContent = "🎤";
      } else {
        startRecognition((text) => {
          showInChat("Você", text);
          iaraProcess(text);
          micBtn.textContent = "⏹️";
        });
      }
    });
  }

  if (sendBtn && chatInput) {
    sendBtn.addEventListener("click", () => {
      const text = chatInput.value.trim();
      if (text) {
        showInChat("Você", text);
        iaraProcess(text);
        chatInput.value = "";
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", initIara);