export const stripeConnection = {
  charges: {
    create: jest.fn().mockResolvedValue({}),
  },
};
