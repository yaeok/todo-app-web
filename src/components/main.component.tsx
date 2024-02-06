'use client'
import { ReactNode } from 'react'

import { Container } from '@/design'

export default function Main({ children }: { children: ReactNode }) {
  return (
    <Container
      as='main'
      maxW='container.lg'
      my='2'
      minH='calc(100vh - 115px - 2rem)'
    >
      {children}
    </Container>
  )
}
