import axios from 'axios';

const CHATBOT_API_URL = process.env.REACT_APP_CHATBOT_API_URL;

const chatbotService = {
    sendMessage: async (message) => {
        try {
            const response = await axios.post(`${CHATBOT_API_URL}/ask`, {
                question: message
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default chatbotService; 