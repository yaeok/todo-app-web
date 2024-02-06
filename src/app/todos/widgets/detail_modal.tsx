import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@/design'
import { Todo } from '@/models/todo.model'

type DetailModalProps = {
  todo: Todo
  isOpen: boolean
  onClose: () => void
}

const DetailModal = ({ todo, isOpen, onClose }: DetailModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size='xs'>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{todo.title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text fontSize='sm' color='gray.400' inlineSize='80vw'>
            {todo.description}
          </Text>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default DetailModal
