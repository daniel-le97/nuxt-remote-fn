import { useEvent } from '../../src/runtime/server'
import { prisma } from './prisma'

// export async function getTodos () {
//   const todos = await prisma.todo.findMany()
//   return todos
// }

// export function getTodo (id: number) {
//   return prisma.todo.findFirstOrThrow({
//     where: {
//       id
//     }
//   })
// }

// export async function toggleTodo (id: number) {
//   const todo = await getTodo(id)
//   return prisma.todo.update({
//     where: { id },
//     data: { completed: !todo.completed }
//   })
// }

// export function deleteTodo (id: number) {
//   return prisma.todo.delete({ where: { id } })
// }

// export function addTodo ({ title, content }: { title: string; content: string }) {
//   return prisma.todo.create({
//     data: {
//       title,
//       content,
//       completed: false
//     }
//   })
// }
class _Todo {
  async list () {
    const todos = await prisma.todo.findMany()
    return todos
  }
  get (id: number) {
    return prisma.todo.findFirstOrThrow({
      where: {
        id
      }
    })
  }
  async toggle(id: number) {
    const todo = await this.get(id)
    return prisma.todo.update({
      where: { id },
      data: { completed: !todo.completed }
    })
  }
  delete(id: number) {
    return prisma.todo.delete({ where: { id } })
  }
  add({ title, content }: { title: string; content: string }) {
    return prisma.todo.create({
      data: {
        title,
        content,
        completed: false
      }
    })
  }
}

export const Todo = new _Todo()




export function createContext() {
  const event = useEvent()
  // console.log('event.context.params', event.context.params)
}
