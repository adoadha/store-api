import { IUser } from "../interfaces/auth";
import db from "../lib/pg-connection";

class UserRepository {
  private static instance: UserRepository;
  private DB = db;

  constructor() {
    this.DB = db;
  }

  public static getInstance(): UserRepository {
    if (!UserRepository.instance) {
      UserRepository.instance = new UserRepository();
    }

    return UserRepository.instance;
  }

  async findById(userId: number): Promise<IUser | null> {
    try {
      const queryUser = `select * from users where id = $1`;

      return this.DB.oneOrNone(queryUser, [userId]);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async findByEmail(email: string): Promise<IUser | null> {
    try {
      const queryUser = `select * from users where email = $1`;

      return this.DB.oneOrNone(queryUser, [email]);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

export default UserRepository;
