// Check console capture status
console.log('=== CONSOLE CAPTURE STATUS CHECK ===');
console.log('Console capture instance:', window.consoleCapture);
if (window.consoleCapture) {
  const stats = window.consoleCapture.getMessageStats();
  const allMessages = window.consoleCapture.getAllMessages();
  console.log('Total messages captured:', stats.total);
  console.log('Message breakdown:', stats);
  console.log('Recent messages (last 5):', allMessages.slice(-5));
  console.log('All message timestamps:', allMessages.map(m => ({ 
    timestamp: new Date(m.timestamp).toLocaleTimeString(), 
    level: m.level, 
    message: m.message.substring(0, 50) + '...' 
  })));
} else {
  console.log('Console capture not available yet');
}
console.log('=== END STATUS CHECK ===');