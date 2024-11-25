import { useEffect, useRef, useState } from 'react'

function App() {
  const [messages, setMessages] = useState<string[]>(['hi there folks!']);
  const inputRef = useRef<HTMLInputElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  function sendMessage() {
    const message = inputRef.current?.value;
    if (message && message.trim()) {
      wsRef.current?.send(JSON.stringify({
        type: 'chat',
        payload: {
          message: message
        }
      }));
      
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8081');

    ws.onmessage = (event) => {
      setMessages((prevMessages) => [...prevMessages, event.data]);
    }

    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket opened');
      ws.send(JSON.stringify({
        type: 'join',
        payload: {
          roomId: 'room1'
        }
      }))
    }

    return () => {
      ws.close();
    };
  }, [])

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen w-full flex items-center justify-center">
      <div className="w-full max-w-md mx-auto h-[90vh] flex flex-col bg-gray-800 rounded-xl border-2 border-purple-600/30 shadow-2xl overflow-hidden">
        <div className="flex-grow overflow-y-auto p-4 space-y-4 
          scrollbar-thin 
          scrollbar-track-gray-700 
          scrollbar-thumb-purple-600/50 
          hover:scrollbar-thumb-purple-600/70
          scroll-smooth
          custom-scrollbar">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className="flex justify-start"
            >
              <span className="bg-gray-700 text-white px-4 py-2 rounded-lg max-w-[85%] break-words shadow-md border border-gray-600/50">
                {message}
              </span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="sticky bottom-0 bg-gray-800 p-4 flex space-x-2 border-t border-purple-600/30">
          <input 
            ref={inputRef}
            type="text" 
            placeholder="Type a message..."
            onKeyPress={handleKeyPress}
            className="flex-grow p-2 rounded-lg bg-gray-700 text-white 
              focus:outline-none 
              focus:ring-2 
              focus:ring-purple-500 
              border 
              border-gray-600 
              focus:border-purple-500"
          />
          <button 
            onClick={sendMessage} 
            className="bg-purple-600 hover:bg-purple-700 
              text-white px-4 py-2 
              rounded-lg 
              transition-colors 
              border 
              border-purple-500/50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

export default App;