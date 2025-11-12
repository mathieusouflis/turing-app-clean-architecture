import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/providers')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/providers"!</div>
}
