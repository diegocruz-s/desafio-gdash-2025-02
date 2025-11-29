import { compare, hash } from 'bcryptjs';
import { HashComparer } from 'src/domain/user/cryptograph/hash-comparer';
import { HashGenerator } from 'src/domain/user/cryptograph/hash-generator';

export class BcrpytHasher implements HashGenerator, HashComparer {
  private HASH_SALT_LENGTH = 8;

  compare(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash);
  }

  hash(plain: string): Promise<string> {
    return hash(plain, this.HASH_SALT_LENGTH);
  }
}
