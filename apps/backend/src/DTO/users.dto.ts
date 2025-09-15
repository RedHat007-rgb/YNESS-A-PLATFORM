export type CreateUserDto = {
  email: string;
  name: string;
  password: string;
};
export type UpdateUserDto = {
  email?: string;
  name?: string;
  password?: string;
};
