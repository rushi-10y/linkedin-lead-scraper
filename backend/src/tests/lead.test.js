const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../src/server"); // make sure server exports app
const Lead = require("../src/models/Lead.model");

describe("Lead API Tests", () => {
  beforeAll(async () => {
    const mongoUri = process.env.MONGO_TEST_URI;
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await Lead.deleteMany({});
    await mongoose.connection.close();
  });

  let leadId;

  it("should create a new lead", async () => {
    const res = await request(app)
      .post("/api/leads")
      .send({
        name: "John Doe",
        email: "john@test.com",
        company: "Test Company",
        source: "manual"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.email).toBe("john@test.com");
    leadId = res.body._id;
  });

  it("should get all leads", async () => {
    const res = await request(app).get("/api/leads");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should get a lead by ID", async () => {
    const res = await request(app).get(`/api/leads/${leadId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(leadId);
  });

  it("should update a lead", async () => {
    const res = await request(app)
      .put(`/api/leads/${leadId}`)
      .send({ company: "Updated Company" });

    expect(res.statusCode).toBe(200);
    expect(res.body.company).toBe("Updated Company");
  });

  it("should delete a lead", async () => {
    const res = await request(app).delete(`/api/leads/${leadId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Lead deleted successfully");
  });
});
