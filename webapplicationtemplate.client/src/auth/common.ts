import { Api } from '../config';
import { GetUserResponse, Optional, User } from '../types';

export async function getCurrentUser(): Promise<Optional<User>> {
  let result: Optional<User> = undefined;

  try {
    const { data, status } = await Api.get<GetUserResponse>('/auth/me');
    if (status === 200) {
      result = data.user;
    }
  } catch (error) {
    console.error(error);
  }
  return result;
}
