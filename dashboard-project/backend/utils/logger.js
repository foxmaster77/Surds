// =====================
// Logger Configuration
// =====================

const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

class Logger {
  constructor() {
    this.logFile = path.join(logsDir, `app-${new Date().toISOString().split('T')[0]}.log`);
    this.errorFile = path.join(logsDir, `error-${new Date().toISOString().split('T')[0]}.log`);
  }

  // Format log message
  formatMessage(level, message, data = {}) {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] ${message} ${Object.keys(data).length ? JSON.stringify(data) : ''}`;
  }

  // Write to file
  writeToFile(filePath, message) {
    fs.appendFileSync(filePath, message + '\n', 'utf8');
  }

  // Info level logging
  info(message, data = {}) {
    const formattedMessage = this.formatMessage('INFO', message, data);
    console.log(formattedMessage);
    this.writeToFile(this.logFile, formattedMessage);
  }

  // Warning level logging
  warn(message, data = {}) {
    const formattedMessage = this.formatMessage('WARN', message, data);
    console.warn(formattedMessage);
    this.writeToFile(this.logFile, formattedMessage);
  }

  // Error level logging
  error(message, error = {}) {
    const errorData = {
      message: error.message,
      stack: error.stack,
      ...error
    };
    const formattedMessage = this.formatMessage('ERROR', message, errorData);
    console.error(formattedMessage);
    this.writeToFile(this.errorFile, formattedMessage);
  }

  // Debug level logging
  debug(message, data = {}) {
    if (process.env.NODE_ENV === 'development') {
      const formattedMessage = this.formatMessage('DEBUG', message, data);
      console.log(formattedMessage);
      this.writeToFile(this.logFile, formattedMessage);
    }
  }
}

module.exports = new Logger();
