const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = Schema({
    title: {
        type: String,
        required: true
    },
    deadLine: {
        type: Number,
        required: true
    },
    done: {
        type: Boolean
    }
});

module.exports = mongoose.model('tasks', taskSchema);
