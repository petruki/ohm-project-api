const express = require('express');
const helmet = require('helmet');
const projectRoute = require('./routes/project');
const cors = require('cors');

const port = process.env.PORT;
const app = express();

require('./db/mongoose');

app.use(express.json());
app.use(cors());
app.use(helmet());

app.use('/api/project', projectRoute);
app.get('/api/check', (req, res) => res.status(200).send({ message: 'All good', code: 200 }));
app.get('*', (req, res) => {
    res.status(404).send({ error: 'Operation not found' });
});

app.listen(port, () => {
    console.log('Server is up on port ' + port);
});