import { Claim } from './claim';

export class UserAuth {
  isAuthenticated? = false;
  authorisation?: Authorisation;
  user?: User;
  claims?: string[] = [];
  status?: string;
  tokenTime?: Date;
}

export class Authorisation {
  token: string;
  type: string;
}

export class User {
  id?: string;
  matricule?: string;
  direction?: string;
  firstName?: string;
  lastName?: string;
  password?:string;
  email?: string;
  userName?: string;
  phoneNumber?: string;
  roleIds?:any;
  avatar?:any;
  userRoles?:any
}
