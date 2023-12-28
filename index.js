const express = require('express');
const mongoose = require("mongoose");
const axios = require('axios')

const morgan = require('morgan')

const Projects = require('./model.js');

require('dotenv').config();

const app = express();

app.use(morgan('combined'))

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.get('/projects', async (req, res) => {
  try {
    const projects = await Projects.find({});

    res.status(200).send(projects)
  } catch (err) {
    res.status(500).send(`Unexpected error, ${err.message}`)
  }
});

app.post('/projects', async (req, res) => {
  try {
    const data = req.body

    if (!data || !data.name) {
      console.log('object');
      res.status(400).send("Provide correct data")
      return;
    }

    const project = await Projects.create(data);

    res.status(201).send(project)
  } catch (err) {
    res.status(500).send(`Unexpected error, ${err.message}`)
  }
});

app.post('/projects/add-user', async (req, res) => {
  try {
    const { projectId, userId } = req.body

    if (!projectId || !userId) {
      res.status(400).send("Provide correct data")
      return;
    }
    const project = await Projects.updateOne({_id: projectId}, {
      $set: {
        users: [{_id: userId}]
      }
    });

    res.status(200).send(project)
  } catch (err) {
    res.status(500).send(`Unexpected error, ${err.message}`)
  }
});

app.post('/projects/task/create', async (req, res) => {
  try {
    const { projectId, name, description } = req.body

    if (!projectId || !name || !description) {
      res.status(400).send("Provide correct data")
      return;
    }

    const project = await Projects.updateOne({_id: projectId}, {
      $push: {
        tasks: {name, description}
      }
    });

    res.status(200).send(project)
  } catch (err) {
    res.status(500).send(`Unexpected error, ${err.message}`)
  }
});

app.get('/projects/:projectId', async (req, res) => {
  const {projectId} = req.params

  try {
    if (!projectId) {
      res.status(400).send("Provide correct data")
      return;
    } 

    const project = await Projects.findOne({_id: projectId})

    if (!project) {
      res.status(404).send("Not found")
      return
    }

    res.status(200).send(project)
  } catch (err) {
    res.status(500).send(err.message)
  }
})

app.delete('/projects/:projectId', async (req, res) => {
  const {projectId} = req.params

  try {
    if (!projectId) {
      res.status(400).send("Provide correct data")
      return;
    } 

    await Projects.deleteOne({_id: projectId});

    res.status(204).send(`${projectId} deleted`)
  } catch (err) {
    res.status(500).send(`Unexpected error, ${err.message}`)
  }
});

const server = app.listen(3001, () => {
  console.log('Starting the server on port 3001');
  mongoose.connect(process.env.MONGO_URL)
});

module.exports = server
