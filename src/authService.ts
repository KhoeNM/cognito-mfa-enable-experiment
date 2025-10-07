import { AssociateSoftwareTokenCommand, CognitoIdentityProviderClient, GlobalSignOutCommand, InitiateAuthCommand, SignUpCommand, VerifySoftwareTokenCommand } from "@aws-sdk/client-cognito-identity-provider";

const cognitoClient = new CognitoIdentityProviderClient({region: 'ap-southeast-1'});
const clientId = '6vrdeipkrr0su8q29k0414r761';

export interface AuthResponse {
    AuthenticationResult?: {
        AccessToken?: string;
        IdToken?: string;
        RefreshToken?: string;
    };
};

export const signUp = async (email: string, password: string): Promise<void> => {
    const command = new SignUpCommand({
        ClientId: clientId,
        Username: email,
        Password: password,
        UserAttributes: [
      ],
    });
    await cognitoClient.send(command);
}

export const signIn = async (username: string, password: string): Promise<AuthResponse> => {
    const command = new InitiateAuthCommand({
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: clientId,
        AuthParameters: {
            USERNAME: username,
            PASSWORD: password,
        }
    });
    const response = await cognitoClient.send(command);
    return response;
}

export const setupTOTP = async (accessToken: string): Promise<{ secretCode: string; session: string }> => {
    const command = new AssociateSoftwareTokenCommand({
        AccessToken: accessToken
    });
    const response = await cognitoClient.send(command);
    return {
        secretCode: response.SecretCode || '',
        session: response.Session || ''
    };
}

export const verifyTOTP = async (accessToken: string, userCode: string, session: string): Promise<void> => {
    const command = new VerifySoftwareTokenCommand({
        AccessToken: accessToken,
        UserCode: userCode,
        Session: session
    });
    await cognitoClient.send(command);
}

export const signOut = async (accessToken: string): Promise<void> => {
    const command = new GlobalSignOutCommand({
        AccessToken: accessToken
    });
    await cognitoClient.send(command);
}

export const getAccessToken = (): string | null => localStorage.getItem('accessToken');

export const setAccessToken = (token: string): void => localStorage.setItem('accessToken', token);

export const clearAccessToken = (): void => localStorage.removeItem('accessToken');