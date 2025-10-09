import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Bid from "../../models/bid.model.js";

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

describe("Bid Model Test Suite", () => {
  it("should create & save a bid successfully", async () => {
    const validBid = new Bid({
      bidAmount: 5000,
      previousBid: 4500,
      dealer: new mongoose.Types.ObjectId(),
      auction: new mongoose.Types.ObjectId(),
    });

    const savedBid = await validBid.save();

    expect(savedBid._id).toBeDefined();
    expect(savedBid.bidAmount).toBe(5000);
    expect(savedBid.previousBid).toBe(4500);
    expect(savedBid.timePlaced).toBeInstanceOf(Date);
    expect(savedBid.dealer).toBeDefined();
    expect(savedBid.auction).toBeDefined();
  });

  it("should set default timePlaced if not provided", async () => {
    const bid = new Bid({
      bidAmount: 6000,
      previousBid: 5500,
      dealer: new mongoose.Types.ObjectId(),
      auction: new mongoose.Types.ObjectId(),
    });

    const savedBid = await bid.save();
    expect(savedBid.timePlaced).toBeInstanceOf(Date);
  });

  it("should fail if bidAmount is missing", async () => {
    const bidWithoutAmount = new Bid({
      previousBid: 4000,
      dealer: new mongoose.Types.ObjectId(),
      auction: new mongoose.Types.ObjectId(),
    });

    let err;
    try {
      await bidWithoutAmount.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.bidAmount).toBeDefined();
  });
});
