import { createContext, useContext, useEffect, useState } from "react";
import { SpecTranslationTestCaseList, TranslationSpecDetail } from "../api/types";
import { getSpec, getTestCases } from "../api/specs";

export interface SpecDetailState {
    endpointId?: string
    specId?: string
    spec?: TranslationSpecDetail
    testCases?: [SpecTranslationTestCaseList] | []

    setEndpointId: (endpointId: string) => void
    setSpecId: (specId: string) => void
    setTestCases: (testCases: [SpecTranslationTestCaseList]) => void
    reloadTestCases: () => void
}

const SpecDetailContext = createContext({} as SpecDetailState);

export const SpecDetailProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const [endpointId, setEndpointId] = useState<string>()
    const [specId, setSpecId] = useState<string>()
    const [spec, setSpec] = useState<TranslationSpecDetail>()
    const [testCases, setTestCases] = useState<[SpecTranslationTestCaseList] | []>()

    useEffect(() => {
        reloadTestCases()
    }, [specId])

    useEffect(() => {
        if(endpointId && specId) {
            getSpec(endpointId, specId)
                .then((response) => {
                    setSpec(response)
                })
        }
    }, [endpointId, specId])

    const reloadTestCases = () => {
        if (specId) {
            getTestCases(specId)
                .then((response) => {
                    setTestCases(response)
                })
        }
    }

    const state: SpecDetailState = {
        endpointId,
        specId,
        spec,
        testCases,


        setSpecId,
        setTestCases,
        reloadTestCases,
        setEndpointId
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
