const Task = require('../models/Task');
const errorHandler = require('../utils/errorHandler');

getAll = async (req, res) => {
    try {
        const tasks = await Task.find();
        console.log(req.headers['authorization']);
        res.status(200).json(tasks);
    } catch(e) {
        errorHandler(res, e);
    }
}
getById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).lean();
        res.status(200).json(task);
    } catch(e) {
        errorHandler(res, e);
    }
}
remove = async (req, res) => {
    try {
        await Task.remove({_id: req.params.id});
        res.status(200).json({
            message: 'Task deleted.'
        });
    } catch(e) {
        errorHandler(res, e);
    }
}
create = async (req, res) => {
    const task = new Task({
        title: req.body.title,
        deadLine: req.body.deadLine,
        done: req.body.done
    });

    try {
        await task.save();
        res.status(201).json(task);
    } catch(e) {
        errorHandler(res, e);
    }
}
update = async (req, res) => {
    const updated = {
        title: req.body.title,
        deadLine: req.body.deadLine,
        done: req.body.done
    };

    try {
        const task = await Task.findOneAndUpdate(
            {_id: req.params.id},
            {$set: updated},
            {new: true}
        );
        res.status(200).json(task);
    } catch(e) {
        errorHandler(res, e);
    }
}

module.exports = {
    getAll,
    getById,
    remove,
    create,
    update
};
