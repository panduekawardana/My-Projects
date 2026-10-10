const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

// Maintains multi-turn conversation history for the backend API
const conversation = [];

/**
 * Appends a message bubble to the chat box.
 * @param {'user' | 'bot'} sender - Message sender ('user' or 'bot')
 * @param {string} text - Message text
 * @returns {HTMLDivElement} - The created message DOM element
 */
function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.textContent = text; // Safe against XSS
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  return msg;
}

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  // 1. Add user message to UI and clear input field
  appendMessage('user', userMessage);
  input.value = '';

  // 2. Add user message to conversation history
  conversation.push({ role: 'user', text: userMessage });

  // 3. Display temporary "Thinking..." bot message and keep a reference to it
  const botMessageElement = appendMessage('bot', 'Thinking...');

  // 4. Disable input and submit button while waiting for response
  const submitButton = form.querySelector('button');
  input.disabled = true;
  if (submitButton) submitButton.disabled = true;

  let isSuccess = false;

  try {
    // 5. Send POST request to backend with conversation history
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ conversation }),
    });

    if (!response.ok) {
      throw new Error(`Server returned status: ${response.status}`);
    }

    const data = await response.json();

    // 6. Replace "Thinking..." with AI response from data.result (or data.message)
    const replyText = data?.result || data?.message;
    if (replyText && typeof replyText === 'string' && replyText.trim()) {
      botMessageElement.textContent = replyText;
      conversation.push({ role: 'model', text: replyText });
      isSuccess = true;
    } else {
      botMessageElement.textContent = 'Sorry, no response received.';
    }
  } catch (error) {
    console.error('Error fetching chat response:', error);
    botMessageElement.textContent = 'Failed to get response from server.';
  } finally {
    // If the request was unsuccessful, remove the pending user message
    // so conversation alternation remains valid for the next retry
    if (!isSuccess) {
      conversation.pop();
    }

    // Re-enable form controls and refocus input
    input.disabled = false;
    if (submitButton) submitButton.disabled = false;
    input.focus();

    // Keep chat box scrolled to the bottom
    chatBox.scrollTop = chatBox.scrollHeight;
  }
});
