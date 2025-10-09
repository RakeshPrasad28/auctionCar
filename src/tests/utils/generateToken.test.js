import jwt from "jsonwebtoken";
import generateToken from "../../utils/generateToken.js";
import { jest } from '@jest/globals';

describe("generateToken Utility", () => {
  const payload = { id: "123", name: "Test User" };

  it("should generate a JWT token with valid payload", () => {
    const token = generateToken(payload);
    expect(typeof token).toBe("string");
    expect(token.length).toBeGreaterThan(0);
  });

  it("should throw an error if jwt.sign throws", () => {
    const originalSign = jwt.sign;
    jwt.sign = jest.fn(() => {
      throw new Error("Signing error");
    });

    expect(() => generateToken(payload)).toThrow("Token generation failed");

    jwt.sign = originalSign;
  });
});
