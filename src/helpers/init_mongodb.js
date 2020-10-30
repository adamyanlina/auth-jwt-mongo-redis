const mongoose = require('mongoose');

mongoose
    .connect('mongodb+srv://jwtauth:asdf1234@cluster0.ewg6r.mongodb.net/jwtauth', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    })
    .then(() => console.log('MongoDB connected'))
    .catch(error => console.error(error.message));

mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to DB');
});
mongoose.connection.on('error', (err) => {
    console.error(err.message);
});
mongoose.connection.on('disconnect', () => {
    console.log('Mongoose connection is disconnected');
});

process.on('SIGINT', async () => {
    await mongoose.connection.close();
    process.exit(0);
});
