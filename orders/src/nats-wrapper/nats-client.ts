// Nats Streaming Server implementation for create global/wrapper stan client
import nats, { Stan } from 'node-nats-streaming';

class NatsClient {
  client?: Stan;

  getClient() {
    if (!this.client) throw new Error('Cannot access NATS');
    return this.client;
  }

  connect(clusterId: string, clientId: string, url: string) {
    this.client = nats.connect(clusterId, clientId, { url });

    return new Promise<void>((resolve, reject) => {
      if (!this.client) return;

      this.client.on('connect', () => {
        console.log('Connected to NATS Streaming Server');
        resolve();
      });

      this.client.on('error', () => {
        console.log('Nats Unable to Connect');
        reject();
      });
    });
  }
}

export const natsClient = new NatsClient();
