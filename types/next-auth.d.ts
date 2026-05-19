import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    user: {
      id?: string;
      username?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      emailNotifications?: boolean;
      darkMode?: boolean;
    };
  }

  interface User {
    accessToken?: string;
    username?: string;
    emailNotifications?: boolean;
    darkMode?: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    username?: string;
    sub?: string;
    emailNotifications?: boolean;
    darkMode?: boolean;
  }
}
