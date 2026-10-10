export function triggerChatBot(prompt) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('open-chat-bot', { detail: { prompt } }));
  }
}
