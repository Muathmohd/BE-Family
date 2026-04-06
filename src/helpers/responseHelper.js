const errorMessages = require('../config/errorMessages.json');

class ResponseHelper {
  static success(response = {}) {
    return {
      is_successful: true,
      error_code: "",
      error_msg: "",
      response: response
    };
  }

  static error(errorCode, appCode = "BE-Family", response = {}, language = 'ar') {
    const errorData = errorMessages[errorCode];
    let errorMsg = "Unknown error";
    
    if (errorData) {
      errorMsg = errorData[language] || errorData['en'] || "Unknown error";
    }
    
    return {
      is_successful: false,
      error_code: parseInt(errorCode),
      error_msg: errorMsg,
      app_code: appCode,
      response: response
    };
  }

  static getErrorMessage(errorCode, language = 'ar') {
    const errorData = errorMessages[errorCode];
    if (errorData) {
      return errorData[language] || errorData['en'] || "Unknown error";
    }
    return "Unknown error";
  }
}

module.exports = ResponseHelper;
