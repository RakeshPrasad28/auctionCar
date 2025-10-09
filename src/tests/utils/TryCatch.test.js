import TryCatch from "../../utils/TryCatch.js";
import { jest } from '@jest/globals';


describe("TryCatch Utility Function", () => {
  it("should call handler and next without error", async () => {
    const handler = jest.fn(async (req, res, next) => {
      res.status(200).json({ message: "success" });
    });
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    const wrapped = TryCatch(handler);

    await wrapped(req, res, next);

    expect(handler).toHaveBeenCalledWith(req, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "success" });
  });

  it("should catch error and send 500 response", async () => {
    const errorMessage = "Test error";
    const handler = jest.fn(async () => {
      throw new Error(errorMessage);
    });
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    const wrapped = TryCatch(handler);

    await wrapped(req, res, next);

    expect(handler).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    expect(next).not.toHaveBeenCalled();
  });
});
