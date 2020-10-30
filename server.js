require('dotenv').config();
const express = require('express');
require('./src/helpers/init_mongodb');
const client = require('./src/helpers/init_redis');
const { authRoutes, taskRoutes } = require('./src/routes');

const app = express();

app.use(require('cors')());
app.use(require('morgan')('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server listening on PORT ${PORT}.`);
});
