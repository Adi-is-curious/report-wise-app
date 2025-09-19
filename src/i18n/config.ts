import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Navigation
      "home": "Home",
      "reportIssue": "Report Issue",
      "activeCases": "Active Cases",
      "community": "Community",
      "myReports": "My Reports",
      "rewards": "Rewards",
      "signOut": "Sign Out",
      
      // Home page
      "welcomeTitle": "Welcome to CivicConnect",
      "welcomeSubtitle": "Your voice in local governance. Report issues, track progress, and build a better community together.",
      "reportAnIssue": "Report an Issue",
      "viewActiveCases": "View Active Cases",
      "quickReport": "Quick Report",
      "interactiveMap": "Interactive Map",
      "communityFeed": "Community Feed",
      
      // Stats
      "activeReports": "Active Reports",
      "resolvedThisMonth": "Resolved This Month",
      "communityMembers": "Community Members",
      "avgResponseTime": "Avg Response Time",
      
      // Map
      "selectLocationToReport": "Select location to report an issue",
      "reportHere": "Report Here",
      "nearbyIssues": "Nearby Issues",
      
      // Common
      "loading": "Loading...",
      "submit": "Submit",
      "cancel": "Cancel",
      "close": "Close",
    }
  },
  hi: {
    translation: {
      // Navigation
      "home": "होम",
      "reportIssue": "समस्या रिपोर्ट करें",
      "activeCases": "सक्रिय मामले",
      "community": "समुदाय",
      "myReports": "मेरी रिपोर्ट्स",
      "rewards": "पुरस्कार",
      "signOut": "साइन आउट",
      
      // Home page
      "welcomeTitle": "सिविककनेक्ट में आपका स्वागत है",
      "welcomeSubtitle": "स्थानीय शासन में आपकी आवाज़। समस्याओं की रिपोर्ट करें, प्रगति को ट्रैक करें, और मिलकर एक बेहतर समुदाय बनाएं।",
      "reportAnIssue": "समस्या रिपोर्ट करें",
      "viewActiveCases": "सक्रिय मामले देखें",
      "quickReport": "त्वरित रिपोर्ट",
      "interactiveMap": "इंटरैक्टिव मैप",
      "communityFeed": "समुदाय फ़ीड",
      
      // Stats
      "activeReports": "सक्रिय रिपोर्ट्स",
      "resolvedThisMonth": "इस महीने हल किया गया",
      "communityMembers": "समुदाय के सदस्य",
      "avgResponseTime": "औसत प्रतिक्रिया समय",
      
      // Map
      "selectLocationToReport": "समस्या रिपोर्ट करने के लिए स्थान चुनें",
      "reportHere": "यहाँ रिपोर्ट करें",
      "nearbyIssues": "आस-पास की समस्याएं",
      
      // Common
      "loading": "लोड हो रहा है...",
      "submit": "जमा करें",
      "cancel": "रद्द करें",
      "close": "बंद करें",
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;