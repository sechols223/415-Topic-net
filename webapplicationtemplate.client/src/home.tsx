/* eslint-disable @typescript-eslint/no-unused-vars */
import { useNavigate } from 'react-router-dom';
import { useAsync, useAsyncFn } from 'react-use';
import { Api } from './config';
import {
  Button,
  Drawer,
  Group,
  Modal,
  Select,
  Space,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import { TopicComponent } from './components/topic-component';
import { TopicCreateDto, TopicGetDto, UserTopicCreateDto, UserTopicGetDto } from './types';
import { useDisclosure } from '@mantine/hooks';
import { isInRange, useForm } from '@mantine/form';
import { useAuth } from './auth/auth-context';
import { notifications } from '@mantine/notifications';

export const HomePage = () => {
  const navigate = useNavigate();

  const [createOpened, createHandlers] = useDisclosure(false);
  const [subscribeOpened, subscribeHandlers] = useDisclosure(false);

  const userState = useAsync(async () => {
    try {
      const response = await Api.get('/auth/me');
      if (response.status !== 200) {
        navigate('/login');
      }

      return response.data;
    } catch (error) {
      console.log('No auth');
      navigate('/login');
    }
  }, []);

  const createForm = useForm<TopicCreateDto>({
    mode: 'uncontrolled',
    initialValues: {
      description: '',
      title: '',
    },
    validate: {
      description: (value) => (value.length < 1 ? 'Description cannot be empty' : null),
      title: (value) => (value.length < 1 ? 'Title cannot be empty' : null),
    },
  });
  const subscribeForm = useForm<UserTopicCreateDto>({
    mode: 'uncontrolled',
    initialValues: {
      topicId: 0,
      userId: userState.value?.id,
    },

    validate: {
      topicId: (value) => {
        const error =
          value === 0 || String(value) === '0' || !value ? 'You must select a topic' : null;
        return error;
      },
      userId: (value) => {
        const error = isInRange({ min: 1 }, value)
          ? null
          : 'You must be logged in to subscribe to a topic';
        return error;
      },
    },
  });

  const [createState, create] = useAsyncFn(async (values: TopicCreateDto) => {
    const validationResult = createForm.validate();
    console.log(validationResult);
    if (validationResult.hasErrors) {
      notifications.show({
        color: 'red',
        title: 'Error',
        message: 'Unable to create topic',
        autoClose: 3000,
      });
      return;
    }

    const response = await Api.post<TopicGetDto>('/topics', { ...values });
    if (response.status == 200) {
      createHandlers.close();
      createForm.reset();
      notifications.show({
        color: 'green',
        title: 'Success',
        message: 'Topic created',
        autoClose: 3000,
      });
      return response.data;
    }
    return response;
  }, []);

  const { value: topics, loading } = useAsync(async () => {
    const response = await Api.get<TopicGetDto[]>('/topics');
    if (response.status === 200) {
      return response.data;
    }
    return [];
  }, [createState.value, createState.loading]);

  const [unsubscribeState, unsubscribe] = useAsyncFn(async (topicId: number) => {
    console.log('RUNNIGN');
    const response = await Api.delete(`/usertopics/${userState.value.id}/${topicId}`);
    notifications.show({
      color: 'green',
      autoClose: 3000,
      title: 'Success',
      message: 'Unsubscribed from topic',
    });
    return response;
  }, []);

  const [subscribeState, subscribe] = useAsyncFn(async (values: UserTopicCreateDto) => {
    const validationResult = subscribeForm.validate();
    console.log(validationResult);
    if (validationResult.hasErrors) {
      notifications.show({
        color: 'red',
        title: 'Error',
        message: 'Unable to subscribe to topic',
        autoClose: 3000,
      });
      return;
    }
    const response = await Api.post<TopicGetDto>('/usertopics/subscribe', {
      topicId: Number(values.topicId),
      userId: Number(userState.value.id),
    });
    if (response.status === 200) {
      subscribeHandlers.close();
      subscribeForm.reset();
      notifications.show({
        title: 'Success',
        color: 'green',
        message: 'Subscribed to topic',
        autoClose: 3000,
      });
    }

    return response.data;
  }, []);

  const userTopicsState = useAsync(async () => {
    const response = await Api.get<UserTopicGetDto[]>('/usertopics/all');
    if (response.status === 200) {
      console.log(response.data);
      return response.data;
    }
    return [];
  }, [
    createState.value,
    createState.loading,
    unsubscribeState.loading,
    unsubscribeState.value,
    subscribeState,
  ]);

  return (
    <>
      <Title>Topics</Title>
      <Space h={40} />
      <Stack justify="center" align="center">
        <Group>
          <Button onClick={createHandlers.open}>Create Topic</Button>
          <Button onClick={subscribeHandlers.open}>Subscribe to Topic</Button>
        </Group>

        {userTopicsState.value &&
          !userTopicsState.loading &&
          userTopicsState.value.map((topic) => (
            <TopicComponent topic={topic} userId={userState.value.id} unsubscribe={unsubscribe} />
          ))}
      </Stack>

      <Modal
        opened={createOpened}
        onClose={() => {
          createForm.reset();
          createHandlers.close();
        }}
        title="Create Topic"
        withCloseButton={false}
        trapFocus={false}
        autoFocus={false}
      >
        <form onSubmit={createForm.onSubmit(create)}>
          <TextInput
            withAsterisk
            label="Title"
            placeholder="Title.."
            key={createForm.key('title')}
            {...createForm.getInputProps('title')}
          />

          <TextInput
            withAsterisk
            label="Description"
            placeholder="Description.."
            key={createForm.key('description')}
            {...createForm.getInputProps('description')}
          />
          <Space h="md" />
          <Group>
            <Button type="submit" color="blue" variant="filled">
              Submit
            </Button>
            <Button type="button" color="red" variant="filled" onClick={createHandlers.close}>
              Cancel
            </Button>
          </Group>
        </form>
      </Modal>
      <Modal
        opened={subscribeOpened}
        onClose={() => {
          subscribeForm.reset();
          subscribeHandlers.close();
        }}
        title="Subscribe to Topic"
      >
        {topics && userTopicsState.value && (
          <form onSubmit={subscribeForm.onSubmit(subscribe)}>
            <Select
              label="Topics"
              placeholder="Pick a topic"
              data={topics
                .filter((topic) => !userTopicsState.value!.map((t) => t.id).includes(topic.id))
                .map((topic) => ({ label: topic.title, value: String(topic.id) }))}
              key={subscribeForm.key('topicId')}
              {...subscribeForm.getInputProps('topicId')}
            />
            <Space h="md" />
            <Group>
              <Button type="submit" color="blue" variant="filled">
                Submit
              </Button>
              <Button type="button" color="red" variant="filled" onClick={subscribeHandlers.close}>
                Cancel
              </Button>
            </Group>
          </form>
        )}
      </Modal>
    </>
  );
};
