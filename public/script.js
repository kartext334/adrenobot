const chatBody = document.getElementById('chat-body');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

let isChatbotTyping = false;
let typingIntervalId = null;
let typingIndicatorMessage = 'Typing';

function displayUserMessage(message) {
    const userMessage = document.createElement('div');
    userMessage.className = 'user-message';
    userMessage.innerText = message;
    chatBody.appendChild(userMessage);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function displayChatbotMessage(message) {
    if (isChatbotTyping) {
        clearInterval(typingIntervalId);
        const typingIndicator = chatBody.querySelector('.typing-indicator');
        if (typingIndicator) {
            chatBody.removeChild(typingIndicator);
        }
        isChatbotTyping = false;
        typingIndicatorMessage = 'Typing';
    }

    const chatbotMessage = document.createElement('div');
    chatbotMessage.className = 'chatbot-message';
    chatbotMessage.innerText = message;
    chatBody.appendChild(chatbotMessage);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function displayTypingIndicator() {
    if (!isChatbotTyping) {
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'chatbot-message typing-indicator';
        typingIndicator.innerText = typingIndicatorMessage;
        chatBody.appendChild(typingIndicator);
        chatBody.scrollTop = chatBody.scrollHeight;
        isChatbotTyping = true;

        typingIntervalId = setInterval(() => {
            if (typingIndicatorMessage === 'Typing...') {
                typingIndicatorMessage = 'Typing';
            } else {
                typingIndicatorMessage += '.';
            }
            typingIndicator.innerText = typingIndicatorMessage;
        }, 400);
    }
}

async function sendMessage() {
    const message = userInput.value.trim();
    if (message === '') return;

    displayUserMessage(message);
    userInput.value = '';

    try {
        displayTypingIndicator();

        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                promptContent: message,
                systemContent: "Sen profesyonel bir müşteri destek chatbotusun.",
                previousChat: ""
            }),
        });

        if (!response.ok) {
            throw new Error('API isteği başarısız');
        }

        const data = await response.json();
        displayChatbotMessage(data.reply);

    } catch (error) {
        console.error('Error:', error);
        displayChatbotMessage("Üzgünüm, şu anda yanıt veremiyorum.");
    }
}

sendButton.addEventListener('click', sendMessage);

userInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        sendMessage();
    }
});

displayChatbotMessage("Merhaba, ben AdrenoBot 🤖 Size nasıl yardımcı olabilirim?");
