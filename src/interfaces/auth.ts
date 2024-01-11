export interface IUser {
  id?: number;
  email?: string;
  password?: string;
  phone?: number;
  tenant_id?: string;
  role?: string;
}

export interface AuthLoginPayload {
  email: string;
  password: string;
}
