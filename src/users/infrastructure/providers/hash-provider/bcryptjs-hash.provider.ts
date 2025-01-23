import { compare, hash } from 'bcryptjs'
import { HashProvider } from '@/shared/application/providers/hash-provider'

export class BcryptjsHashProvider implements HashProvider {
  generateHash(payload: string): Promise<string> {
    return hash(payload, 6)
  }
  compareHash(payload: string, hashed: string): Promise<boolean> {
    return compare(payload, hashed)
  }
}
