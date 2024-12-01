import { ValueObject } from 'src/common/domain/value-object';
import { InvalidWalletIdException } from '../exceptions/invalid-wallet-id.exception';

export class WalletId implements ValueObject<WalletId> {
  private readonly _id: string;

  constructor(id: string) {
    const regex = new RegExp('^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$');
    if (!regex.test(id)) throw new InvalidWalletIdException(`ID ${id} is not valid`);
    this._id = id;
  }

  equals(obj: WalletId): boolean {
    return this._id === obj._id;
  }

  get Id(): string {
    return this._id;
  }

  static create(id: string): WalletId {
    return new WalletId(id);
  }
}
