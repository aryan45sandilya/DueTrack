import { createFileRoute } from '@tanstack/react-router'
import { AuthPage } from '../auth-page'
export const Route = createFileRoute('/login')({ component: () => <AuthPage mode="login" /> })
