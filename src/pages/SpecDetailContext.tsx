import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { GenerateArtifactResponse, SpecArtifactResponse, SpecTranslationTestCaseList, TranslationSpecDetail } from "../api/types";
import { generateArtifact as generateArtifactApiCall, getArtifact, getSpec, getTestCases, runTestCases as runTestCasesApiCall } from "../api/specs";

export interface SpecDetailState {
    endpointId?: string
    specId?: string
    spec?: TranslationSpecDetail
    artifact?: SpecArtifactResponse | null
    testCases?: [SpecTranslationTestCaseList] | []
    artifactGenerationResponse?: GenerateArtifactResponse
    isGeneratingArtifact: boolean
    isRunningTestCases: boolean

    generateArtifact: () => Promise<void>
    setEndpointId: (endpointId: string) => void
    setSpecId: (specId: string) => void
    setTestCases: (testCases: [SpecTranslationTestCaseList]) => void
    setArtifact: (artifact: SpecArtifactResponse | null) => void
    reloadTestCases: () => void
    reloadArtifact: () => void
    runTestCases: () => Promise<void>
}

const SpecDetailContext = createContext({} as SpecDetailState);

export const SpecDetailProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const [endpointId, setEndpointId] = useState<string>()
    const [specId, setSpecId] = useState<string>()
    const [spec, setSpec] = useState<TranslationSpecDetail>()
    const [testCases, setTestCases] = useState<[SpecTranslationTestCaseList] | []>()
    const [artifact, setArtifact] = useState<SpecArtifactResponse | null>()
    const [artifactGenerationResponse, setArtifactResponse] = useState<GenerateArtifactResponse>()

    const [isGeneratingArtifact, setIsGeneratingArtifact] = useState(false)
    const [isRunningTestCases, setIsRunningTestCases] = useState(false)


    const reloadArtifact = useCallback(() => {
        if (specId) {
            getArtifact(specId)
                .then((response) => {
                    setArtifact(response)
                })
        }
    }, [specId])

    const reloadTestCases = useCallback(() => {
        if (specId) {
            getTestCases(specId)
                .then((response) => {
                    setTestCases(response)
                })
        }
    }, [specId])

    const generateArtifact = async () => {
        if (specId) {
            setIsGeneratingArtifact(true)
            try {
                const response = await generateArtifactApiCall(specId)
                setArtifactResponse(response)
                reloadArtifact()
                reloadTestCases()
            } catch (error) {
                throw new Error(`Failed to generate artifact: ${error}`)
            } finally {
                setIsGeneratingArtifact(false)
            }
        }
    }

    const runTestCases = async () => {
        if (!specId) return
        try {
            setIsRunningTestCases(true)
            const response = await runTestCasesApiCall(specId)

            console.log(response)
            if (!response.success) {
                throw new Error("One or more test cases failed")
            }
        } catch (error) {
            throw new Error(`Failed to run test cases: ${error}`)
        } finally {
            reloadTestCases()
            setIsRunningTestCases(false)
        }
    }

    useEffect(() => {
        reloadTestCases()
    }, [specId, reloadTestCases])

    useEffect(() => {
        if (endpointId && specId) {
            getSpec(endpointId, specId)
                .then((response) => {
                    setSpec(response)
                })
        }
    }, [endpointId, specId])

    const state: SpecDetailState = {
        endpointId,
        specId,
        spec,
        artifact,
        testCases,
        artifactGenerationResponse,
        isGeneratingArtifact,
        isRunningTestCases,


        setSpecId,
        setTestCases,
        setArtifact,
        reloadTestCases,
        reloadArtifact,
        setEndpointId,
        generateArtifact,
        runTestCases
    }
    return (
        <SpecDetailContext.Provider value={state}>
            {children}
        </SpecDetailContext.Provider>
    );
};

export const useSpecDetail = () => {
    const context = useContext(SpecDetailContext);
    if (!context) {
        throw new Error("useSpecDetail must be used within a SpecDetailProvider");
    }
    return context;
};
