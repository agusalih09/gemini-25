const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');
 
form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage('user', userMessage);
  input.value = '';

  // setTimeout(() => {
  //   // appendMessage('bot', 'Gemini is thinking... (this is dummy response)');
  // }, 700);
 
  const thinkingMsgElement = appendMessage('bot', 'Loading...');
 
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      
      body: JSON.stringify({ message: userMessage }),
    });

    chatBox.removeChild(thinkingMsgElement);
 
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'An unknown error occurred.' }));
      throw new Error(errorData.error || `Server responded with status: ${response.status}`);
    }
 
    const data = await response.json();
    appendMessage('bot', data.response);

  } catch (error) {
    console.error('Fetch error:', error);
    
    if (thinkingMsgElement && thinkingMsgElement.parentNode === chatBox) {
        chatBox.removeChild(thinkingMsgElement);
    }
    appendMessage('bot', `Sorry, something went wrong. ${error.message}`);
  }
});

 
function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  return msg;
};

