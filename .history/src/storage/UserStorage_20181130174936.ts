const AccessTokenKey = "User.AccessTokenKey"

export class UserStorage {
    static  saveAccessToken(token: string) {
        window.localStorage.setItem(AccessTokenKey, token)
    }
    static  getAccessToken(): string | null {
        window.
        return  window.localStorage.getItem(AccessTokenKey) 
    }

    static clearAccessToken() {
        window.localStorage.removeItem(AccessTokenKey)
    }

    
}