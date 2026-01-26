module.exports = (app) => {
  app.get('/', (req, res) => {
    console.log('API called');
    res.json({ message: 'ATS server is running' });
  });
};
