export interface DecodedPayload {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: DecodedPayload;
    }
  }
}
