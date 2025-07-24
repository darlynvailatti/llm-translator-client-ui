import { Alert, Stack, Typography } from "@mui/material";
import { GenerateArtifactResponse } from "../api/types";

export interface GenerateArtifactResponseProps {
    response: GenerateArtifactResponse
}

export default function ArtifactGenerationResponse(props: GenerateArtifactResponseProps) {
    const response = props.response
    const isItSuccess = Boolean(response.success && response.it_passed_all_tests)
    const message = response.artifact && !response.it_passed_all_tests && !isItSuccess ?
        "Artifact has been generated but one or more tests have failed" :
        !response.artifact ? "Artifact generation failed"
            : "Artifact has been generated successfully and all tests have passed"
    return (
        <Stack>
            <Alert severity={isItSuccess ? "success" : "error"}>
                <Typography variant="body1" fontWeight={"bold"}>{isItSuccess ? "Artifact has been generated successfully!" : "Artifact generation failed!"}</Typography>
                <Stack spacing={2}>
                    <Typography variant="body2">{message}</Typography>
                    {/* {props.response.artifact && (
                        <div>
                            <p>Artifact UUID: {props.response.artifact.uuid}</p>
                        </div>
                    )} */}
                    {/* {props.response.stacktrace && (
                        <div>
                            <p>Stacktrace:</p>
                            <pre>{props.response.stacktrace}</pre>
                        </div>
                    )} */}
                </Stack>
            </Alert>

        </Stack>
    );
}