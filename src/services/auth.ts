// Local Demo Authentication Service (No Network Calls)
export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  is_premium: boolean;
  created_at: string;
  updated_at: string;
}

export class AuthService {
  private readonly STORAGE_KEYS = {
    USER: 'ai_genie_user',
    AUTHENTICATED: 'ai_genie_authenticated',
    USERS_DB: 'ai_genie_users_db'
  };

  private getUsersDatabase(): Record<string, any> {
    try {
      const db = localStorage.getItem(this.STORAGE_KEYS.USERS_DB);
      return db ? JSON.parse(db) : {};
    } catch {
      return {};
    }
  }

  private saveUsersDatabase(db: Record<string, any>) {
    localStorage.setItem(this.STORAGE_KEYS.USERS_DB, JSON.stringify(db));
  }

  async signUp(email: string, password: string, fullName?: string) {
    try {
      console.log('🧞 Demo signup starting:', { email, fullName });
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Check if user already exists
      const usersDb = this.getUsersDatabase();
      if (usersDb[email]) {
        throw new Error('An account with this email already exists. Please sign in instead.');
      }

      // Create new user
      const newUser = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email,
        full_name: fullName || '',
        is_premium: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        password_hash: btoa(password) // Simple encoding for demo
      };

      // Save to users database
      usersDb[email] = newUser;
      this.saveUsersDatabase(usersDb);

      // Set current user
      const userForStorage = { ...newUser };
      delete userForStorage.password_hash; // Don't store password in current user

      localStorage.setItem(this.STORAGE_KEYS.USER, JSON.stringify(userForStorage));
      localStorage.setItem(this.STORAGE_KEYS.AUTHENTICATED, 'true');

      console.log('✅ Demo signup successful:', userForStorage);

      return {
        user: userForStorage,
        session: { access_token: 'demo_token_' + Date.now() }
      };
    } catch (error) {
      console.error('❌ Demo signup error:', error);
      throw error;
    }
  }

  async signIn(email: string, password: string) {
    try {
      console.log('🧞 Demo signin starting:', { email });
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check users database
      const usersDb = this.getUsersDatabase();
      const user = usersDb[email];
      
      if (!user) {
        throw new Error('No account found with this email. Please sign up first.');
      }

      // Verify password (simple check for demo)
      if (atob(user.password_hash) !== password) {
        throw new Error('Incorrect password. Please try again.');
      }

      // Set current user
      const userForStorage = { ...user };
      delete userForStorage.password_hash;

      localStorage.setItem(this.STORAGE_KEYS.USER, JSON.stringify(userForStorage));
      localStorage.setItem(this.STORAGE_KEYS.AUTHENTICATED, 'true');

      console.log('✅ Demo signin successful:', userForStorage);

      return {
        user: userForStorage,
        session: { access_token: 'demo_token_' + Date.now() }
      };
    } catch (error) {
      console.error('❌ Demo signin error:', error);
      throw error;
    }
  }

  async signOut() {
    try {
      console.log('🧞 Demo signout');
      localStorage.removeItem(this.STORAGE_KEYS.AUTHENTICATED);
      localStorage.removeItem(this.STORAGE_KEYS.USER);
      console.log('✅ Demo signout successful');
    } catch (error) {
      console.error('❌ Demo signout error:', error);
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      const isAuthenticated = localStorage.getItem(this.STORAGE_KEYS.AUTHENTICATED);
      const userData = localStorage.getItem(this.STORAGE_KEYS.USER);
      
      if (isAuthenticated === 'true' && userData) {
        const user = JSON.parse(userData);
        console.log('🧞 Current user:', user.email);
        return user;
      }
      
      console.log('🧞 No current user');
      return null;
    } catch (error) {
      console.error('❌ Get current user error:', error);
      return null;
    }
  }

  async createUserProfile(userId: string, profile: Partial<UserProfile>) {
    try {
      console.log('🧞 Creating user profile:', { userId, profile });
      return { success: true };
    } catch (error) {
      console.error('❌ Create user profile error:', error);
      throw error;
    }
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const userData = localStorage.getItem(this.STORAGE_KEYS.USER);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('❌ Get user profile error:', error);
      return null;
    }
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>) {
    try {
      const userData = localStorage.getItem(this.STORAGE_KEYS.USER);
      if (userData) {
        const user = JSON.parse(userData);
        const updatedUser = { 
          ...user, 
          ...updates, 
          updated_at: new Date().toISOString() 
        };
        localStorage.setItem(this.STORAGE_KEYS.USER, JSON.stringify(updatedUser));
        
        // Also update in users database
        const usersDb = this.getUsersDatabase();
        if (usersDb[user.email]) {
          usersDb[user.email] = { ...usersDb[user.email], ...updates };
          this.saveUsersDatabase(usersDb);
        }
        
        return updatedUser;
      }
      return null;
    } catch (error) {
      console.error('❌ Update user profile error:', error);
      throw error;
    }
  }

  // Demo utility methods
  getDemoStats() {
    const usersDb = this.getUsersDatabase();
    return {
      totalUsers: Object.keys(usersDb).length,
      users: Object.values(usersDb).map((user: any) => ({
        email: user.email,
        name: user.full_name,
        created: user.created_at
      }))
    };
  }

  clearDemoData() {
    localStorage.removeItem(this.STORAGE_KEYS.USER);
    localStorage.removeItem(this.STORAGE_KEYS.AUTHENTICATED);
    localStorage.removeItem(this.STORAGE_KEYS.USERS_DB);
    console.log('🧞 Demo data cleared');
  }
}