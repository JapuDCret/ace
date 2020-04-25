import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

export type SupportedLanguage = 'en-US' | 'de-DE';

type LanguageMap = {
	[key in SupportedLanguage]: {
		translation: {
			[key: string]: string;
		}
	}
}

const resources: LanguageMap = {
	'en-US': {
	  translation: {
		'test': 'Welcome to React and react-i18next'
	  }
	},
	'de-DE': {
	  translation: {
		'test': 'Welcome to React and react-i18next'
	  }
	}
  };

i18n
	// .use(Backend)
	// .use(LanguageDetector)
	.use(initReactI18next) // bind react-i18next to the instance
	.init({

		resources,
		lng: 'en-US',

		fallbackLng: ['en-US', 'de-DE'],
		debug: true,

		interpolation: {
			escapeValue: false, // not needed for react!!
		},

		// react i18next special options (optional)
		// override if needed - omit if ok with defaults
		/*
		react: {
			bindI18n: 'languageChanged',
			bindI18nStore: '',
			transEmptyNodeValue: '',
			transSupportBasicHtmlNodes: true,
			transKeepBasicHtmlNodesFor: ['br', 'strong', 'i'],
			useSuspense: true,
		}
		*/
	});

export default i18n;