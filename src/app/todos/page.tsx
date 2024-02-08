'use client'
import {
  collection,
  DocumentData,
  onSnapshot,
  orderBy,
  query,
  QueryDocumentSnapshot,
  where,
} from 'firebase/firestore'
import React from 'react'
import { useForm } from 'react-hook-form'
import { IoAddOutline } from 'react-icons/io5'
import { useRecoilValue } from 'recoil'

import Loading from '@/components/loading.component'
import {
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useDisclosure,
  VStack,
} from '@/design'
import { db } from '@/libs/config'
import { registerTodo, updateIsCompleted } from '@/libs/firebase/todo'
import { Todo } from '@/models/todo.model'
import { userState } from '@/states/user'

// フォームで使用する変数の型を定義
type FormInputs = {
  title: string
  description: string
}

const ToDoListView = () => {
  const [todos, setTodos] = React.useState<Todo[]>([])
  const [updTodos, setUpdTodos] = React.useState<Todo[]>([])
  const [isSelect, setIsSelect] = React.useState<boolean>(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormInputs>()
  const user = useRecoilValue(userState)
  const [loading, setLoading] = React.useState<boolean>(true)

  React.useEffect(() => {
    if (user) {
      const colRef = collection(db, 'users', user!.uid, 'todos')
      const q = query(
        colRef,
        where('isActive', '==', true),
        orderBy('createdAt', 'desc')
      )

      const unsubscribe = onSnapshot(q, async (snapshot) => {
        const lstTodo: Todo[] = []
        snapshot.forEach(
          (doc: QueryDocumentSnapshot<DocumentData, DocumentData>) => {
            const recTodo = {
              todoId: doc.data().todoId,
              title: doc.data().title,
              description: doc.data().description,
              isCompleted: doc.data().isCompleted,
              completedAt: doc.data().completedAt,
              createdAt: doc.data().createdAt,
              updatedAt: doc.data().updatedAt,
              deletedAt: doc.data().deletedAt,
              isActive: doc.data().isActive,
            }
            lstTodo.push(recTodo)
          }
        )
        setTodos(lstTodo)
        const lstUpdTodo: Todo[] = lstTodo.filter((todo: Todo) => {
          return todo.isCompleted === false
        })
        setUpdTodos(lstUpdTodo)
        setLoading(false)
      })
      return () => {
        unsubscribe()
      }
    }
  }, [])

  const unCompletedTodos = () => {
    const lstUpdTodo: Todo[] = todos.filter((todo: Todo) => {
      return todo.isCompleted === false
    })
    setUpdTodos(lstUpdTodo)
    setIsSelect(false)
  }

  const completedTodos = () => {
    const lstUpdTodo: Todo[] = todos.filter((todo: Todo) => {
      return todo.isCompleted === true
    })
    setUpdTodos(lstUpdTodo)
    setIsSelect(true)
  }

  const onSubmit = handleSubmit(async (data: FormInputs) => {
    registerTodo({
      uid: user!.uid,
      title: data.title,
      description: data.description,
    }).then(async () => {
      reset()
      onClose()
    })
  })

  const onChangeCheckbox = async (args: {
    event: React.ChangeEvent<HTMLInputElement>
    todoId: string
  }) => {
    await updateIsCompleted({
      uid: user!.uid,
      todoId: args.todoId,
      isCompleted: args.event.target.checked,
    })
  }

  return loading ? (
    <Loading />
  ) : (
    <div>
      <Flex
        top='0'
        zIndex='10'
        position='sticky'
        paddingY='8px'
        flexDirection='column'
        bg='white'
        gap='4px'
      >
        <Flex
          flexDirection='row'
          justifyContent='space-between'
          alignItems='center'
        >
          <Heading padding='8px'>Todo</Heading>
          <Button
            aria-label=''
            bg='white'
            shadow='lg'
            borderRadius='25'
            onClick={onOpen}
            border='2px'
            borderColor='gray.400'
          >
            登録
          </Button>
        </Flex>
        <Flex flexDirection='row'>
          <Flex
            width='50%'
            border='1px'
            borderColor='gray.200'
            borderTopLeftRadius='md'
            borderBottomLeftRadius='md'
            justify='center'
            onClick={unCompletedTodos}
            bg={isSelect ? 'white' : 'gray.200'}
          >
            <Text>未完了</Text>
          </Flex>
          <Flex
            width='50%'
            border='1px'
            borderColor='gray.200'
            borderTopRightRadius='md'
            borderBottomRightRadius='md'
            justify='center'
            onClick={completedTodos}
            bg={isSelect ? 'gray.200' : 'white'}
          >
            完了済
          </Flex>
        </Flex>
      </Flex>
      {updTodos.map((todo, index) => (
        <Flex
          key={index}
          flexDirection='row'
          border='1px'
          borderRadius='md'
          borderColor='gray.200'
          marginY='4px'
          padding='4px 8px'
          scrollSnapStop='always'
        >
          <Checkbox
            key={todo.todoId}
            disabled={todo.isCompleted}
            defaultChecked={todo.isCompleted ? true : false}
            onChange={(e) =>
              onChangeCheckbox({ event: e, todoId: todo.todoId })
            }
          />
          <Flex flexDirection='column' marginLeft='8px'>
            <Text fontWeight='bold'>{todo.title}</Text>
            <Text fontSize='sm' color='gray.400' inlineSize='80vw'>
              {todo.description}
            </Text>
          </Flex>
        </Flex>
      ))}
      <Modal
        size='xs'
        isOpen={isOpen}
        onClose={onClose}
        closeOnOverlayClick={false}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize='16px'>新規TODO</ModalHeader>
          <ModalCloseButton onClick={() => reset()} />
          <form onSubmit={onSubmit}>
            <ModalBody>
              <VStack spacing='4' alignItems='left'>
                <FormControl isInvalid={Boolean(errors.title)}>
                  <FormLabel htmlFor='title' fontSize='12px'>
                    タイトル
                  </FormLabel>
                  <Input
                    id='title'
                    fontSize='12px'
                    {...register('title', {
                      required: '必須項目です',
                      maxLength: {
                        value: 50,
                        message: '50文字以内で入力してください',
                      },
                    })}
                  />
                  <FormErrorMessage>
                    {errors.title && errors.title.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={Boolean(errors.description)}>
                  <FormLabel htmlFor='description' fontSize='12px'>
                    説明
                  </FormLabel>
                  <Textarea
                    resize='vertical'
                    fontSize='12px'
                    id='description'
                    {...register('description', {
                      required: '必須項目です',
                      maxLength: {
                        value: 100,
                        message: '100文字以内で入力してください',
                      },
                    })}
                  />
                  <FormErrorMessage>
                    {errors.description && errors.description.message}
                  </FormErrorMessage>
                </FormControl>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button
                variant='none'
                border='2px'
                borderColor='purple.200'
                isLoading={isSubmitting}
                type='submit'
              >
                登録
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default ToDoListView
