// src/repositories/userRepository.ts
import RedisService from '../services/redis-service'
import { User } from '../models/cache/user'
import { v4 as uuidv4 } from 'uuid'

const redis = RedisService.getInstance()

export const createUser = async (nickname: string): Promise<User> => {
  const user: User = {
    id: uuidv4(),
    nickname,
  }

  await redis.set(`user:${user.id}`, JSON.stringify(user))

  return user
}

export const getUser = async (id: string): Promise<User | null> => {
  const userData = await redis.get(`user:${id}`)
  if (userData) {
    return JSON.parse(userData)
  }
  return null
}
