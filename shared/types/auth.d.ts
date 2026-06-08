// This file is used to modify the built in User type provided by auth-utils
import { Role } from "../enums/Role";

declare module "#auth-utils" {
  interface User {
    id: string;
    userName: string;
    role: Role;
  }
}
