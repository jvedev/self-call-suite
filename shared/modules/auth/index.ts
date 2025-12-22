export interface User {
    id: string;
    username: string;
    email: string;
    role: 'admin' | 'user';
}

export interface AuthService {
    login(username: string, password: string): Promise<User | null>;
    register(username: string, email: string, password: string): Promise<User | null>;
    logout(): Promise<void>;
    getCurrentUser(): User | null;
    forgotPassword(usernameOrEmail: string): Promise<boolean>;
    isAuthenticated(): boolean;
}

export class MockAuthService implements AuthService {
    private currentUser: User | null = null;
    private users: User[] = [
        { id: '1', username: 'admin', email: 'admin@example.com', role: 'admin' },
        { id: '2', username: 'user', email: 'user@example.com', role: 'user' }
    ];

    async login(username: string, password: string): Promise<User | null> {
        // Mock implementation - in real app would validate against backend
        const user = this.users.find(u => u.username === username);
        console.log(`Logging in user: ${username} & ${password}`);
        if (user) {
            this.currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            return user;
        }
        return null;
    }

    async register(username: string, email: string, password: string): Promise<User | null> {
        console.log(`Logging in user: ${username} & ${password}`);

        // Mock implementation
        const newUser: User = {
            id: crypto.randomUUID(),
            username,
            email,
            role: 'user'
        };
        this.users.push(newUser);
        this.currentUser = newUser;
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        return newUser;
    }

    async logout(): Promise<void> {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
    }

    getCurrentUser(): User | null {
        if (!this.currentUser) {
            const stored = localStorage.getItem('currentUser');
            if (stored) {
                this.currentUser = JSON.parse(stored);
            }
        }
        return this.currentUser;
    }

    async forgotPassword(usernameOrEmail: string): Promise<boolean> {
        // Mock implementation
        const user = this.users.find(u => 
            u.username === usernameOrEmail || u.email === usernameOrEmail
        );
        return !!user;
    }

    isAuthenticated(): boolean {
        return this.getCurrentUser() !== null;
    }
}

export const authService = new MockAuthService();