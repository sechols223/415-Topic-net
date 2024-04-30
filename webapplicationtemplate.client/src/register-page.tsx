/* eslint-disable @typescript-eslint/no-unused-vars */
import { useAsyncFn } from 'react-use';
import { UserCreateDto } from './types';
import { useForm } from '@mantine/form';
import {
  Button,
  Group,
  InputBase,
  PasswordInput,
  Space,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import { IMaskInput } from 'react-imask';
import { useNavigate } from 'react-router-dom';
import { Api } from './config';
import { notifications } from '@mantine/notifications';

export const RegisterPage = () => {
  const [registerState, register] = useAsyncFn(async (values: UserCreateDto) => {
    const response = await Api.post<UserCreateDto>('/auth/register', { ...values });

    notifications.show({
      autoClose: 3000,
      message: 'Registration complete.',
      title: 'Success',
      color: 'green',
    });

    navigate('/login');
    return response;
  }, []);
  const navigate = useNavigate();
  const form = useForm<UserCreateDto>({
    initialValues: {
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      phoneNumber: '',
      username: '',
    },
  });

  return (
    <>
      <Title>Register</Title>
      <Space h="md" />

      <form onSubmit={form.onSubmit(register)}>
        <Stack justify="left" align="center">
          <Group align="left">
            <TextInput
              withAsterisk
              label="First Name"
              placeholder="First Name.."
              key={form.key('firstName')}
              {...form.getInputProps('firstName')}
            />
            <TextInput
              withAsterisk
              label="Last Name"
              placeholder="Last Name.."
              key={form.key('lastName')}
              {...form.getInputProps('lastName')}
            />
          </Group>
          <Group align="left">
            <TextInput
              withAsterisk
              label="Email"
              placeholder="example@email.com"
              key="email"
              {...form.getInputProps('email')}
            />
            <InputBase
              withAsterisk
              label="Phone Number"
              placeholder="(123) 456-7890"
              key="phoneNumber"
              {...form.getInputProps('phoneNumber')}
              component={IMaskInput}
              mask="(000) 000-0000"
            />
          </Group>
          <Group>
            <TextInput
              withAsterisk
              label="Username"
              placeholder="Username"
              key="username"
              {...form.getInputProps('username')}
            />
            <PasswordInput
              withAsterisk
              label="Password"
              placeholder="Password"
              key="password"
              {...form.getInputProps('password')}
              component={TextInput}
              miw={200}
            />
          </Group>
          <Space h="md" />
          <Group>
            <Button
              type="submit"
              color="blue"
              variant="filled"
              onClick={() => navigate('/register')}
            >
              Register
            </Button>
            <Button type="button" color="gray" variant="filled" onClick={() => navigate('/login')}>
              Login
            </Button>
          </Group>
        </Stack>
      </form>
    </>
  );
};
