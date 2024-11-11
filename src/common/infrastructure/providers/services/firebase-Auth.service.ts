import { Inject } from '@nestjs/common';
import { IFirebaseAuthService } from '../../../application/firebase-Auth-service/firebase.aut.service.interface';
import * as admin from 'firebase-admin';

export class FireBaseAuthService implements IFirebaseAuthService {
  constructor(
    @Inject('FireBaseConfig')
    private readonly firebaseConfig: typeof admin,
  ) {}

  async saverUserFirebase(email: string, password: string): Promise<string> {
    try {
      const userRecord = await admin.auth().createUser({
        email,
        password,
      });
      return userRecord.uid;
    } catch (error) {
      throw new Error(`Error creating user in Firebase: ${error.message}`);
    }
  }

  async loginUserFirebase(email: string, password: string): Promise<string> {
    try {
      const userRecord = await admin.auth().getUserByEmail(email);
      const customToken = await admin.auth().createCustomToken(userRecord.uid);
      return customToken;
    } catch (error) {
      throw new Error(`Error logging in user in Firebase: ${error.message}`);
    }
  }
}
