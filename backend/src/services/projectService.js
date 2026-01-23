const { updateStore, getStore } = require("../data/store");
const { v4: uuid } = require("uuid");

const listProjects = async (userId) => {
  const store = await getStore();
  return store.projects.filter((project) => project.userId === userId);
};

const createProject = async ({ userId, name, description }) => {
  const project = {
    id: uuid(),
    userId,
    name,
    description,
    createdAt: new Date().toISOString()
  };

  await updateStore((store) => {
    store.projects.push(project);
    return store;
  });

  return project;
};

module.exports = {
  listProjects,
  createProject
};
