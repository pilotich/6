const supertest = require("supertest");
const app = require("../index");

let _id;

afterAll(() => {
    app.close();
})

describe("GET /projects", () => {
  it("should return all projects", async () => {
    const { statusCode, body } = await supertest(app).get("/projects");
    expect(statusCode).toBe(200);
    expect(body.length).toBeGreaterThanOrEqual(0);
  });
});

describe("POST /projects", () => {
  it("should return new Project", async () => {
    const newProject = {
      name: "Test",
      users: [],
      tasks: [],
    };

    const { statusCode, body } = await supertest(app)
      .post("/projects")
      .set("Accept", "application/json")
      .send(newProject);
    _id = body._id;
    expect(statusCode).toBe(201);
    expect(body).toMatchObject(newProject);
  });

  it("should return fail if body incorrect", async () => {
    const newProject = {
      users: [],
      tasks: [],
    };

    const { statusCode } = await supertest(app)
      .post("/projects")
      .set("Accept", "application/json")
      .send(newProject);

    expect(statusCode).toBe(400);
  });
});

describe("GET /projects/:id", () => {
  it("should return one project", async () => {
    const { statusCode, body } = await supertest(app).get(`/projects/${_id}`);
    expect(statusCode).toBe(200);
    expect(body.name).toBe("Test")
  });

  it("should fail with incorrect id", async () => {
    const { statusCode, body } = await supertest(app).get(`/projects/658dbd750746e34453382b11`);
    expect(statusCode).toBe(404);
  });
});

describe("POST /projects/add-user", () => {
  it("should update project with new user", async () => {
    const data = {
      projectId: _id,
      userId: 1,
    };

    const { statusCode } = await supertest(app)
      .post("/projects/add-user")
      .set("Accept", "application/json")
      .send(data);

    const { body } = await supertest(app).get(`/projects/${_id}`);

    expect(statusCode).toBe(200);
    expect(body.users[0]).toMatchObject({ _id: 1 });
  });
});

describe("POST /projects/tast/create", () => {
  it("should update project with new tast", async () => {
    const data = {
      projectId: _id,
      name: "test",
      description: "test",
    };

    const { statusCode } = await supertest(app)
      .post("/projects/task/create")
      .set("Accept", "application/json")
      .send(data);

    const { body } = await supertest(app).get(`/projects/${_id}`);

    expect(statusCode).toBe(200);
    expect(body.tasks[0]).toMatchObject({
      name: data.name,
      description: data.description,
    });
  });
});

describe("DELETE /projects/", () => {
  it("should delete project", async () => {
    const { statusCode } = await supertest(app).delete(`/projects/${_id}`);

    const { statusCode: errorCode } = await supertest(app).get(
      `/projects/${_id}`
    );

    expect(statusCode).toBe(204);
    expect(errorCode).toBe(404);
  });
});
