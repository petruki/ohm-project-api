const express = require("express");
const Project = require("../models/project");

const router = express.Router();

const getDepById = async (req, res, next) => {
    let project = await Project.findById(req.params.id);

    if (!project) {
        return res.status(404);
    }

    res.project = project;
    next();
};

router.get('/find', async (req, res) => {
    try {
        const pageLimit = parseInt(req.query.perpage || 10);
        const page = parseInt(req.query.page || 1);
        const query = req.query.q || '';
        const mood = req.query.mood || '';
        
        let projects = await Project.find({ 
            project: { $regex: new RegExp(`.*${query}.*`, "i") },
            moods: { $regex: new RegExp(`.*${mood}.*`, "i") } })
            .sort({ project: 1 })
            .skip((page - 1) * pageLimit)
            .limit(pageLimit);

        const total = await Project.find({ 
                project: { $regex: new RegExp(`.*${query}.*`, "i") },
                moods: { $regex: new RegExp(`.*${mood}.*`, "i") } }).count();

        const meta = {
            total,
            pages: Math.ceil(total / pageLimit)
        }

        res.send({ meta, data: projects });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

router.get('/:id', getDepById, async (req, res) => {
    try {
        res.send(res.project);
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const pageLimit = parseInt(req.query.perpage || 10);
        const page = parseInt(req.query.page || 1);

        const projects = await Project.find()
            .sort({ created: 1 })
            .skip((page - 1) * pageLimit)
            .limit(pageLimit);

        const total = await Project.countDocuments();

        const meta = {
            total,
            pages: Math.ceil(total / pageLimit)
        }

        res.send({ meta, data: projects });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

router.get('/count', async (req, res) => {
    const total = await Project.countDocuments();
    res.send({ total });
});

module.exports = router;