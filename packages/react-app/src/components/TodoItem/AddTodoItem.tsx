import React from 'react';
import {
  Box,
  Button,
  useStyleConfig,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
} from '@chakra-ui/react';
import { useForm, SubmitHandler } from 'react-hook-form';

import { useAddTodoItemMutation } from './client.utils';

interface IFormInput {
  title: string;
}

export const AddTodoItem = () => {
  const styles = useStyleConfig('MainCard');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormInput>();

  const [addTodoItem, { data, loading, error }] = useAddTodoItemMutation();
  const onSubmit: SubmitHandler<IFormInput> = data => {
    addTodoItem({ variables: { title: data.title } });
    reset();
  };

  return (
    <Box
      alignItems="start"
      display="flex"
      as="form"
      __css={styles}
      onSubmit={handleSubmit(onSubmit)}
    >
      <FormControl isInvalid={Boolean(errors.title)}>
        <FormLabel htmlFor="title">What do you need to do?</FormLabel>
        <Input
          id="title"
          type="title"
          {...register('title', { required: true })}
        />
        {errors.title && <FormErrorMessage>Field required.</FormErrorMessage>}
      </FormControl>

      <Button
        isDisabled={loading}
        ml={2}
        mt={8}
        colorScheme="teal"
        size="sm"
        type="submit"
      >
        Save
      </Button>
    </Box>
  );
};
