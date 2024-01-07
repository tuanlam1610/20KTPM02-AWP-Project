import { Injectable } from '@nestjs/common';

import * as admin from 'firebase-admin';
import * as path from 'path';

@Injectable()
export class FirebaseService {
  private readonly firebaseAdmin: admin.app.App;

  constructor() {
    const serviceAccountPath = path.join(
      process.cwd(),
      '/src/firebase/hql-awp-firebase-adminsdk-z79oa-4f6e69693f.json',
    );
    this.firebaseAdmin = admin.initializeApp({
      credential: admin.credential.cert(serviceAccountPath),
      // Add other configurations if needed
    });
  }

  getAdmin(): admin.app.App {
    return this.firebaseAdmin;
  }
  async decodeToken(token: string): Promise<admin.auth.DecodedIdToken> {
    try {
      const decodedToken = await this.firebaseAdmin.auth().verifyIdToken(token);
      return decodedToken;
    } catch (error) {
      throw new Error('Unable to decode token');
    }
  }
}
