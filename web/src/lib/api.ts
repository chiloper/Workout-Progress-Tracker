import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import type { MuscleGroup } from "./types/enum";
import type { CreateWorkoutWithSets, User } from "./types/type";

export function apiBaseUrl() {
  const url = import.meta.env.VITE_API_URL

  if (!url) {
    throw new Error(`VITE_API_URL is empty`)
  }

  return url
}

export const apiClient = axios.create({
  baseURL: apiBaseUrl(),
  timeout: 30000
})

export const TokenStorage = {
  getAccessToken: (): string | null => {
    if (typeof window === "undefined") return null;
    try {
      return localStorage.getItem('access_token')
    } catch {
      return null
    }
  },
  getUser: () => {
    if (typeof window === "undefined") return null;
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null
    } catch {
      return null
    }
  },
  setSession: (accessToken: string, user?: User) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem('access_token', accessToken)
      if (user) {
        localStorage.setItem('user', JSON.stringify(user))
      }
    } catch {
      return null
    }
  },
  clear: () => {
    if (typeof window === "undefined") return null;
    localStorage.removeItem('access_token');
    localStorage.removeItem("user")
  }
}


// interceptor attach Bearer token && dynamic baseurl
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  config.baseURL = apiBaseUrl();
  const token = TokenStorage.getAccessToken();
  if (token && config.baseURL) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// response interceptor: token expire
apiClient.interceptors.response.use((response) => response, async (error: AxiosError<Response & { message: string }>) => {
  if (
    error.response?.status === 401 &&
    error.response.data.message !== 'Invalid email or password.'
  ) {
    TokenStorage.clear()
    if (typeof window !== 'undefined') {
      const baseURL = import.meta.env.BASE_URL || ''
      window.location.href = `${baseURL}login`
    }
  }
  return Promise.reject(error)
})

// auth api
export const authApi = {
  login: async (email: string, password: string) => {
    const res = await apiClient.post('/auth/login', { email, password });
    TokenStorage.setSession(res.data.accessToken, res.data.user)
    return res.data
  },
  register: async (email: string, password: string) => {
    const res = await apiClient.post('/auth/register', { email, password })
    TokenStorage.setSession(res.data.accessToken, res.data.user)
    return res.data
  },
  logout: async () => {
    TokenStorage.clear()
  }
}

// exercises
export const exercisesApi = {
  getExercises: async () => {
    const res = await apiClient.get('/exercises')
    return res.data
  },
  getExercisesIncludeArchive: async () => {
    const res = await apiClient.get('/exercises?includeArchived=true')
    return res.data
  },
  getLastExercisesById: async (exercisesId: string) => {
    const res = await apiClient.get(`/exercises/${exercisesId}`)
    return res.data
  },
  createExercises: async (data: { name: string, muscleGroup: MuscleGroup }) => {
    const res = await apiClient.post('/exercises', data)
    return res.data
  },
  updateExercises: async (data: { name?: string, isArchived?: boolean, muscleGroup?: MuscleGroup }) => {
    const res = await apiClient.patch('/exercises', data)
    return res.data
  }
}

export const workoutApi = {
  getWorkouts: async (from: Date, to: Date, limit: number, offset: number) => {
    const Query = new URLSearchParams({
      from: from.toString(),
      to: to.toString(),
      limit: limit.toString(),
      offset: offset.toString()
    })
    const res = await apiClient.get(`/workout${Query}`)
    return res.data
  },
  getWorkoutById: async (workoutsId: string) => {
    const res = await apiClient.get(`/workouts/${workoutsId}`)
    return res.data
  },
  createWorkout: async (data: CreateWorkoutWithSets) => {
    const res = await apiClient.post(`workouts`, data)
    return res.data
  },
  deleteWorkoutsById: async (workoutsId: string) => {
    const res = await apiClient.delete(`/workouts/${workoutsId}`)
    return res.data
  }
}