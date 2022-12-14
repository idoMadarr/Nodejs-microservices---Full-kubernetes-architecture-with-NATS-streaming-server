// NATS mock for testing
export const natsClient = {
  client: {
    publish: jest
      .fn()
      .mockImplementation(
        (channel: string, data: string, callback: () => void) => {
          callback();
        }
      ),
  },
  getClient: () => {
    return natsClient.client;
  },
};
