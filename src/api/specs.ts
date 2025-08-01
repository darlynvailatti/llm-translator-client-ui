import { httpClient } from "./client"
import { GenerateArtifactResponse, NewSpecTestCase, SpecArtifactResponse, SpecRunTestCasesResponse, SpecTestCaseDetail, SpecTranslationTestCaseList, TranslationSpecDetail, TranslationSpecList } from "./types"


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

export const getTestCases = async (specId: string): Promise<[SpecTranslationTestCaseList]> => {
    const testCases = (await httpClient.get<[SpecTranslationTestCaseList]>(`/specs/${specId}/testcases/`)).data
    return testCases
}

export const getTestCase = async (specId: string, testCaseId: string): Promise<SpecTestCaseDetail> => {
    const testCase = (await httpClient.get<SpecTestCaseDetail>(`/specs/${specId}/testcases/${testCaseId}`)).data
    return testCase
}

export const createTestCase = async (specId: string, data: NewSpecTestCase): Promise<SpecTestCaseDetail> => {
    const testCase = (await httpClient.post<SpecTestCaseDetail>(`/specs/${specId}/testcases/`, data)).data
    return testCase
}

export const updateTestCase = async (specId: string, testCaseId: string, data: SpecTestCaseDetail): Promise<SpecTestCaseDetail> => {
    const testCase = (await httpClient.put<SpecTestCaseDetail>(`/specs/${specId}/testcases/${testCaseId}/`, data)).data
    return testCase
}

export const deleteTestCase = async (specId: string, testCaseId: string): Promise<void> => {
    await httpClient.delete<void>(`/specs/${specId}/testcases/${testCaseId}/`)
}

export const generateArtifact = async (specId: string): Promise<GenerateArtifactResponse> => {
    const response = (await httpClient.post<GenerateArtifactResponse>(`/specs/${specId}/generate_artifact`, null)).data
    return response
}

export const getArtifact = async (specId: string): Promise<SpecArtifactResponse | null> => {
    const response = (await httpClient.get<[SpecArtifactResponse]>(`/specs/${specId}/artifacts/`)).data

    if (response.length > 0) {
        return response[0]
    }
    return null
}

export const runTestCases = async (specId: string): Promise<SpecRunTestCasesResponse> => {
    const testCases = (await httpClient.post<SpecRunTestCasesResponse>(`/specs/${specId}/testcases/run`, {})).data
    return testCases
}

export const activateSpec = async (specId: string): Promise<TranslationSpecDetail> => {
    const spec = (await httpClient.post<TranslationSpecDetail>(`/specs/${specId}/activate`, null)).data
    return spec
}