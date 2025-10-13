import type { LoginCredentials, User } from '../types';

const API_BASE_URL = 'https://blr-backend-production.up.railway.app';

// Helper function to make API requests
const apiRequest = async (url: string, options: RequestInit = {}) => {
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${url}`, config);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

export const authService = {
  login: async (credentials: LoginCredentials): Promise<{ success: boolean; message: string; accessToken?: string }> => {
    try {
      const response = await apiRequest('/auth/adminLogin', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      
      if (response.success) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('authToken', response.accessToken);
        return { 
          success: true, 
          message: response.message,
          accessToken: response.accessToken
        };
      }
      
      return { success: false, message: 'Login failed' };
    } catch (error) {
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Login failed' 
      };
    }
  },

  logout: () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('authToken');
  },

  isAuthenticated: (): boolean => {
    return localStorage.getItem('isAuthenticated') === 'true';
  }
};

export const userService = {
  getUsers: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    hasPremium?: boolean;
  }): Promise<{
    users: User[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.search) queryParams.append('search', params.search);
      if (params?.hasPremium !== undefined) queryParams.append('hasPremium', params.hasPremium.toString());
      
      const url = `/users/getAllUsers${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiRequest(url);
      
      // Transform the response to match our frontend User interface
      const transformedUsers = response.users.map((user: any) => ({
        id: user._id,
        email: user.email,
        hasPremium: user.hasPremium,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }));
      
      return {
        users: transformedUsers,
        total: response.total,
        page: response.page,
        limit: response.limit,
        totalPages: response.totalPages,
      };
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  searchUsers: async (query: string): Promise<User[]> => {
    try {
      const response = await userService.getUsers({ search: query, limit: 100 });
      return response.users;
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  },

  filterUsersByPremium: async (hasPremium: boolean | null): Promise<User[]> => {
    try {
      const response = await userService.getUsers({ 
        hasPremium: hasPremium || undefined,
        limit: 100 
      });
      return response.users;
    } catch (error) {
      console.error('Error filtering users:', error);
      throw error;
    }
  },

  givePremium: async (userId: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiRequest('/users/givePremium', {
        method: 'POST',
        body: JSON.stringify({ userId }),
      });
      
      return { 
        success: response.success, 
        message: response.success ? 'Premium granted successfully' : 'Failed to grant premium'
      };
    } catch (error) {
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to grant premium' 
      };
    }
  }
};