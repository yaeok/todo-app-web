'use client'
import React from 'react'

import {
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  Flex,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@/design'
import { Todo } from '@/models/todo.model'

import DetailModal from './widgets/detail_modal'

const ToDoListView = () => {
  const [todos, setTodos] = React.useState<Todo[]>([])
  const [selectedTodo, setSelectedTodo] = React.useState<Todo>({
    todoId: '',
    title: '',
    description: '',
    isCompleted: false,
    completedAt: '',
    createdAt: '',
    updatedAt: '',
    deletedAt: '',
    isActive: false,
  })
  const [isCompleted, setIsCompleted] = React.useState<boolean>(false)
  const { isOpen, onOpen, onClose } = useDisclosure()

  React.useEffect(() => {
    const fetchData = async () => {
      const lstTodos: Todo[] = []
      for (let i = 0; i < 100; i++) {
        const recTodo: Todo = {
          todoId: '1',
          title: 'test',
          description: 'testdescription',
          isCompleted: false,
          completedAt: '',
          createdAt: '',
          updatedAt: '',
          deletedAt: '',
          isActive: false,
        }
        lstTodos.push(recTodo)
      }

      const recTodo: Todo = {
        todoId: '1',
        title: 'test',
        description:
          'testdescriptiontestdescriptiontestdescriptiontestdescriptiontestdescriptiontestdescriptiontestdescription',
        isCompleted: false,
        completedAt: '',
        createdAt: '',
        updatedAt: '',
        deletedAt: '',
        isActive: false,
      }
      lstTodos.push(recTodo)

      setTodos(lstTodos)
    }
    fetchData()
  }, [])

  const onClick = (todoId: string) => {
    const recTodo: Todo = todos.find((todo) => todo.todoId === todoId)!
    onOpen()
  }

  const unCompletedTodos = () => {
    const lstUpdTodo: Todo[] = todos.filter(
      (todo) => todo.isCompleted === false
    )
    setTodos(lstUpdTodo)
    console.log('unCompletedTodos' + lstUpdTodo)
    setIsCompleted(false)
  }

  const completedTodos = () => {
    const lstUpdTodo: Todo[] = todos.filter((todo) => todo.isCompleted === true)
    setTodos(lstUpdTodo)
    console.log('completedTodos')
    setIsCompleted(true)
  }

  return (
    <div>
      <Heading>To Do List</Heading>
      <Flex flexDirection='row'>
        <Flex
          width='50%'
          border='1px'
          borderColor='gray.200'
          borderTopLeftRadius='md'
          borderBottomLeftRadius='md'
          justify='center'
          onClick={unCompletedTodos}
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
        >
          完了済
        </Flex>
      </Flex>
      {todos.map((todo, index) => (
        <Flex
          key={index}
          flexDirection='row'
          border='1px'
          borderRadius='md'
          borderColor='gray.200'
          marginY='4px'
          padding='4px 8px'
        >
          <Checkbox defaultChecked={todo.isCompleted} />
          <Flex flexDirection='column' marginLeft='8px'>
            <Text fontWeight='bold'>{todo.title}</Text>
            <Text fontSize='sm' color='gray.400' inlineSize='80vw'>
              {todo.description}
            </Text>
          </Flex>
        </Flex>
      ))}
      <DetailModal todo={selectedTodo} isOpen={isOpen} onClose={onClose} />
    </div>
  )
}

export default ToDoListView
