const request = require("supertest");
const bcrypt = require("bcryptjs");  
const app = require("../index");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
let authToken;
let budgetId;

beforeAll(async () => {
  // Cleaning up in correct order
  await prisma.expense.deleteMany({});
  await prisma.income.deleteMany({}); 
  await prisma.budget.deleteMany({});
  await prisma.user.deleteMany({});

  const testUser = await prisma.user.create({
    data: {
      username: `testuser_${Date.now()}`,
      email: `testuser_${Date.now()}@example.com`,
      password: await bcrypt.hash("password", 10),
    }
  });

  const loginRes = await request(app).post("/login").send({
    username: testUser.username,
    password: "password",
  });

  authToken = loginRes.body.token;
});

afterAll(async () => {
  await prisma.expense.deleteMany({});
  await prisma.income.deleteMany({});  
  await prisma.budget.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.$disconnect();
});

describe("🔹 Budget API Tests", () => {
  test("✅ Should create a new budget", async () => {
    const res = await request(app)
      .post("/budgets")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ name: "Test Budget", amount: 500 });

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Test Budget");
    budgetId = res.body.id;
  });

  test("❌ Should fail to create budget without authentication", async () => {
    const res = await request(app)
      .post("/budgets")
      .send({ name: "Unauthorized Budget", amount: 500 });
  
    expect(res.statusCode).toBe(401); 
  });
  

  test("✅ Should get all budgets for authenticated user", async () => {
    const res = await request(app)
      .get("/budgets")
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("✅ Should update a budget", async () => {
    const res = await request(app)
      .put(`/budget/${budgetId}/edit`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({ name: "Updated Budget", amount: 700 });

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Updated Budget");
  });

  test("✅ Should delete a budget", async () => {
    const res = await request(app)
      .delete(`/budgets/${budgetId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
  });
});
