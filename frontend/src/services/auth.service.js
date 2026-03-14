class AuthService {
  async login(credentials) {
    if (!credentials?.email || !credentials?.password) {
      throw new Error('Email and password are required');
    }

    // Simulated API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const response = {
          user: {
            id: 1,
            name: 'John Doe',
            email: credentials.email,
            role: 'admin'
          },
          token: 'fake-jwt-token'
        };

        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('token', response.token);

        resolve(response);
      }, 1000);
    });
  }

  async logout() {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        resolve({ success: true });
      }, 500);
    });
  }

  async getCurrentUser() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = localStorage.getItem('user');
        resolve(user ? JSON.parse(user) : null);
      }, 300);
    });
  }

  async refreshToken() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newToken = 'new-fake-jwt-token';
        localStorage.setItem('token', newToken);
        resolve({ token: newToken });
      }, 500);
    });
  }

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
}

export default new AuthService();
