export default {
  "title": "Internationalization (i18n)",
  "locales": {
    "ru-RU": "Russian",
    "en-EN": "English"
  },
  content: {
    pLocale: `Translate dictionary texts using phrase code.
       Pluralization is supported (translation options taking into account the plural).
       You can use areas in the translation to insert values. Number formatting is supported, taking into account the locale.
     `,
    pDic: `Dictionaries in json format or js/ts modules. They can be flat or nested.
       Dictionaries are connected statically (synchronously) or dynamically.
       The dictionary is dynamically imported the first time it is accessed in search of a translated phrase.
       Suspense logic is supported to wait for loading.
       Under each locale, you can connect many named dictionaries.
       (Each feature has its own dictionary.)
       The name of the dictionary is taken into account in the phrase code for translation.
       If the translation is not in the dictionary of the current locale, then the translation from the base locale is used.
       Base locale dictionaries are also loaded the first time they are accessed.
     `,
    pDetect: `By default, the locale is automatically determined from the Accept-Languages header, taking into account
       supported locales (under which there are dictionaries). The locale set by the user will be automatically
       is written in the cookie to restore the selection and take into account the locale when rendering on the server.
     `,
    pHook: `All internationalization functions are implemented by the i18n service, in react components to the current
       the locale, the function for changing it, and the translation function can be accessed through the useI18n() hook.
       The hook will sign the component to change the locale or load dictionaries so that the component re-renders.
     `
  }
};



