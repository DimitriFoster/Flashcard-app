module.exports = ({ config }) => {
  if (process.env.FOLIO_DEV_BUILD !== '1') {
    return config;
  }

  return {
    ...config,
    name: 'Folio Dev',
    scheme: 'flashcardapp-dev',
    android: {
      ...config.android,
      package: 'com.midlunch.Flashcardapp.dev',
    },
  };
};
