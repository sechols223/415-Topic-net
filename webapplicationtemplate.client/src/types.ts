export type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  userName: string;
};

export type GetUserResponse = {
  user: User;
};

export type UserGetDto = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  userName: string;
};

export type TopicGetDto = {
  id: number;
  title: string;
};

export type UserTopicGetDto = {
  id: number;
  topic: TopicGetDto;
};

export type LoginDto = {
  username: string;
  password: string;
};
