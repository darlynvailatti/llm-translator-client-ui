import { httpClient } from "./client"
import { TranslationEndpointList, TranslationEndpointDetail, NewTranslationEndpoint } from "./types"

export const getEndpoints = async (): Promise<[TranslationEndpointList]> => {
    const endpoints = (await httpClient.get<[TranslationEndpointList]>('/endpoints')).data
    return endpoints
}

export const getEndpoint = async (id: string): Promise<TranslationEndpointDetail> => {
    const endpoint = (await httpClient.get<TranslationEndpointDetail>(`/endpoints/${id}`)).data
    return endpoint
}

export const createEndpoint = async (data: NewTranslationEndpoint): Promise<TranslationEndpointDetail> => {
    const endpoint = (await httpClient.post<TranslationEndpointDetail>('/endpoints/', data)).data
    return endpoint
}

export const updateEndpoint = async (id: string, data: NewTranslationEndpoint): Promise<TranslationEndpointDetail> => {
    const endpoint = (await httpClient.put<TranslationEndpointDetail>(`/endpoints/${id}/`, data)).data
    return endpoint
}