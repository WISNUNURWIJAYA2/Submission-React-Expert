import { configureStore, createSlice } from '@reduxjs/toolkit';
import {
  loadingBarReducer,
  showLoading,
  hideLoading,
} from '@dimasmds/react-redux-loading-bar';
import api from '../utils/api';

const authUserSlice = createSlice({
  name: 'authUser',
  initialState: null,
  reducers: {
    setAuthUser: (state, action) => action.payload,
    unsetAuthUser: () => null,
  },
});

const usersSlice = createSlice({
  name: 'users',
  initialState: [],
  reducers: {
    receiveUsers: (state, action) => action.payload,
  },
});

const threadsSlice = createSlice({
  name: 'threads',
  initialState: [],
  reducers: {
    receiveThreads: (state, action) => action.payload,
    addThread: (state, action) => [action.payload, ...state],
  },
});

const threadDetailSlice = createSlice({
  name: 'threadDetail',
  initialState: null,
  reducers: {
    receiveThreadDetail: (state, action) => action.payload,
    clearThreadDetail: () => null,
    addComment: (state, action) => {
      state.comments = [action.payload, ...state.comments];
    },
  },
});

export const asyncRegisterUser = ({ name, email, password }) =>
  async (dispatch) => {
    dispatch(showLoading());
    try {
      await api.register({ name, email, password });
      alert('Registrasi berhasil! Silakan login.');
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    } finally {
      dispatch(hideLoading());
    }
  };

export const asyncLogin = ({ email, password }) => async (dispatch) => {
  dispatch(showLoading());
  try {
    const token = await api.login({ email, password });
    api.putAccessToken(token);
    const authUser = await api.getOwnProfile();
    dispatch(authUserSlice.actions.setAuthUser(authUser));
  } catch (error) {
    alert(error.response?.data?.message || error.message);
  } finally {
    dispatch(hideLoading());
  }
};

export const asyncUnsetAuthUser = () => (dispatch) => {
  dispatch(authUserSlice.actions.unsetAuthUser());
  api.putAccessToken('');
};

export const asyncPopulateUsersAndThreads = () => async (dispatch) => {
  dispatch(showLoading());
  try {
    const users = await api.getAllUsers();
    const threads = await api.getAllThreads();
    dispatch(usersSlice.actions.receiveUsers(users));
    dispatch(threadsSlice.actions.receiveThreads(threads));
  } catch (error) {
    console.error(error);
  } finally {
    dispatch(hideLoading());
  }
};

export const asyncGetThreadDetail = (threadId) => async (dispatch) => {
  dispatch(showLoading());
  dispatch(threadDetailSlice.actions.clearThreadDetail());
  try {
    const detail = await api.getThreadDetail(threadId);
    dispatch(threadDetailSlice.actions.receiveThreadDetail(detail));
  } catch (error) {
    alert(error.message);
  } finally {
    dispatch(hideLoading());
  }
};

export const asyncAddThread = ({ title, body, category }) =>
  async (dispatch) => {
    dispatch(showLoading());
    try {
      const thread = await api.createThread({ title, body, category });
      dispatch(threadsSlice.actions.addThread(thread));
    } catch (error) {
      alert(error.message);
    } finally {
      dispatch(hideLoading());
    }
  };

export const asyncAddComment = ({ content, threadId }) => async (dispatch) => {
  dispatch(showLoading());
  try {
    const comment = await api.createComment({ content, threadId });
    dispatch(threadDetailSlice.actions.addComment(comment));
  } catch (error) {
    alert(error.message);
  } finally {
    dispatch(hideLoading());
  }
};

const store = configureStore({
  reducer: {
    authUser: authUserSlice.reducer,
    users: usersSlice.reducer,
    threads: threadsSlice.reducer,
    threadDetail: threadDetailSlice.reducer,
    loadingBar: loadingBarReducer,
  },
});

export const { setAuthUser, unsetAuthUser } = authUserSlice.actions;
export default store;
