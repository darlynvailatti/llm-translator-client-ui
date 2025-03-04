import { httpClient as httpClient } from "./client"
import { TranslationEndpointList, TranslationEndpointDetail } from "./types"

export const getEndpoints = async (): Promise<[TranslationEndpointList]> => {
    const endpoints = (await httpClient.get<[TranslationEndpointList]>('/endpoints')).data
    return endpoints
}

export const getEndpoint = async (id: string): Promise<TranslationEndpointDetail> => {
    const endpoint = (await httpClient.get<TranslationEndpointDetail>(`/endpoints/${id}`)).data
    return endpoint
}