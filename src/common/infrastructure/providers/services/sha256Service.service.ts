import { ICrypto } from '../../../application/crypto/crypto';
import { sha256 } from 'js-sha256';

export class Sha256Service implements ICrypto {
  async encrypt(value: string): Promise<string> {
    return sha256(value);
  }

  async compare(normal: string, encrypted: string): Promise<boolean> {
    return sha256(normal) === encrypted;
  }
}
