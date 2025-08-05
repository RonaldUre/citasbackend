import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserResponseDto {
  @Expose()
  id?: number;

  @Expose()
  name?: string;

  @Expose()
  email?: string;

  @Expose()
  role?: string;

  @Expose()
  avatar?: string;

  @Expose()
  createdAt?: Date;

  @Expose()
  lastLogin?: Date;
}