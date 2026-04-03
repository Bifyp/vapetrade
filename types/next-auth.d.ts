// types/next-auth.d.ts
// Расширяем стандартные типы NextAuth — добавляем id и role в Session

import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }
}
