'use client'
import React from 'react'

import {
  Button,
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

  return (
    <div>
      <Heading textDecoration={'none'}>To Do List</Heading>
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
