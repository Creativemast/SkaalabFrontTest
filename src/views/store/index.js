import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { API } from '@src/configs/app'
import axios from 'axios'
import pickBy from 'lodash/pickBy'
import queryString from 'query-string'

export const getUsers = createAsyncThunk('appStore/getUsers', async () => {
  try {
    const response = await axios.get(`${API}/users`)
    return {
      users: response.data.data
    }
  } catch (error) {
    throw error
  }
})

export const getTasks = createAsyncThunk('appStore/getTasks', async params => {
  try {
    const response = await axios.get(`${API}/tasks?${queryString.stringify(pickBy(params, item => item !== ""), { arrayFormat: 'comma' })}`, params)
    return {
      params,
      tasks: response.data.data,
      totalTasksPages: response.data.total
    }
  } catch (error) {
    throw error.response.data
  }
})

export const addTask = createAsyncThunk('appStore/addTask', async (task, { dispatch, getState }) => {
  try {
    await axios.post(`${API}/tasks`, task)
    await dispatch(getTasks(getState().storeApp.paramsTask))
    return task
  } catch (error) {
    throw error.response.data
  }
})

export const updateTask = createAsyncThunk('appStore/updateTask', async (body, { dispatch, getState }) => {
  try {
    const data = await axios.put(`${API}/tasks/${body.id}`, body)
    await dispatch(getTasks(getState().storeApp.paramsTask))
    return data
  } catch (error) {
    throw error.response.data
  }
})

export const appStoreSlice = createSlice({
  name: 'appStore',
  initialState: {
    tasks: [],
    error: null,
    users: [],
    totalTasks: 1,
    paramsTask: {}
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getTasks.fulfilled, (state, action) => {
        state.tasks = action.payload.tasks
        state.paramsTask = action.payload.params
        state.totalTasks = action.payload.totalTasksPages
      })
      .addCase(getTasks.rejected, (state, action) => {
        state.error = action.error.message
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.users = action.payload.users
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.error = action.error.message
      })
      .addCase(addTask.rejected, (state, action) => {
        state.error = action.error.message
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.error = action.error.message
      })
  }
})

export default appStoreSlice.reducer
