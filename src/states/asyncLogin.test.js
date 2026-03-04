import { describe, it, expect, vi, beforeEach } from 'vitest';
import { asyncLogin } from './index';
import api from '../utils/api';

vi.mock('../utils/api');

describe('asyncLogin thunk', () => {
  beforeEach(() => {
    api.login.mockClear();
    api.putAccessToken.mockClear();
    api.getOwnProfile.mockClear();
  });

  it('should dispatch action correctly when data fetching success', async () => {
    const fakeToken = 'fake-token';
    const fakeUser = { id: 1, name: 'Wisnu' };
    
    api.login.mockResolvedValue(fakeToken);
    api.getOwnProfile.mockResolvedValue(fakeUser);
    
    const dispatch = vi.fn();
    await asyncLogin({ email: 'test@test.com', password: 'password' })(dispatch);
    
    expect(dispatch).toHaveBeenCalled();
    expect(api.putAccessToken).toHaveBeenCalledWith(fakeToken);
  });
});