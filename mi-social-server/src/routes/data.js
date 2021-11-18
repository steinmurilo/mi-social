const dataRoutes = (app, fs) => {

  const dataPath = './src/data/db.json';

  const readFile = (
    callback,
    returnJson = false,
    filePath = dataPath,
    encoding = 'utf8'
  ) => {
    fs.readFile(filePath, encoding, (err, data) => {
      if (err) {
        throw err;
      }

      callback(returnJson ? JSON.parse(data) : data);
    });
  };

  const writeFile = (
    fileData,
    callback,
    filePath = dataPath,
    encoding = 'utf8'
  ) => {
    fs.writeFile(filePath, fileData, encoding, err => {
      if (err) {
        throw err;
      }

      callback();
    });
  };


  app.get('/data', (req, res) => {
    readFile(data => {
      res.send(data);
    }, true);
  });


  app.post('/data', (req, res) => {
    readFile(data => {
      const newDataId = Date.now().toString();
      data[newDataId] = req.body;
  
      writeFile(JSON.stringify(data, null, 2), () => {
        res.status(200).send('register added');
      });
    }, true);
  });

  app.delete('/data/:id', (req, res) => {
    readFile(data => {
      const userId = req.params['id'];
      data[userId] = req.body;
  
      writeFile(JSON.stringify(data, null, 2), () => {
        res.status(200).send(`users id:${userId} updated`);
      });
    }, true);
  });


};

module.exports = dataRoutes;