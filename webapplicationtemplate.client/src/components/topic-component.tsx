import React from 'react';
import { PostCreateDto, PostGetDto, TopicGetDto } from '../types';
import {
  Button,
  Card,
  Group,
  Modal,
  Space,
  Stack,
  Table,
  Text,
  TextInput,
  Textarea,
  Title,
} from '@mantine/core';
import { useAsync, useAsyncFn } from 'react-use';
import { Api } from '../config';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';

type TopicComponentProps = {
  topic: TopicGetDto;
};

export const TopicComponent: React.FC<TopicComponentProps> = ({ topic }) => {
  const [createState, create] = useAsyncFn(async (values: PostCreateDto) => {
    const response = await Api.post('/posts', { ...values });
    return response.data;
  });

  const postState = useAsync(async () => {
    const response = await Api.get<PostGetDto[]>(`/posts/${topic.id}`);
    return response.data;
  }, [createState.value]);

  const rows = postState.value?.map((post) => (
    <Table.Tr key={post.id}>
      <Table.Td align="left">
        <Text color="black">{post.id}</Text>
      </Table.Td>
      <Table.Td align="left">
        <Text color="black">{post.content}</Text>
      </Table.Td>
    </Table.Tr>
  ));
  const [opened, handlers] = useDisclosure(false);
  const form = useForm<PostCreateDto>({
    initialValues: {
      content: '',
      topicId: topic.id,
    },
  });
  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section>
          <Stack>
            <Title>Title: {topic.title}</Title>
            <Text>Description: {topic.description}</Text>
            <Group>
              <Button onClick={handlers.open}>Add Message</Button>
              <Button color="red" variant="filled">
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
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
            </Table>
          )}
        </Card.Section>
      </Card>
      <Modal opened={opened} onClose={handlers.close} title="Create Post">
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
            <Button type="button" color="red" variant="filled" onClick={handlers.close}>
              Cancel
            </Button>
          </Group>
        </form>
      </Modal>
    </>
  );
};
