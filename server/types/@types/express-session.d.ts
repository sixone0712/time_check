import 'express-session';

declare module 'express-session' {
  interface SessionData {
    user: {
      id: string;
      name: string;
      department: string;
      redmineKey: string;
      authorized: boolean;
    };
  }
}
