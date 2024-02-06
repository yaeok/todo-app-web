'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { signUpWithEmail } from '@/libs/firebase/auth'
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
  VStack,
} from '@chakra-ui/react'

// フォームで使用する変数の型を定義
type formInputs = {
  username: string
  email: string
  password: string
  confirm: string
}

const SignUpView = () => {
  const router = useRouter()
  const toast = useToast()
  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<formInputs>()
  const [password, setPassword] = useState(false)
  const [confirm, setConfirm] = useState(false)

  const onSubmit = handleSubmit(async (data) => {
    await signUpWithEmail({
      username: data.username,
      email: data.email,
      password: data.password,
    }).then((res) => {
      if (res.isSuccess) {
        toast({
          title: '新規登録に成功しました',
          status: 'success',
          duration: 2000,
          isClosable: true,
        })
        router.push('/')
      } else {
        toast({
          title: res.message,
          status: 'error',
          duration: 2000,
          isClosable: true,
        })
      }
    })
  })

  const passwordClick = () => setPassword(!password)
  const confirmClick = () => setConfirm(!confirm)

  return (
    <Flex height='100vh' justifyContent='center' alignItems='center'>
      <VStack spacing='5'>
        <Heading>新規登録</Heading>
        <form onSubmit={onSubmit}>
          <VStack alignItems='left'>
            <FormControl isInvalid={Boolean(errors.username)}>
              <FormLabel htmlFor='username' textAlign='start'>
                ユーザ名
              </FormLabel>
              <Input
                id='username'
                {...register('username', {
                  required: '必須項目です',
                  maxLength: {
                    value: 10,
                    message: '10文字以内で入力してください',
                  },
                })}
              />
              <FormErrorMessage>
                {errors.username && errors.username.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={Boolean(errors.email)}>
              <FormLabel htmlFor='email' textAlign='start'>
                メールアドレス
              </FormLabel>
              <Input
                id='email'
                {...register('email', {
                  required: '必須項目です',
                  maxLength: {
                    value: 50,
                    message: '50文字以内で入力してください',
                  },
                  pattern: {
                    value:
                      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@+[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                    message: 'メールアドレスの形式が違います',
                  },
                })}
              />
              <FormErrorMessage>
                {errors.email && errors.email.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={Boolean(errors.password)}>
              <FormLabel htmlFor='password'>パスワード</FormLabel>
              <InputGroup size='md'>
                <Input
                  pr='4.5rem'
                  type={password ? 'text' : 'password'}
                  {...register('password', {
                    required: '必須項目です',
                    minLength: {
                      value: 8,
                      message: '8文字以上で入力してください',
                    },
                    maxLength: {
                      value: 50,
                      message: '50文字以内で入力してください',
                    },
                    pattern: {
                      value: /^(?=.*[A-Z])[0-9a-zA-Z]*$/,
                      message:
                        '半角英数字かつ少なくとも1つの大文字を含めてください',
                    },
                  })}
                />
                <InputRightElement width='4.5rem'>
                  <Button h='1.75rem' size='sm' onClick={passwordClick}>
                    {password ? 'Hide' : 'Show'}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>
                {errors.password && errors.password.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={Boolean(errors.confirm)}>
              <FormLabel htmlFor='confirm'>パスワード確認</FormLabel>
              <InputGroup size='md'>
                <Input
                  pr='4.5rem'
                  type={confirm ? 'text' : 'password'}
                  {...register('confirm', {
                    required: '必須項目です',
                    minLength: {
                      value: 8,
                      message: '8文字以上で入力してください',
                    },
                    maxLength: {
                      value: 50,
                      message: '50文字以内で入力してください',
                    },
                    pattern: {
                      value: /^(?=.*[A-Z])[0-9a-zA-Z]*$/,
                      message:
                        '半角英数字かつ少なくとも1つの大文字を含めてください',
                    },
                    validate: (value) =>
                      value === getValues('password') ||
                      'パスワードが一致しません',
                  })}
                />
                <InputRightElement width='4.5rem'>
                  <Button h='1.75rem' size='sm' onClick={confirmClick}>
                    {confirm ? 'Hide' : 'Show'}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>
                {errors.confirm && errors.confirm.message}
              </FormErrorMessage>
            </FormControl>
          </VStack>
          <Flex
            flexDirection='column'
            gap='5'
            marginTop='4'
            alignItems='center'
          >
            <Button
              width='100%'
              color='white'
              bg='teal.400'
              _hover={{ bg: 'teal.500' }}
              isLoading={isSubmitting}
              type='submit'
              paddingX='auto'
            >
              新規登録
            </Button>
          </Flex>
        </form>
      </VStack>
    </Flex>
  )
}

export default SignUpView
