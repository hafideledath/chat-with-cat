/**
 * Translation utility for the Chat with Cat application
 * Provides functions to translate UI text based on the user's selected native language
 */

// Translations for UI elements
const translations = {
  // English (default)
  en: {
    settings: "Settings",
    volume: "Volume",
    music: "Music",
    soundEffects: "Sound Effects",
    fontSize: "Font Size",
    small: "Small",
    medium: "Medium",
    large: "Large",
    dyslexicMode: "Dyslexic-friendly Mode",
    holdSpacebar: "Hold Spacebar",
    recording: "Recording...",
    catSpeaking: "Cat is speaking...",
    interfaceLanguage: "Interface Language",
    aiPersonality: "AI Personality",
    simple: "Simple",
    funny: "Funny",
    educational: "Educational",
    simpleDesc: "Clear, concise responses",
    funnyDesc: "Playful, humorous responses",
    educationalDesc: "Informative, detailed responses",
    loading: "Loading...",
    sendMessage: "Send Message",
    chatInFrench: "Chat en français",
    chatInEnglish: "Chat in English",
    chatInSpanish: "Chatear en español"
  },
  // French translations
  fr: {
    settings: "Paramètres",
    volume: "Volume",
    music: "Musique",
    soundEffects: "Effets sonores",
    fontSize: "Taille de police",
    small: "Petit",
    medium: "Moyen",
    large: "Grand",
    dyslexicMode: "Mode pour dyslexiques",
    holdSpacebar: "Maintenez la barre d'espace",
    recording: "Enregistrement...",
    catSpeaking: "Le chat parle...",
    interfaceLanguage: "Langue de l'interface",
    aiPersonality: "Personnalité de l'IA",
    simple: "Simple",
    funny: "Drôle",
    educational: "Éducatif",
    simpleDesc: "Réponses claires et concises",
    funnyDesc: "Réponses ludiques et humoristiques",
    educationalDesc: "Réponses informatives et détaillées",
    loading: "Chargement...",
    sendMessage: "Envoyer le message",
    chatInFrench: "Chat en français",
    chatInEnglish: "Chat en anglais",
    chatInSpanish: "Chat en espagnol"
  },
  // Spanish translations
  es: {
    settings: "Configuración",
    volume: "Volumen",
    music: "Música",
    soundEffects: "Efectos de sonido",
    fontSize: "Tamaño de fuente",
    small: "Pequeño",
    medium: "Mediano",
    large: "Grande",
    dyslexicMode: "Modo amigable para disléxicos",
    holdSpacebar: "Mantén la barra espaciadora",
    recording: "Grabando...",
    catSpeaking: "El gato está hablando...",
    interfaceLanguage: "Idioma de la interfaz",
    aiPersonality: "Personalidad de la IA",
    simple: "Simple",
    funny: "Gracioso",
    educational: "Educativo",
    simpleDesc: "Respuestas claras y concisas",
    funnyDesc: "Respuestas lúdicas y humorísticas",
    educationalDesc: "Respuestas informativas y detalladas",
    loading: "Cargando...",
    sendMessage: "Enviar mensaje",
    chatInFrench: "Chatear en francés",
    chatInEnglish: "Chatear en inglés",
    chatInSpanish: "Chatear en español"
  },
  // German translations
  de: {
    settings: "Einstellungen",
    volume: "Lautstärke",
    music: "Musik",
    soundEffects: "Soundeffekte",
    fontSize: "Schriftgröße",
    small: "Klein",
    medium: "Mittel",
    large: "Groß",
    dyslexicMode: "Legasthenie-freundlicher Modus",
    holdSpacebar: "Leertaste halten",
    recording: "Aufnahme...",
    catSpeaking: "Katze spricht...",
    interfaceLanguage: "Schnittstellensprache",
    aiPersonality: "KI-Persönlichkeit",
    simple: "Einfach",
    funny: "Lustig",
    educational: "Lehrreich",
    simpleDesc: "Klare, prägnante Antworten",
    funnyDesc: "Spielerische, humorvolle Antworten",
    educationalDesc: "Informative, detaillierte Antworten",
    loading: "Wird geladen...",
    sendMessage: "Nachricht senden",
    chatInFrench: "Auf Französisch chatten",
    chatInEnglish: "Auf Englisch chatten",
    chatInSpanish: "Auf Spanisch chatten"
  },
  // Additional languages can be added here...
};

/**
 * Gets a translated string based on the key and selected language
 * @param {string} key - The translation key
 * @param {string} language - The target language code (e.g., 'en', 'fr', 'es')
 * @returns {string} The translated string or the key itself if translation not found
 */
export const getTranslation = (key, language = 'en') => {
  // If language not supported, fall back to English
  if (!translations[language]) {
    language = 'en';
  }
  
  // If key exists in translations, return it, otherwise return the key itself
  return translations[language][key] || translations['en'][key] || key;
};

/**
 * Check if a language is available
 * @param {string} language - The language code to check
 * @returns {boolean} True if language is available, false otherwise
 */
export const isLanguageAvailable = (language) => {
  return !!translations[language];
};

/**
 * Get the user's selected native language from localStorage
 * @returns {string} The language code ('en' by default)
 */
export const getUserLanguage = () => {
  return localStorage.getItem('catAssistant_nativeLanguage') || 'en';
};

/**
 * Translate a string to the user's selected language using an external translation API
 * For basic UI elements, this won't be called as we use pre-defined translations
 * This is useful for dynamic content that needs to be translated at runtime
 * @param {string} text - The text to translate
 * @param {string} targetLanguage - The target language code
 * @returns {Promise<string>} A promise resolving to the translated text
 */
export const translateText = async (text, targetLanguage = getUserLanguage()) => {
  // For now, return the original text as we don't have an API key yet
  // In a real implementation, this would call a translation API like Google Translate
  
  // Example of how this might work with a translation API:
  /*
  try {
    const response = await fetch(`https://translation-api.example.com/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        text,
        targetLanguage,
        sourceLanguage: 'auto'
      })
    });
    
    const data = await response.json();
    return data.translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Fallback to original text on error
  }
  */
  
  return text;
};

export default {
  getTranslation,
  isLanguageAvailable,
  getUserLanguage,
  translateText
};
