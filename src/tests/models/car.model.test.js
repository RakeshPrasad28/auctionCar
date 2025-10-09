import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Car from "../../models/car.model.js";

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

describe("Car Model Test Suite", () => {
  it("should create & save a car successfully", async () => {
    const validCar = new Car({
      make: "Toyota",
      model: "Camry",
      year: 2020,
    });

    const savedCar = await validCar.save();

    expect(savedCar._id).toBeDefined();
    expect(savedCar.make).toBe("Toyota");
    expect(savedCar.model).toBe("Camry");
    expect(savedCar.year).toBe(2020);
    expect(savedCar.createdAt).toBeDefined();
    expect(savedCar.updatedAt).toBeDefined();
  });

  it("should fail if required fields are missing", async () => {
    const carWithoutRequired = new Car({});

    let err;
    try {
      await carWithoutRequired.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.make).toBeDefined();
    expect(err.errors.model).toBeDefined();
    expect(err.errors.year).toBeDefined();
  });
});
