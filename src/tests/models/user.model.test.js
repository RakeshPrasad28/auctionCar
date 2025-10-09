import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../../models/user.model.js";

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

describe("User Model Test Suite", () => {
  it("should create & save a user successfully", async () => {
    const validUser = new User({
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
      role: "dealer",
    });

    const savedUser = await validUser.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.name).toBe("John Doe");
    expect(savedUser.email).toBe("john@example.com");
    expect(savedUser.password).toBe("password123");
    expect(savedUser.role).toBe("dealer");
    expect(savedUser.createdAt).toBeDefined();
    expect(savedUser.updatedAt).toBeDefined();
  });

  it("should fail if required fields are missing", async () => {
    const userWithoutRequired = new User({});

    let err;
    try {
      await userWithoutRequired.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.name).toBeDefined();
    expect(err.errors.email).toBeDefined();
    expect(err.errors.password).toBeDefined();
    expect(err.errors.role).toBeDefined();
  });

  it("should enforce unique email", async () => {
    const user1 = new User({
      name: "User One",
      email: "unique@example.com",
      password: "pass1",
      role: "admin",
    });

    const user2 = new User({
      name: "User Two",
      email: "unique@example.com",
      password: "pass2",
      role: "dealer",
    });

    await user1.save();

    let err;
    try {
      await user2.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.name).toBe("MongoServerError");
    expect(err.code).toBe(11000); 
  });

  it("should fail if role is not in enum", async () => {
    const invalidUser = new User({
      name: "Invalid Role",
      email: "invalid@example.com",
      password: "password",
      role: "guest",
    });

    let err;
    try {
      await invalidUser.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.role).toBeDefined();
  });
});
