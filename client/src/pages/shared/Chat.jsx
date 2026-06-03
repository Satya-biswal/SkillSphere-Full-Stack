import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import Navbar from '../../components/common/Navbar';
import { socket, connectSocket, disconnectSocket } from '../../socket/socket';
import api from '../../services/api';
import toast from 'react-hot-toast';

const Chat = () => {
  const { user } = useSelector((state) => state.auth);
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeout = useRef(null);

  useEffect(() => {
    connectSocket(user._id);
    fetchConversations();

    socket.on('receive_message', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on('typing', () => setIsTyping(true));
    socket.on('stop_typing', () => setIsTyping(false));

    return () => {
      disconnectSocket();
      socket.off('receive_message');
      socket.off('typing');
      socket.off('stop_typing');
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (selectedUser) fetchMessages(selectedUser._id);
  }, [selectedUser]);

  const fetchConversations = async () => {
    try {
      const res = await api.get('/chat/conversations');
      setConversations(res.data.conversations || []);
    } catch {
      // No conversations yet
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const res = await api.get(`/chat/messages/${userId}`);
      setMessages(res.data.messages || []);
    } catch {
      setMessages([]);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    const msg = {
      senderId: user._id,
      receiverId: selectedUser._id,
      message: newMessage.trim(),
      timestamp: new Date(),
    };

    // Emit via socket
    socket.emit('send_message', msg);

    // Save to DB
    try {
      await api.post('/chat/send', { receiverId: selectedUser._id, message: newMessage.trim() });
    } catch {
      // continue even if DB save fails
    }

    // Show in UI immediately
    setMessages((prev) => [...prev, { ...msg, senderId: user._id }]);
    setNewMessage('');
    socket.emit('stop_typing', { senderId: user._id, receiverId: selectedUser._id });
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    if (!selectedUser) return;
    socket.emit('typing', { senderId: user._id, receiverId: selectedUser._id });
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit('stop_typing', { senderId: user._id, receiverId: selectedUser._id });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-6xl mx-auto w-full px-6 py-6 flex gap-5" style={{ height: 'calc(100vh - 64px)' }}>
        
        {/* Sidebar */}
        <div className="w-72 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Messages</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {conversations.length === 0 ? (
              <div className="text-center py-10 px-4">
                <p className="text-3xl mb-2">💬</p>
                <p className="text-gray-400 text-sm">No conversations yet</p>
                <p className="text-gray-300 text-xs mt-1">Accept a proposal to start chatting</p>
              </div>
            ) : (
              conversations.map((conv) => (
                <button key={conv._id}
                  onClick={() => setSelectedUser(conv)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition ${
                    selectedUser?._id === conv._id ? 'bg-indigo-50' : 'hover:bg-gray-50'
                  }`}>
                  <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    {conv.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-gray-800 truncate">{conv.name}</p>
                    <p className="text-xs text-gray-400 capitalize">{conv.role}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                  {selectedUser.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{selectedUser.name}</p>
                  <p className="text-xs text-green-500">Online</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 && (
                  <div className="text-center py-10">
                    <p className="text-3xl mb-2">👋</p>
                    <p className="text-gray-400 text-sm">Say hello to {selectedUser.name}!</p>
                  </div>
                )}
                {messages.map((msg, i) => {
                  const isMine = msg.senderId === user._id || msg.senderId?._id === user._id;
                  return (
                    <div key={i} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm ${
                        isMine
                          ? 'bg-indigo-600 text-white rounded-br-sm'
                          : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                      }`}>
                        <p>{msg.message || msg.content}</p>
                        <p className={`text-xs mt-1 ${isMine ? 'text-indigo-200' : 'text-gray-400'}`}>
                          {new Date(msg.timestamp || msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                })}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 px-4 py-2.5 rounded-2xl rounded-bl-sm">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSend} className="p-4 border-t border-gray-100 flex gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={handleTyping}
                  placeholder="Type a message..."
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button type="submit" disabled={!newMessage.trim()}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition disabled:opacity-50">
                  Send
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-5xl mb-4">💬</p>
                <p className="text-gray-500 font-medium">Select a conversation</p>
                <p className="text-gray-400 text-sm mt-1">Choose from your conversations on the left</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
