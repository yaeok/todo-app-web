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
import { useRecoilValue } from 'recoil'

import DrawerBtn from '@/components/drawer.component'
import Loading from '@/components/loading.component'
import {
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Textarea,
  useDisclosure,
  VStack,
} from '@/design'
import { db } from '@/libs/config'
import {
  registerBook,
  updateFavoritebyBookId,
  updateIsCompletedbyBookId,
} from '@/libs/firebase/book'
import { Todo } from '@/models/todo.model'
import { userState } from '@/states/user'

// フォームで使用する変数の型を定義
type FormInputs = {
  title: string
  description: string
}

const tabList = [
  {
    id: 1,
    name: '読みたい',
    status: 'wantToRead',
  },
  {
    id: 2,
    name: '読んだ',
    status: 'read',
  },
  {
    id: 3,
    name: 'お気に入り',
    status: 'favorite',
  },
]

const BookListView = () => {
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
      const colRef = collection(db, 'users', user!.uid, 'books')
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
    setLoading(false)
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
    registerBook({
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
    bookId: string
  }) => {
    await updateIsCompletedbyBookId({
      uid: user!.uid,
      bookId: args.bookId,
      isCompleted: args.event.target.checked,
    })
  }

  return loading ? (
    <Loading />
  ) : (
    <div>
      <Tabs>
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
            <Flex flexDirection='row' alignItems='center'>
              <DrawerBtn />
              <Heading padding='8px'>MY BOOK</Heading>
            </Flex>
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
          <TabList>
            {tabList.map((tab, index) => (
              <Tab key={index} fontSize='12px'>
                {tab.name}
              </Tab>
            ))}
          </TabList>
        </Flex>
        <TabPanels>
          {tabList.map((tab, index) => (
            <TabPanel key={index}>{tab.name}</TabPanel>
          ))}
        </TabPanels>
      </Tabs>
      <Modal
        size='xs'
        isOpen={isOpen}
        onClose={onClose}
        closeOnOverlayClick={false}
        isCentered
        allowPinchZoom={false}
        blockScrollOnMount={true}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize='16px'>新規BOOKS</ModalHeader>
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

export default BookListView
