const dataRoutes = require("./data");

const cors = require('cors')

const appRouter = (app, fs) => { 

    app.use(cors());
    app.get('/', (req, res) => {
        res.send('welcome to the development api-server');
    });
    
    dataRoutes(app, fs);

 };

module.exports = appRouter;