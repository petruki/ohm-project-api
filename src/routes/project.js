const express = require("express");
const Project = require("../models/project");
const { fetchPage } = require('../utils/project-sync');
const { escapeRegExp } = require('../utils');

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

        const args = {};
        if (req.query.q) {
            args.project = { $regex: new RegExp(`.*${escapeRegExp(req.query.q)}.*`, "i") };
        } else if (req.query.mood) {
            args.moods = { $regex: new RegExp(`.*${escapeRegExp(req.query.mood)}.*`, "i") };
        } else if (req.query.style) {
            args.styles = { $regex: new RegExp(`.*${escapeRegExp(req.query.style)}.*`, "i") };
        } else if (req.query.collab) {
            args.contributors = { $regex: new RegExp(`.*${escapeRegExp(req.query.collab)}.*`, "i") };
        } else if (req.query.admin) {
            args.admins = { $regex: new RegExp(`.*${escapeRegExp(req.query.admin)}.*`, "i") };
        }
        
        let projects = await Project.find(args)
            .sort({ project: 1 })
            .skip((page - 1) * pageLimit)
            .limit(pageLimit <= 50 ? pageLimit : 50);

        const total = await Project.find(args).countDocuments();
        const meta = {
            total,
            pages: Math.ceil(total / pageLimit)
        }

        res.send({ meta, data: projects });
    } catch (e) {
        console.log(e)
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
            .limit(pageLimit <= 50 ? pageLimit : 50);

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

router.patch('/sync/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        
        if (project) {
            await fetchPage(project.page, req.body.cookie).then(async (data) => {
                project.last_scrap = Date.now();
                project.admins = data.admins;
                project.contributors = data.contributors;
                project.comments = data.comments;
                project.styles = data.styles;
                project.moods = data.moods;
                project.description = data.description;
                await project.save();
            });
        } else {
            return res.status(404);
        }
        
        return res.status(200).send(project);
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

module.exports = router;