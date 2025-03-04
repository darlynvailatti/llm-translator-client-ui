import { httpClient as httpClient } from "./client"
import { TranslationSpecList } from "./types"


export const getSpecs = async (id: string): Promise<[TranslationSpecList]> => {
    const endpoint = (await httpClient.get<[TranslationSpecList]>(`/endpoints/${id}/specs/`)).data
    return endpoint
}