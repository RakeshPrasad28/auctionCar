import { jest } from "@jest/globals";
export const createTransport = jest.fn(() => ({
  sendMail: jest.fn().mockResolvedValue(true),
}));
