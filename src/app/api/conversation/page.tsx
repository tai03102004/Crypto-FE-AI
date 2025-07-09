// pages/ai-conversation.tsx
"use client"
import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, 
  Send, 
  Plus, 
  Trash2, 
  Bot, 
  User, 
  Search,
  Loader2,
  Menu,
  X
} from 'lucide-react';

interface Message {
  _id: string;
  content: string;
  role: 'user' | 'assistant';
  createdAt: string;
  conversationId: string;
}

interface Conversation {
  _id: string;
  title: string;
  user_id: string;
  updatedAt: string;
  createAt: string;
}

const AIConversationPage: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadConversations = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/ai-chat/conversations/tai');
      const data = await response.json();
      
      if (data.success) {
        setConversations(data.data);
        if (data.data.length > 0 && !currentConversation) {
          setCurrentConversation(data.data[0]);
          loadMessages(data.data[0]._id);
        }
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/ai-chat/conversations/${conversationId}/messages`);
      const data = await response.json();
      
      if (data.success) {
        setMessages(data.data);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const createNewConversation = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/ai-chat/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: 'tai',
          title: `Cuộc trò chuyện ${conversations.length + 1}`,
          description: 'Cuộc trò chuyện mới với AI'
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        setConversations(prev => [data.data, ...prev]);
        setCurrentConversation(data.data);
        setMessages([]);
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const deleteConversation = async (conversationId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/ai-chat/conversations/${conversationId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      if (data.success) {
        setConversations(prev => prev.filter(conv => conv._id !== conversationId));
        if (currentConversation?._id === conversationId) {
          const remainingConversations = conversations.filter(conv => conv._id !== conversationId);
          if (remainingConversations.length > 0) {
            setCurrentConversation(remainingConversations[0]);
            loadMessages(remainingConversations[0]._id);
          } else {
            setCurrentConversation(null);
            setMessages([]);
          }
        }
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !currentConversation || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    // Thêm tin nhắn user vào UI ngay lập tức
    const tempUserMessage: Message = {
      _id: Date.now().toString(),
      content: userMessage,
      role: 'user',
      createdAt: new Date().toISOString(),
      conversationId: currentConversation._id
    };
    setMessages(prev => [...prev, tempUserMessage]);

    try {
      const response = await fetch(`http://localhost:3000/api/ai-chat/conversations/${currentConversation._id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId: currentConversation._id,
          content: userMessage,
          imagesUrl: []
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Cập nhật tin nhắn với dữ liệu thực từ server
        setMessages(prev => [
          ...prev.slice(0, -1), // Loại bỏ tin nhắn temp
          data.data.userMessage,
          data.data.aiMessage
        ]);
        
        // Cập nhật thời gian của conversation
        setConversations(prev => 
          prev.map(conv => 
            conv._id === currentConversation._id 
              ? { ...conv, updatedAt: new Date().toISOString() }
              : conv
          ).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        );
      } else {
        const errorMessage: Message = {
          _id: (Date.now() + 1).toString(),
          content: 'Xin lỗi, có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại.',
          role: 'assistant',
          createdAt: new Date().toISOString(),
          conversationId: currentConversation._id
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        _id: (Date.now() + 1).toString(),
        content: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.',
        role: 'assistant',
        createdAt: new Date().toISOString(),
        conversationId: currentConversation._id
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('vi-VN', { 
      month: 'short',
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectConversation = (conversation: Conversation) => {
    setCurrentConversation(conversation);
    loadMessages(conversation._id);
    setSidebarOpen(false); // Đóng sidebar trên mobile
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 bg-white border-r border-gray-200 flex flex-col`}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Trò chuyện AI</h2>
            <button
              onClick={createNewConversation}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm cuộc trò chuyện..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <MessageCircle className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <p>Chưa có cuộc trò chuyện nào</p>
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <div
                key={conversation._id}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  currentConversation?._id === conversation._id ? 'bg-blue-50 border-blue-200' : ''
                }`}
                onClick={() => selectConversation(conversation)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{conversation.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {formatTime(conversation.updatedAt)}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteConversation(conversation._id);
                    }}
                    className="text-gray-400 hover:text-red-500 p-1 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-2">
              <Bot className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900">
                {currentConversation?.title || 'Chọn cuộc trò chuyện'}
              </h1>
            </div>
          </div>
          {currentConversation && (
            <div className="text-sm text-gray-500">
              Cập nhật: {formatTime(currentConversation.updatedAt)}
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!currentConversation ? (
            <div className="h-full flex items-center justify-center text-center">
              <div>
                <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Chào mừng đến với AI Chat</h3>
                <p className="text-gray-500">Tạo cuộc trò chuyện mới để bắt đầu</p>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-center">
              <div>
                <Bot className="h-16 w-16 mx-auto mb-4 text-blue-600" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Bắt đầu trò chuyện</h3>
                <p className="text-gray-500">Hãy gửi tin nhắn đầu tiên của bạn</p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div
                  key={message._id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-2xl rounded-lg p-4 ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-gray-200'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {message.role === 'user' ? (
                        <User className="h-5 w-5 mt-0.5 text-blue-200" />
                      ) : (
                        <Bot className="h-5 w-5 mt-0.5 text-blue-600" />
                      )}
                      <div className="flex-1">
                        <div className="prose prose-sm max-w-none">
                          <p className="whitespace-pre-wrap">{message.content}</p>
                        </div>
                        <p className={`text-xs mt-2 ${
                          message.role === 'user' ? 'text-blue-200' : 'text-gray-500'
                        }`}>
                          {formatTime(message.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <Bot className="h-5 w-5 text-blue-600" />
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                        <span className="text-sm text-gray-600">AI đang trả lời...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        {currentConversation && (
          <div className="bg-white border-t border-gray-200 p-4">
            <div className="max-w-4xl mx-auto flex items-end space-x-4">
              <div className="flex-1">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Nhập tin nhắn của bạn..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={1}
                  style={{ minHeight: '44px', maxHeight: '120px' }}
                  disabled={isLoading}
                />
              </div>
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Send className="h-4 w-4" />
                <span>Gửi</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIConversationPage;