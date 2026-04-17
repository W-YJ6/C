import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState('新建问答');
  const [currentModule, setCurrentModule] = useState('chat');
  const [showInitialScreen, setShowInitialScreen] = useState(true);

  // 建议问题列表
  const suggestions = [
    '在实际工作中，采用两段碱洗法鉴定控制裂解反应应注意什么？',
    '简述离心泵启动后，功率、扬程、效率随泵出口阀门开度的变化。',
    '在乙烯选择性氧化反应中，Pd/Al₂O₃催化剂的中毒现象是如何发生的？',
    '在相应设计温度下，确定容器壁厚计算厚度及其他元件尺寸时，还需要考虑什么因素？',
    '请从精馏原理，说明实际精确定态操作的必要条件是什么？'
  ];

  // 历史对话列表
  const historyConversations = [
    '你好',
    '一般碳钢难以达到的容器使用寿命...'
  ];

  // 处理菜单项点击
  const handleMenuItemClick = (menuItem) => {
    setActiveMenuItem(menuItem);
    switch(menuItem) {
      case '新建问答':
        setCurrentModule('chat');
        break;
      case '我的知识库':
        setCurrentModule('knowledge');
        break;
      case '深度研究':
        setCurrentModule('research');
        break;
      case '历史对话':
        setCurrentModule('history');
        break;
      default:
        setCurrentModule('chat');
    }
  };

  // 处理发送消息
  const handleSend = async () => {
    if (!input.trim()) return;

    // 首次发送消息时，切换到对话界面并添加欢迎消息
    if (showInitialScreen) {
      setShowInitialScreen(false);
      // 添加用户消息
      const newUserMessage = {
        id: Date.now(),
        content: input,
        type: 'user'
      };
      setMessages([newUserMessage]);
    } else {
      // 添加用户消息
      const newUserMessage = {
        id: Date.now(),
        content: input,
        type: 'user'
      };
      setMessages(prev => [...prev, newUserMessage]);
    }

    setInput('');
    setLoading(true);

    try {
      // 调用DeepSeek API
      const response = await axios.post(
        'https://api.deepseek.com/v1/chat/completions',
        {
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: '你是智能煤化工大模型—榆林大学，由榆林大学开发，专注于煤化工领域的智能问答和研究。在化工领域有丰富的知识储备，能够解答问题，协助研发及灵感。'
            },
            {
              role: 'user',
              content: input
            }
          ],
          temperature: 0.7,
          max_tokens: 1024
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer sk-6b7ab48e6be94141822428a0cea842b5'
          }
        }
      );

      // 添加AI回复
      const aiResponse = {
        id: Date.now() + 1,
        content: response.data.choices[0].message.content,
        type: 'ai'
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('API调用失败:', error);
      // 添加错误消息
      const errorMessage = {
        id: Date.now() + 1,
        content: '抱歉，服务暂时不可用，请稍后再试。',
        type: 'ai'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // 处理建议问题点击
  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
  };

  // 处理键盘事件
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.shiftKey) {
      // Shift+Enter 换行
      return;
    } else if (e.key === 'Enter') {
      // Enter 发送
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="container">
      {/* 左侧导航栏 */}
      <div className="sidebar">
        <div className="sidebar-header">
          智能煤化工大模型
          <span>📋</span>
        </div>
        
        <div className="sidebar-menu">
          <div 
            className={`sidebar-item ${activeMenuItem === '新建问答' ? 'active' : ''}`}
            onClick={() => handleMenuItemClick('新建问答')}
          >
            新建问答
          </div>
          <div 
            className={`sidebar-item ${activeMenuItem === '我的知识库' ? 'active' : ''}`}
            onClick={() => handleMenuItemClick('我的知识库')}
          >
            我的知识库
            <span>▶</span>
          </div>
          <div 
            className={`sidebar-item ${activeMenuItem === '深度研究' ? 'active' : ''}`}
            onClick={() => handleMenuItemClick('深度研究')}
          >
            深度研究
            <span>▶</span>
          </div>
          <div 
            className={`sidebar-item ${activeMenuItem === '历史对话' ? 'active' : ''}`}
            onClick={() => handleMenuItemClick('历史对话')}
          >
            历史对话
          </div>
        </div>

        {/* 历史对话列表 */}
        <div className="sidebar-menu" style={{ marginTop: '20px' }}>
          {historyConversations.map((item, index) => (
            <div key={index} className={`sidebar-item ${index === 0 ? 'active' : ''}`}>
              {item}
            </div>
          ))}
        </div>

        <div className="sidebar-footer">
          <div>仅保留最近一个月的对话记录</div>
          <div style={{ marginTop: '10px' }}>1xxxxxxxxxx</div>
        </div>
      </div>

      {/* 右侧主内容区 */}
      <div className="main-content">
        {/* 右侧顶部用户信息 */}
        <div className="main-header">
          <div className="university-logo">
            <span className="logo-icon">🏫</span>
            <span className="logo-text">榆林大学</span>
          </div>
          <button className="icon-btn">⚙️</button>
        </div>
        
        <div className="chat-container">
          {/* 新建问答模块 */}
          {currentModule === 'chat' && (
            <>
              {/* 初始界面（第二张图片） */}
              {showInitialScreen && (
                <div className="initial-screen">
                  <div className="initial-header">
                    <h1 className="initial-title">智能煤化工大模型</h1>
                    <p className="initial-subtitle">我在化工领域有着丰富的知识储备，我能够帮你答疑解惑，协助你迸发灵感。</p>
                  </div>
                  
                  {/* 输入区域 */}
                  <div className="initial-input-container">
                    <textarea
                      className="initial-input"
                      placeholder="你可以向我询问任何化工领域问题，Shift+Enter换行"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={loading}
                    />
                    <div className="input-actions">
                      <div className="input-options">
                        <input type="checkbox" id="deep-think" />
                        <label htmlFor="deep-think">深度思考</label>
                        <input type="checkbox" id="knowledge-enhance" style={{ marginLeft: '15px' }} />
                        <label htmlFor="knowledge-enhance">知识增强</label>
                      </div>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <button className="option-btn">📎</button>
                        <button className="option-btn">🎤</button>
                        <button 
                          className="send-btn" 
                          onClick={handleSend}
                          disabled={loading}
                        >
                          {loading ? '发送中...' : '➤'}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* 建议问题 */}
                  <div className="suggestions">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        className="suggestion-btn"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                  
                  {/* 底部信息 */}
                  <div className="chat-footer">
                    <p>内容由AI生成，可能会犯错，请仔细甄别</p>
                    <p>版权所有 © 2026 榆林大学 | 陕ICP备2*********号 | 隐私政策</p>
                  </div>
                </div>
              )}
              
              {/* 对话界面（第一张图片） */}
              {!showInitialScreen && (
                <>
                  {/* 聊天消息区域 */}
                  <div className="chat-messages">
                    {messages.map((message) => (
                      <div 
                        key={message.id} 
                        className={`message ${message.type === 'user' ? 'user-message' : 'ai-message'}`}
                      >
                        <div className="message-content">{message.content}</div>
                        {message.type === 'ai' && (
                          <div className="message-actions">
                            <button className="action-btn">↻</button>
                            <button className="action-btn">📋</button>
                            <button className="action-btn">👍</button>
                            <button className="action-btn">👎</button>
                          </div>
                        )}
                      </div>
                    ))}
                    {loading && (
                      <div className="message ai-message">
                        <div className="message-content">正在思考...</div>
                      </div>
                    )}
                  </div>

                  {/* 输入区域 */}
                  <div className="chat-input-container">
                    <textarea
                      className="chat-input"
                      placeholder="你可以向我提问任何化工领域问题，Shift+Enter换行"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={loading}
                    />
                    <div className="input-actions">
                      <div className="input-options">
                        <input type="checkbox" id="deep-think" />
                        <label htmlFor="deep-think">深度思考</label>
                        <input type="checkbox" id="knowledge-enhance" style={{ marginLeft: '15px' }} />
                        <label htmlFor="knowledge-enhance">知识增强</label>
                      </div>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <button className="option-btn">📎</button>
                        <button className="option-btn">🎤</button>
                        <button 
                          className="send-btn" 
                          onClick={handleSend}
                          disabled={loading}
                        >
                          {loading ? '发送中...' : '➤'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 底部信息 */}
                  <div className="chat-footer">
                    <p>内容由AI生成，可能会犯错，请仔细甄别</p>
                    <p>陕ICP备50012177号 皖公网安备 3401820200231号</p>
                  </div>
                </>
              )}
            </>
          )}

          {/* 我的知识库模块 */}
          {currentModule === 'knowledge' && (
            <div className="module-content">
              <h2>我的知识库</h2>
              <p>这里是您的知识库管理界面，您可以添加、编辑和管理您的化工领域知识。</p>
              <div className="knowledge-list">
                <div className="knowledge-item">
                  <h3>煤化工基础</h3>
                  <p>包含煤化工领域的基本概念和原理</p>
                </div>
                <div className="knowledge-item">
                  <h3>催化剂技术</h3>
                  <p>关于煤化工催化剂的最新研究和应用</p>
                </div>
                <div className="knowledge-item">
                  <h3>工艺流程</h3>
                  <p>煤化工生产的主要工艺流程和技术参数</p>
                </div>
              </div>
            </div>
          )}

          {/* 深度研究模块 */}
          {currentModule === 'research' && (
            <div className="module-content">
              <h2>深度研究</h2>
              <p>这里是深度研究界面，您可以进行更深入的化工领域研究和分析。</p>
              <div className="research-tools">
                <div className="tool-item">
                  <h3>反应机理分析</h3>
                  <p>分析煤化工反应的详细机理和动力学</p>
                </div>
                <div className="tool-item">
                  <h3>催化剂设计</h3>
                  <p>基于AI的催化剂设计和优化</p>
                </div>
                <div className="tool-item">
                  <h3>工艺模拟</h3>
                  <p>煤化工工艺流程的计算机模拟和优化</p>
                </div>
              </div>
            </div>
          )}

          {/* 历史对话模块 */}
          {currentModule === 'history' && (
            <div className="module-content">
              <h2>历史对话</h2>
              <p>这里是您的历史对话记录，您可以查看和管理过往的对话。</p>
              <div className="history-list">
                {historyConversations.map((item, index) => (
                  <div key={index} className="history-item">
                    <p>{item}</p>
                    <span className="history-time">2024-04-17 10:{index < 10 ? '0' : ''}{index}:00</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;