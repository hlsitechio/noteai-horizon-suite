// API Client for OnlineNote.ai - replacing Supabase
// This file provides a client interface to interact with our backend API

const API_BASE_URL = window.location.origin + '/api';

// Helper function for API requests
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
  };

  const response = await fetch(url, { ...defaultOptions, ...options });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}

// Auth state management
const authListeners = new Set<(event: string, session: any) => void>();

// Auth client
export const auth = {
  async signUp({ email, password }: { email: string; password: string }) {
    try {
      const result = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, name: email.split('@')[0] }),
      });
      const user = { id: result.user.id, email: result.user.email };
      localStorage.setItem('userId', result.user.id);
      authListeners.forEach(cb => cb('SIGNED_IN', { user }));
      return { data: { user }, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async signIn({ email, password }: { email: string; password: string }) {
    try {
      const result = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      const user = { id: result.user.id, email: result.user.email };
      localStorage.setItem('userId', result.user.id);
      authListeners.forEach(cb => cb('SIGNED_IN', { user }));
      return { data: { user }, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async signOut() {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
      localStorage.removeItem('userId');
      authListeners.forEach(cb => cb('SIGNED_OUT', null));
      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  async getUser() {
    const userId = localStorage.getItem('userId');
    if (!userId) return { data: { user: null }, error: null };
    
    try {
      const user = await apiRequest(`/users/${userId}`);
      return { data: { user }, error: null };
    } catch (error) {
      return { data: { user: null }, error };
    }
  },

  async getSession() {
    const userId = localStorage.getItem('userId');
    if (!userId) return { data: { session: null }, error: null };
    
    return { 
      data: { 
        session: { 
          user: { id: userId },
          access_token: 'placeholder-token',
          refresh_token: 'placeholder-refresh',
          expires_in: 3600,
          token_type: 'bearer'
        } 
      }, 
      error: null 
    };
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    authListeners.add(callback);
    return {
      data: { subscription: { unsubscribe: () => authListeners.delete(callback) } }
    };
  },

  async updateUser(updates: any) {
    const userId = localStorage.getItem('userId');
    if (!userId) return { data: null, error: new Error('Not authenticated') };
    
    try {
      const user = await apiRequest(`/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      return { data: { user }, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },
};

// Database client (mimics Supabase's from() syntax)
export const supabase = {
  auth,
  
  from(table: string) {
    const buildQuery = () => {
      let queryParams: any = {};
      let orderBy: string | null = null;
      let orderAsc = true;
      let limitCount: number | null = null;
      
      const execute = async () => {
        const params = new URLSearchParams();
        Object.entries(queryParams).forEach(([key, value]) => {
          params.append(key, String(value));
        });
        if (orderBy) params.append('order', `${orderBy}.${orderAsc ? 'asc' : 'desc'}`);
        if (limitCount) params.append('limit', String(limitCount));
        
        try {
          const data = await apiRequest(`/${table}?${params}`);
          return { data, error: null };
        } catch (error) {
          return { data: null, error };
        }
      };

      const queryBuilder = {
        select(columns?: string) {
          return {
            ...queryBuilder,
            eq(column: string, value: any) {
              queryParams[column] = value;
              return { ...queryBuilder, execute };
            },
            neq(column: string, value: any) {
              queryParams[`${column}.neq`] = value;
              return { ...queryBuilder, execute };
            },
            gt(column: string, value: any) {
              queryParams[`${column}.gt`] = value;
              return { ...queryBuilder, execute };
            },
            gte(column: string, value: any) {
              queryParams[`${column}.gte`] = value;
              return { ...queryBuilder, execute };
            },
            lt(column: string, value: any) {
              queryParams[`${column}.lt`] = value;
              return { ...queryBuilder, execute };
            },
            lte(column: string, value: any) {
              queryParams[`${column}.lte`] = value;
              return { ...queryBuilder, execute };
            },
            like(column: string, value: string) {
              queryParams[`${column}.like`] = value;
              return { ...queryBuilder, execute };
            },
            ilike(column: string, value: string) {
              queryParams[`${column}.ilike`] = value;
              return { ...queryBuilder, execute };
            },
            is(column: string, value: any) {
              queryParams[`${column}.is`] = value;
              return { ...queryBuilder, execute };
            },
            in(column: string, values: any[]) {
              queryParams[`${column}.in`] = `(${values.join(',')})`;
              return { ...queryBuilder, execute };
            },
            order(column: string, options?: { ascending?: boolean }) {
              orderBy = column;
              orderAsc = options?.ascending !== false;
              return { ...queryBuilder, execute };
            },
            limit(count: number) {
              limitCount = count;
              return { ...queryBuilder, execute };
            },
            range(from: number, to: number) {
              queryParams.offset = from;
              limitCount = to - from + 1;
              return { ...queryBuilder, execute };
            },
            async single() {
              const result = await execute();
              if (result.error) return result;
              return { data: result.data?.[0] || null, error: null };
            },
            async maybeSingle() {
              const result = await execute();
              if (result.error) return result;
              return { data: result.data?.[0] || null, error: null };
            },
            execute,
          };
        },
      
        async insert(data: any) {
          try {
            const result = await apiRequest(`/${table}`, {
              method: 'POST',
              body: JSON.stringify(data),
            });
            return { data: result, error: null };
          } catch (error) {
            return { data: null, error };
          }
        },
        
        async upsert(data: any, options?: { onConflict?: string }) {
          try {
            const result = await apiRequest(`/${table}/upsert`, {
              method: 'POST',
              body: JSON.stringify({ data, onConflict: options?.onConflict }),
            });
            return { data: result, error: null };
          } catch (error) {
            return { data: null, error };
          }
        },
        
        async single() {
          const result = await execute();
          if (result.error) return result;
          return { data: result.data?.[0] || null, error: null };
        },
        
        async update(data: any) {
          return {
            async eq(column: string, value: any) {
              try {
                const result = await apiRequest(`/${table}/${value}`, {
                  method: 'PUT',
                  body: JSON.stringify(data),
                });
                return { data: result, error: null };
              } catch (error) {
                return { data: null, error };
              }
            }
          };
        },
        
        async delete() {
          return {
            async eq(column: string, value: any) {
              try {
                const result = await apiRequest(`/${table}/${value}`, {
                  method: 'DELETE',
                });
                return { data: result, error: null };
              } catch (error) {
                return { data: null, error };
              }
            }
          };
        }
      };
      
      return queryBuilder;
    };
    
    return buildQuery();
  },
  
  storage: {
    from(bucket: string) {
      return {
        async upload(path: string, file: File) {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('path', path);
          
          const response = await fetch(`${API_BASE_URL}/storage/${bucket}/upload`, {
            method: 'POST',
            body: formData,
            credentials: 'include',
          });
          
          if (!response.ok) {
            return { data: null, error: new Error('Upload failed') };
          }
          
          const data = await response.json();
          return { data, error: null };
        },
        
        getPublicUrl(path: string) {
          return {
            data: { publicUrl: `${API_BASE_URL}/storage/${bucket}/${path}` }
          };
        }
      };
    }
  },
  
  functions: {
    async invoke(functionName: string, options: { body?: any } = {}) {
      try {
        const data = await apiRequest(`/functions/${functionName}`, {
          method: 'POST',
          body: options.body ? JSON.stringify(options.body) : undefined,
        });
        return { data, error: null };
      } catch (error) {
        return { data: null, error };
      }
    }
  }
};