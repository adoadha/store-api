import UserRepository from "@/repository/user.repository";
import Bcrypt from "bcrypt";

export default class AuthService {
  constructor(private userRepo: UserRepository) {
    this.userRepo = userRepo;
  }

  async signIn(email: string, password: string) {
    console.log(email, "service email");
    console.log(password, "service email");
    const findUser = await this.userRepo.findByEmail(email);

    if (!findUser) {
      throw new Error("User Not Found");
    }

    const checkPassword = await Bcrypt.compare(
      password,
      findUser.password ?? ""
    );

    if (!checkPassword) {
      throw new Error("Invalid Password");
    }

    return findUser;
  }
}
