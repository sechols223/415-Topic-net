/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { PostCreateDto, PostGetDto, UserTopicGetDto } from '../types';
import {
  Button,
  Card,
  Group,
  Modal,
  Space,
  Stack,
  Table,
  Text,
  Textarea,
  Title,
} from '@mantine/core';
import { useAsync, useAsyncFn } from 'react-use';
import { Api } from '../config';
import { useDisclosure } from '@mantine/hooks';
import { isNotEmpty, useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';

type TopicComponentProps = {
  topic: UserTopicGetDto;
  userId: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  unsubscribe: (topicId: number) => Promise<any>;
};

export const TopicComponent: React.FC<TopicComponentProps> = ({ topic, userId, unsubscribe }) => {
  const [unsubscribeOpened, unsubscribeHandlers] = useDisclosure(false);

  const [createState, create] = useAsyncFn(async (values: PostCreateDto) => {
    const validationResult = form.validate();
    console.log(validationResult);
    if (validationResult.hasErrors) {
      notifications.show({
        autoClose: 3000,
        title: 'Error',
        message: 'Unable to create post',
      });
      return;
    }

    const response = await Api.post('/posts', { ...values });
    handlers.close();
    form.reset();
    return response.data;
  }, []);

  const postState = useAsync(async () => {
    const response = await Api.get<PostGetDto[]>(`/posts/${topic.id}`);
    return response.data;
  }, [createState.value, createState.loading]);

  const [_, unsubscribeTopic] = useAsyncFn(async () => {
    await unsubscribe(topic.id);
  }, []);

  const rows = postState.value?.map((post) => (
    <Table.Tr key={post.id}>
      <Table.Td align="left">
        <Text color="black">{post.id}</Text>
      </Table.Td>
      <Table.Td align="left">
        <Text color="black">{post.content}</Text>
      </Table.Td>
      <Table.Td align="left">
        <Text color="black">{post.author.username}</Text>
      </Table.Td>
      <Table.Td align="left">
        <Text color="black">{new Date(post.createdOn).toLocaleString()}</Text>
      </Table.Td>
    </Table.Tr>
  ));
  const [opened, handlers] = useDisclosure(false);
  const form = useForm<PostCreateDto>({
    mode: 'uncontrolled',
    initialValues: {
      content: '',
      topicId: topic.id,
      authorId: userId,
    },
    validate: {
      content: isNotEmpty('Content cannot be empty.'),
    },
  });
  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section>
          <Stack>
            <Title>{topic.topic.title}</Title>
            <Text>{topic.topic.description}</Text>
            <Group p={20} align="center" justify="center">
              <Button onClick={handlers.open}>Add Message</Button>
              <Button color="red" variant="filled" onClick={unsubscribeHandlers.open}>
                Unsubscribe
              </Button>
            </Group>
          </Stack>
          <Space h={40} />
          {postState.value && postState.value.length > 0 && (
            <Table withColumnBorders align="left">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>
                    <Text color="black">Id</Text>
                  </Table.Th>
                  <Table.Th>
                    <Text color="black">Message</Text>
                  </Table.Th>
                  <Table.Th>
                    <Text color="black">Author</Text>
                  </Table.Th>
                  <Table.Th>
                    <Text color="black">Created On</Text>
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
            </Table>
          )}
        </Card.Section>
      </Card>
      <Modal
        opened={opened}
        onClose={() => {
          handlers.close();
          form.reset();
        }}
        title="Create Post"
      >
        <form onSubmit={form.onSubmit(create)}>
          <Textarea
            withAsterisk
            label="Content"
            placeholder="Content.."
            key={form.key('content')}
            {...form.getInputProps('content')}
          />
          <Space h={10} />
          <Group>
            <Button type="submit" color="blue" variant="filled">
              Submit
            </Button>
            <Button
              type="button"
              color="red"
              variant="filled"
              onClick={() => {
                handlers.close();
                form.reset();
              }}
            >
              Cancel
            </Button>
          </Group>
        </form>
      </Modal>
      <Modal
        opened={unsubscribeOpened}
        onClose={unsubscribeHandlers.close}
        title="Un-subscribe to topic?"
      >
        <Text>Are you sure you want to un-subscribe?</Text>
        <Group p={5} align="center" justify="center">
          <Button color="red" variant="filled" onClick={unsubscribeTopic}>
            Un-subscribe
          </Button>
          <Button color="gray" onClick={unsubscribeHandlers.close}>
            Cancel
          </Button>
        </Group>
      </Modal>
    </>
  );
};
