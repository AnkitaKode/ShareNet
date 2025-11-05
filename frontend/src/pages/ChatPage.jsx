import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { MessageSquare, Send, ArrowLeft, MoreVertical, Trash2 } from 'lucide-react'; // added Trash2 icon
import { toast } from 'sonner';
import StarsBackground from '../components/StarsBackground';

const ChatPage = () => {
  const { userId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const [menuOpen, setMenuOpen] = useState(false); // for 3-dots menu

  const [user] = useState({
    id: userId,
    name: location.state?.ownerName || 'Item Owner',
    avatar: '/avatar-placeholder.jpg'
  });

  const getCurrentUserName = () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      return (
        currentUser.name ||
        currentUser.username ||
        user.name ||
        user.username ||
        'Current User'
      );
    } catch (error) {
      console.error('Error getting current user:', error);
      return 'Current User';
    }
  };

  const currentUserName = getCurrentUserName();

  // Initialize current user
  useEffect(() => {
    const initializeCurrentUser = () => {
      try {
        const currentUser = localStorage.getItem('currentUser');
        const user = localStorage.getItem('user');

        if (!currentUser && !user) {
          const defaultUser = {
            id: 'current_user_1',
            name: 'Current User',
            username: 'current_user'
          };
          localStorage.setItem('currentUser', JSON.stringify(defaultUser));
        }
      } catch (error) {
        console.error('Error initializing current user:', error);
      }
    };

    initializeCurrentUser();
  }, []);

  useEffect(() => {
    const loadMessages = () => {
      try {
        const chatKey = `chat_${userId}`;
        const savedMessages = localStorage.getItem(chatKey);
        if (savedMessages) {
          setMessages(JSON.parse(savedMessages));
        } else if (location.state?.initialMessage) {
          const welcomeMessage = {
            id: Date.now(),
            sender: userId,
            senderName: user.name,
            text: `Hi there! are you interested in your item "${
              location.state.itemName || ''
            }"`,
            timestamp: new Date()
          };
          setMessages([welcomeMessage]);
          localStorage.setItem(chatKey, JSON.stringify([welcomeMessage]));
        }
      } catch (error) {
        console.error('Error loading messages:', error);
        toast.error('Failed to load chat history');
      } finally {
        setLoading(false);
      }
    };

    loadMessages();

    const handleStorageChange = (e) => {
      if (e.key === `chat_${userId}`) {
        try {
          const updatedMessages = JSON.parse(e.newValue || '[]');
          setMessages(updatedMessages);
        } catch (error) {
          console.error('Error parsing updated messages:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [userId, location.state, user.name]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      sender: 'current',
      senderName: currentUserName,
      text: newMessage,
      timestamp: new Date()
    };

    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    setNewMessage('');

    try {
      const chatKey = `chat_${userId}`;
      localStorage.setItem(chatKey, JSON.stringify(updatedMessages));
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error('Error saving message:', error);
      toast.error('Failed to send message');
    }
  };

  // 🗑 Delete Chat
  const handleDeleteChat = () => {
    try {
      const chatKey = `chat_${userId}`;
      localStorage.removeItem(chatKey);
      setMessages([]);
      toast.success('Chat deleted');
      setMenuOpen(false);
    } catch (error) {
      console.error('Error deleting chat:', error);
      toast.error('Failed to delete chat');
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="text-white text-lg">Loading chat...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative bg-gray-900 text-white">
      <StarsBackground />
      <div className="relative z-10 max-w-3xl mx-auto h-screen flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-white/10 bg-gray-800 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="p-1 mr-3 text-gray-300 hover:text-white rounded-full hover:bg-white/10"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium mr-3 overflow-hidden">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  user.name.charAt(0)
                )}
              </div>
              <div>
                <h3 className="font-medium text-white">{user.name}</h3>
                <p className="text-xs text-green-400 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                  Online
                </p>
              </div>
            </div>

            {/* Three dots menu */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-full"
                title="More options"
              >
                <MoreVertical className="w-5 h-5" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-gray-800 border border-white/10 rounded-lg shadow-lg z-20">
                  <button
                    onClick={handleDeleteChat}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-700 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" /> Delete Chat
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-900 to-gray-800">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === 'current' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`flex items-start gap-2 max-w-[80%] ${
                  message.sender === 'current'
                    ? 'flex-row-reverse'
                    : 'flex-row'
                }`}
              >
                {message.sender !== 'current' && (
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium flex-shrink-0 mt-1">
                    {user.name.charAt(0)}
                  </div>
                )}
                <div className="flex flex-col">
                  {message.sender !== 'current' && (
                    <span className="text-xs text-gray-400 mb-1">
                      {message.senderName || user.name}
                    </span>
                  )}
                  <div
                    className={`p-3 rounded-2xl ${
                      message.sender === 'current'
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-tr-none'
                        : 'bg-gray-700 text-white rounded-tl-none'
                    }`}
                  >
                    <p className="break-words">{message.text}</p>
                    <p
                      className={`text-xs opacity-70 mt-1 ${
                        message.sender === 'current'
                          ? 'text-blue-100'
                          : 'text-gray-400'
                      } text-right`}
                    >
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form
          onSubmit={handleSendMessage}
          className="p-4 bg-gray-800 border-t border-white/10"
        >
          <div className="flex items-end gap-2">
            <div className="flex-1 relative">
              <textarea
                className="w-full min-h-[50px] max-h-32 p-3 pr-12 bg-gray-700 text-white rounded-xl border-0 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                rows="1"
                onInput={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = e.target.scrollHeight + 'px';
                }}
              />
              <button
                type="button"
                className="absolute right-3 bottom-3 text-gray-400 hover:text-white"
                onClick={() => {}}
              >
                <MessageSquare className="w-5 h-5" />
              </button>
            </div>
            <button
              type="submit"
              className={`p-3 rounded-full ${
                newMessage.trim()
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              } transition-colors`}
              disabled={!newMessage.trim()}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
