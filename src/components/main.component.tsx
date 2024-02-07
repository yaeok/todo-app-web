'use client'
import { ReactNode } from 'react'

import { Container } from '@/design'

export default function Main({ children }: { children: ReactNode }) {
  return (
    <Container as='main' maxW='container.lg' minH='100vh'>
      {children}
    </Container>
  )
}
