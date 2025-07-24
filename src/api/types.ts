export interface GetTokenResponse {
    token: string
}

export interface GetTokenRequest {
    username: string
    password: string
}

export interface TranslationEndpointList {
    uuid: string
    name: string
    key: string
    is_active: boolean
    owner: string
    created_at: string
    updated_at: string
    total_success: number
    total_failure: number
    traffic: object
}

export interface TranslationEndpointDetail {
    uuid: string
    name: string
    key: string
    is_active: boolean
    definition: object
    created_at: string
    updated_at: string
    total_success: number
    total_failure: number
    traffic: object
}

export interface NewTranslationEndpoint {
    name: string
    key: string
    definition: object
}

export interface UpdateTranslationEndpoint {
    uuid: string
    name: string
    key: string
    is_active: boolean
    definition: object
}

export interface TranslationSpecList {
    uuid: string
    name: string
    is_active: boolean
    version: string
    created_at: string
    updated_at: string
}

export enum TranslationSpecEngine {
    DYNAMIC = "dynamic",
    COMPILED_ARTIFACT = "compiled_artifact"
}

export interface TranslationSpecDefinition {
    engine?: TranslationSpecEngine
    input_rule?: {
        content_type: string
        schema_: string
    }
    output_rule?: {
        content_type: string
        schema_: string
    }
    extra_context?: string
}

export interface NewTranslationSpec {
    name: string
    version: string
    definition: TranslationSpecDefinition
}


export interface UpdateTranslationSpec {
    uuid: string
    name: string
    is_active: boolean
    version: string
    definition?: TranslationSpecDefinition
}


export interface TranslationSpecDetail {
    uuid: string
    name: string
    is_active: boolean
    version: string
    definition?: TranslationSpecDefinition
    created_at: string
    updated_at: string
}

export interface SpecTranslationTestCaseList {
    uuid: string
    name: string
    status: SpecTestCaseStatus
}

export interface TranslationRequest {
    endpoint_uuid: string
    payload: string
}

export interface TranslationResponse {
    success: boolean
    message: string
    duration: number
    content_type: string
    body: string
}

export interface AccountDetail {
    name: string
    api_keys: string[]
    is_active: boolean
}

export interface GenerateArtifactResponse {
    success: boolean
    message?: string
    artifact?: {
        uuid: string
    }
    stacktrace?: string
    it_generated_artifact: boolean
    it_passed_all_tests: boolean
    failed_test_cases?: [object]
}

export interface SpecArtifactResponse {
    uuid: string
    implementation_str: string
}

export interface SpecTestCaseDefinition {
    input: {
        body: string
        content_type: string
    }
    expectation: {
        body: string
        content_type: string
        result?: "success" | "failure"
    }
}

export enum SpecTestCaseStatus {
    SUCCESS = "SUCCESS",
    FAILURE = "FAILURE",
    NOT_EXECUTED = "NOT_EXECUTED"
}
export interface SpecTestCaseDetail {
    uuid?: string
    name: string
    status: SpecTestCaseStatus
    definition: SpecTestCaseDefinition
    last_execution?: {
        executed_at: string,
        status: SpecTestCaseStatus,
        result: {
            message: string
        }
    }
}

export interface NewSpecTestCase {
    name: string
    definition: SpecTestCaseDefinition
}

export interface SpecRunTestCasesResponse {
    success: boolean
    error?: string
}