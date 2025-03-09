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
    definition: string
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

export interface TranslationSpecList {
    uuid: string
    name: string
    is_active: boolean
    version: string
    created_at: string
    updated_at: string
}

export interface TranslationSpecDefinition {
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