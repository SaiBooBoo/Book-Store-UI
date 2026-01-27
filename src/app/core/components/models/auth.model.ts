
export interface JwtResponse {
    token: string;
    tokenType?: 'Bearer' | string;
    expiresIn?: number;
}

export interface LoginRequest {
    username: string;
    password: string;
}