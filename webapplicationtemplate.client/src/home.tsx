import { useNavigate } from 'react-router-dom';
import { useAuth } from './auth-context';
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
import { TopicCreateDto, TopicGetDto, UserTopicCreateDto } from './types';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';

export const HomePage = () => {
  const navigate = useNavigate();
  const [createOpened, createHandlers] = useDisclosure(false);
  const [subscribeOpened, subscribeHandlers] = useDisclosure(false);

  const userState = useAsync(async () => {
    const response = await Api.get('/auth/me');
    if (response.status !== 200) {
      navigate('/login', { replace: true });
    }
    return response.data;
  });

  const createForm = useForm<TopicCreateDto>({
    initialValues: {
      description: '',
      title: '',
    },
  });
  const subscribeForm = useForm<UserTopicCreateDto>({
    initialValues: {
      topicId: 0,
      userId: userState.value?.id,
    },
  });

  const [createState, create] = useAsyncFn(async (values: TopicCreateDto) => {
    const response = await Api.post<TopicGetDto>('/topics', { ...values });
    if (response.status == 200) {
      createHandlers.close();
      createForm.reset();
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

  const userTopicsState = useAsync(async () => {
    const response = await Api.get<TopicGetDto[]>('/usertopics/all');
    if (response.status === 200) {
      return response.data;
    }
    return [];
  }, [createState.value, createState.loading]);

  const [subscribeState, subscribe] = useAsyncFn(async (values: UserTopicCreateDto) => {
    console.log('Hello');
    const response2 = await Api.get('/usertopics/test');
    const response = await Api.post<TopicGetDto>('/usertopics/subscribe', {
      topicId: Number(values.topicId),
      userId: Number(userState.value.id),
    });
    subscribeHandlers.close();
    subscribeForm.reset();
    return response.data;
  }, []);

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
          userTopicsState.value.map((topic) => <TopicComponent topic={topic} />)}
      </Stack>

      <Modal
        opened={createOpened}
        onClose={createHandlers.close}
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
      <Modal opened={subscribeOpened} onClose={subscribeHandlers.close} title="Subscribe to Topic">
        <form onSubmit={subscribeForm.onSubmit(subscribe)}>
          <Select
            label="Topics"
            placeholder="Pick a topic"
            data={topics
              ?.filter((topic) => userTopicsState.value?.map((t) => t.id).includes(topic.id))
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
      </Modal>
    </>
  );
};
