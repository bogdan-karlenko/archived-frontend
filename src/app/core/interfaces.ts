export interface ILoginResponse {
    user: {
        id: string,
        name: string
    };
    token: string;
}

export interface ISocialCredentials {
    email: string;
    id: string;
    idToken?: string;
    image: string;
    name: string;
    provider: string;
    token?: string;
}

export interface ILocalCredentials {
    email: string;
    password: string;
}

export interface IUserProfile {
    id: string;
    username: string;
    password?: string;
    facebook?: string;
    google?: string;
}
