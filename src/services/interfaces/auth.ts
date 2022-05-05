// AuthController_signIn
// export interface Signin {
//   login: string;
//   password: string;
// }
export interface Signin {
  token: string;
}

// AuthController_signup
export interface Signup {
  name: string;
  login: string;
  password: string;
}
