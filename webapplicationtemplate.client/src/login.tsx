import { useAuth } from './auth/auth-context';
import { Button, Center, Container, Group, Paper, Space, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { LoginDto } from './types';
import { useNavigate } from 'react-router-dom';

export const LoginPage = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  if (auth.user) {
    navigate('/');
  }

  const form = useForm<LoginDto>({
    mode: 'controlled',
    initialValues: {
      username: '',
      password: '',
    },
  });

  return (
    <Center>
      <Container>
        <Paper>
          <Stack align="start">
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

              <Space h="md" />
              <Group>
                <Button type="submit" variant="filled" color="blue">
                  Login
                </Button>

                <Button>Register</Button>
              </Group>
            </form>
          </Stack>
        </Paper>
      </Container>
    </Center>
  );
};
