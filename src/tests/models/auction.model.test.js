import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Auction from "../../models/auction.model.js";

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

describe("Auction Model Test Suite", () => {
  it("should create & save an auction successfully", async () => {
    const validAuction = new Auction({
      auctionStatus: "pending",
      startingPrice: 10000,
      startTime: new Date(Date.now()),
      endTime: new Date(Date.now() + 3600000), // 1 hour later
      car: new mongoose.Types.ObjectId(),
    });

    const savedAuction = await validAuction.save();

    expect(savedAuction._id).toBeDefined();
    expect(savedAuction.auctionStatus).toBe("pending");
    expect(savedAuction.startingPrice).toBe(10000);
    expect(savedAuction.startTime).toBeInstanceOf(Date);
    expect(savedAuction.endTime).toBeInstanceOf(Date);
    expect(savedAuction.car).toBeDefined();
  });

  it("should default auctionStatus to 'pending' if not provided", async () => {
    const auction = new Auction({
      startingPrice: 15000,
      startTime: new Date(),
      endTime: new Date(Date.now() + 3600000),
      car: new mongoose.Types.ObjectId(),
    });
    const savedAuction = await auction.save();
    expect(savedAuction.auctionStatus).toBe("pending");
  });

  it("should fail when required fields are missing", async () => {
    const auctionWithoutRequired = new Auction({});

    let err;
    try {
      await auctionWithoutRequired.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.startingPrice).toBeDefined();
    expect(err.errors.startTime).toBeDefined();
    expect(err.errors.endTime).toBeDefined();
  });

  it("should fail if auctionStatus is not in enum", async () => {
    const invalidAuction = new Auction({
      auctionStatus: "invalid-status",
      startingPrice: 12000,
      startTime: new Date(),
      endTime: new Date(Date.now() + 3600000),
      car: new mongoose.Types.ObjectId(),
    });

    let err;
    try {
      await invalidAuction.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.auctionStatus).toBeDefined();
  });
});
