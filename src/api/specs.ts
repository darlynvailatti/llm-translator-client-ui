import { httpClient } from "./client"
import { TranslationSpecDetail, TranslationSpecList } from "./types"


export const getSpecs = async (id: string): Promise<[TranslationSpecList]> => {
    const specs = (await httpClient.get<[TranslationSpecList]>(`/endpoints/${id}/specs/`)).data
    return specs
}

export const getSpec = async (id: string, specId: string): Promise<TranslationSpecDetail> => {
    const spec = (await httpClient.get<TranslationSpecDetail>(`/endpoints/${id}/specs/${specId}/`)).data
    return spec
}

export const createSpec = async (id: string, data: any): Promise<TranslationSpecDetail> => {
    const spec = (await httpClient.post<TranslationSpecDetail>(`/endpoints/${id}/specs/`, data)).data
    return spec
}

export const updateSpec = async (id: string, specId: string, data: any): Promise<TranslationSpecDetail> => {
    const spec = (await httpClient.put<TranslationSpecDetail>(`/endpoints/${id}/specs/${specId}/`, data)).data
    return spec
}