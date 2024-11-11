export interface IFirebaseAuthService {
  saverUserFirebase(email: string, password: string): Promise<string>;
  loginUserFirebase(email: string, password: string): Promise<string>;
}
