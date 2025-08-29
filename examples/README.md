# Frontend Examples

This directory contains example implementations for integrating with the Resume AI API.

## 🌟 Available Examples

### 1. **chat-example.html** - Complete Chat Demo
A fully functional HTML/CSS/JavaScript demo showcasing:
- ✅ Real-time chat with Elevatr AI
- ✅ Conversation management
- ✅ Beautiful responsive UI
- ✅ Error handling and API status checking
- ✅ Quick action buttons for common questions
- ✅ Easter eggs and keyboard shortcuts

**How to use:**
1. Start the API server: `npm run dev`
2. Open `chat-example.html` in your browser
3. Start chatting with Elevatr!

### 2. **TypeScript Integration Examples**
Check the main [Frontend Integration Guide](../FRONTEND_INTEGRATION.md) for:
- React hooks and components
- Vue.js composables 
- Complete TypeScript interfaces
- Advanced error handling
- Production-ready patterns

## 🚀 Quick Start

```bash
# Start the API server
npm run dev

# Open the demo (macOS)
npm run demo

# Or manually open
open examples/chat-example.html
```

## 🔧 Customization

The HTML example is fully self-contained and can be customized by:

1. **Styling**: Modify the CSS in the `<style>` section
2. **API URL**: Change `API_BASE_URL` in the JavaScript
3. **Features**: Add new quick actions or modify the chat interface
4. **Personality**: Customize Elevatr's welcome message and behavior

## 🌐 Framework Examples

For React, Vue, Angular, or other frameworks, see the comprehensive examples in:
- **[FRONTEND_INTEGRATION.md](../FRONTEND_INTEGRATION.md)**

## 🐛 Troubleshooting

**Chat not working?**
- Ensure API server is running on port 3000
- Check browser console for errors
- Verify CORS settings in API server

**API errors?**
- Check if `OPEN_API_KEY` is set in `.env` for full AI features
- Without API key, you'll get mock responses (still functional!)

**CORS issues?**
- The API allows `localhost` origins by default
- For production, update `ALLOWED_ORIGINS` in server config

## 💡 Next Steps

1. Try the HTML demo to understand the API flow
2. Implement your own frontend using the integration guide
3. Customize Elevatr's personality and responses
4. Add authentication for multi-user scenarios
5. Implement file upload for resume documents

Happy coding! 🎯
