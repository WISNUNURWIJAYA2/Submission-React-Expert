import { describe, it, expect } from 'vitest';
import { setAuthUser, unsetAuthUser } from './index'; // Sesuaikan lokasi export jika perlu
import store from './index';

describe('authUser reducer', () => {
  it('should return the authUser when given by setAuthUser action', () => {
    const initialState = null;
    const action = setAuthUser({ id: 1, name: 'Wisnu' });
    store.dispatch(action);
    expect(store.getState().authUser).toEqual({ id: 1, name: 'Wisnu' });
  });

  it('should return null when given by unsetAuthUser action', () => {
    store.dispatch(unsetAuthUser());
    expect(store.getState().authUser).toEqual(null);
  });
});