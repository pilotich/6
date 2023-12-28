const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  name: String,
  tasks: {type: Array, default: []},
  users: {type: Array, default: []},
});

const Project = mongoose.model("lab6_projects", ProjectSchema);

module.exports = Project;
