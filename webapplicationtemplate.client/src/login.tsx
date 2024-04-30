import { useMemo } from 'react';
import { useAuth } from './auth-context';
import { Card, Container, Input, Stack, TextInput } from '@mantine/core';
import { Form, useForm } from '@mantine/form';
import { LoginDto } from './types';

export const LoginPage = () => {
  const auth = useAuth();

  const form = useForm<LoginDto>({
    mode: 'controlled',
    initialValues: {
      username: '',
      password: '',
    },
  });

  return (
    <>
      <Container>
        <Card>
          <Stack>
            <form onSubmit={form.onSubmit(auth.login)}>
              <TextInput
                withAsterisk
                label="Username"
                placeholder="Username.."
                key={form.key('username')}
                {...form.getInputProps('username')}
              />
              <TextInput
                withAsterisk
                label="Password"
                placeholder="Password.."
                key={form.key('password')}
                {...form.getInputProps('password')}
              />
            </form>
          </Stack>
        </Card>
      </Container>
    </>
  );
};
