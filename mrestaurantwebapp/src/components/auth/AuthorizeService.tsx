import { jwtDecode } from 'jwt-decode';
import { ApiUrl } from '../../Consts.tsx';

interface User {
    id: string;
    email: string;
    role: string;
    jwt: string;
    exp: number;
}

export class AuthorizeService {
    private _callbacks: { callback: () => void; subscription: number }[] = [];
    private _nextSubscriptionId: number = 0;
    private _user: User | null = null;
    private _isAuthenticated: boolean = false;
    private _userLocalStorageKey: string = "user";
    private _authApiUrl: string = ApiUrl;

    public async isAuthenticated(): Promise<boolean> {
        const user = await this.getUser();
        return !!user
    }

    public async isInRole(role: string): Promise<boolean> {
        const user = await this.getUser();
        return !!user && user.role === role;
    }

    public async getJwtToken(): Promise<string | null> {
        const user = await this.getUser();
        return user ? user.jwt : null;
    }

    public async getUserEmail(): Promise<string | null> {
        const user = await this.getUser();
        return user ? user.email : null;
    }

    public async getUserRole(): Promise<string | null> {
        const user = await this.getUser();
        return user ? user.role : null;
    }

    public async getUserId(): Promise<string | null> {
        const user = await this.getUser();
        return user ? user.id : null;
    }

    private async getUser() {
        if (!this._user) {
            this._user = await JSON.parse(localStorage.getItem(this._userLocalStorageKey) || 'null');
            if (!this._user) {
                return null;
            }
        }

        if (this.hasTokenExpired(this._user.exp)) {
            return null;
        }

        return this._user;
    }

    private hasTokenExpired(expirationTimestamp: number | undefined): boolean {
        if (expirationTimestamp) {
            const currentTimestamp = Math.floor(Date.now() / 1000);
            return expirationTimestamp < currentTimestamp;
        }
        return false;
    }

    private updateState(user: User | null) {
        this._user = user;
        localStorage.setItem(this._userLocalStorageKey, JSON.stringify(user));

        this._isAuthenticated = !!this._user;
        this.notifySubscribers();
    }

    public subscribe(callback: () => void): number {
        this._callbacks.push({ callback, subscription: this._nextSubscriptionId++ });
        return this._nextSubscriptionId - 1;
    }

    public unsubscribe(subscriptionId: number) {
        const subscriptionIndex = this._callbacks.findIndex(element => element.subscription === subscriptionId);

        if (subscriptionIndex !== -1) {
            this._callbacks.splice(subscriptionIndex, 1);
        } else {
            throw new Error(`Invalid subscription ID: ${subscriptionId}`);
        }
    }

    private notifySubscribers() {
        this._callbacks.forEach(callback => callback.callback());
    }

    public async login(username: string, password: string): Promise<void> {
        // mocked jwt
        //const user = this.getUserDataFromJwt("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Njc4OTAiLCJlbWFpbCI6ImFhYUBtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImV4cCI6MTcwMTY5MTcyN30.GqM_hhjSgbBt0HyMGsys_EuF5ZUZXZhP-ckYEtjX7cQ");
        //this.updateState(user);
        //return;

        try {
            const response = await fetch(this._authApiUrl+'/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();

                if (data.token) {
                    const user = this.getUserDataFromJwt(data.token);
                    this.updateState(user);
                } else {
                    throw new Error('Invalid response from server');
                }
            } else {
                throw new Error('Invalid credentials');
            }
        } catch (error) {
            throw new Error('Error during login');
        }
    }


    public async register(username: string, password: string): Promise<void> {
        // mocked jwt
        //const user = this.getUserDataFromJwt("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Njc4OTAiLCJlbWFpbCI6ImFhYUBtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImV4cCI6MTcwMTY5MTcyN30.GqM_hhjSgbBt0HyMGsys_EuF5ZUZXZhP-ckYEtjX7cQ");
        //this.updateState(user);
        //return;

        try {
            const response = await fetch(this._authApiUrl+'/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();

                if (data.token) {
                    const user = this.getUserDataFromJwt(data.token);
                    this.updateState(user);
                } else {
                    throw new Error('Invalid response from server');
                }
            } else {
                throw new Error('Invalid credentials');
            }
        } catch (error) {
            throw new Error('Error during registration');
        }
    }



    private getUserDataFromJwt(jwt: string): User | null {
        try {
            const decoded = jwtDecode(jwt);
            const user: User = {
                id: decoded.id,
                email: decoded.email,
                role: decoded.role,
                jwt: jwt,
                exp: decoded.exp,
            };

            return user;
        } catch (error) {
            console.error('Error decoding JWT token:', error);
        }

        return null;
    }

    public async logout() {
        await this.updateState(null);
    }
}

const authService = new AuthorizeService();
export default authService;
