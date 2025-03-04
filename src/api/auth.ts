import { httpClient } from "./client"
import { GetTokenRequest, GetTokenResponse } from "./types"


export const getToken = async (context: GetTokenRequest): Promise<GetTokenResponse> => {
    const response = (await httpClient.post<GetTokenResponse>('/token', {
        username: context.username,
        password: context.password
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    })).data
    return response
}