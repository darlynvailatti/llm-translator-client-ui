import { Editor } from "@monaco-editor/react";
import { Alert, Button, CircularProgress, Drawer, Grid, Paper, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { translate } from "../api/endpoints";
import { toast } from "react-toastify";
import { TranslationResponse } from "../api/types";
import { set } from "date-fns";

export interface EndpointTranslationDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    endpointId: string;
    endpointKey: string;
    endpointName: string;
}

const MAPPED_LANGS_TO_MONACO_LANGS: { [key: string]: string } = {
    "application/json": "json",
    "application/xml": "html",
    "text/html": "html",
    "text/css": "css",
    "text/csv": "csv",
    "text/javascript": "javascript",
}

export default function EndpointTranslationDrawer(props: EndpointTranslationDrawerProps) {

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [copyAndPastePayload, setCopyAndPastePayload] = useState<string>("")
    const [translationResponse, setTranslationResponse] = useState<TranslationResponse>()
    const [contentToBeTranslated, setContentToBeTranslated] = useState<string>("")
    const [translatedContentType, setTranslatedContentType] = useState<string>("")

    useEffect(() => {
        setContentToBeTranslated(copyAndPastePayload)
    }, [copyAndPastePayload])

    useEffect(() => {
        if (translationResponse) {
            setTranslatedContentType(getLanguage(translationResponse.content_type || ""))
        }
    }, [translationResponse])

    async function handleTranslate() {
        try {
            setIsLoading(true)
            const response = await translate({
                endpoint_uuid: props.endpointId,
                payload: copyAndPastePayload
            })
            setTranslationResponse(response)
        } catch (error) {
            toast.error("Failed to translate payload")
        } finally {
            setIsLoading(false)
        }
    }

    function getLanguage(lang: string): string {
    
        let mappedLang = "auto"
        Object.keys(MAPPED_LANGS_TO_MONACO_LANGS).forEach(contentType => {
            console.log(lang + " " + contentType, new RegExp(lang).test(contentType))
            // If contentType is found in lang, return the mapped language (regex)
            if (new RegExp(lang).test(contentType)) {
                console.log("Matched: ", MAPPED_LANGS_TO_MONACO_LANGS[contentType])  
                mappedLang =  MAPPED_LANGS_TO_MONACO_LANGS[contentType]
            }
        })
        return mappedLang
    }


    return <Drawer
        open={props.isOpen}
        anchor="right"
        onClose={props.onClose}
        sx={{
            '& .MuiDrawer-paper': {
                width: "60%"
            },
        }}
    >
        <Stack spacing={2} padding={2}>
            <Typography variant="h4" fontWeight={"bold"}>Endpoint Translation</Typography>

            <Grid container spacing={1}>

                <Grid item xs={3} lg={3} md={3} xl={3}>

                    <Paper sx={{ padding: 2, height: "250px", border: "5px dashed #ccc" }}>
                        {/* Drag and drop */}
                        <Typography variant="h6" fontWeight={"bold"}>Drag and drop</Typography>
                        <Typography variant="body1">Drag and drop here the file you want to translate</Typography>
                    </Paper>

                </Grid>

                <Grid item xs={9} lg={9} md={9} xl={9}>
                    <Paper sx={{ padding: 2, height: "250px" }}>
                        <Stack spacing={2}>
                            <Typography variant="h6" fontWeight={"bold"}>Copy & Paste</Typography>

                            <Editor
                                height="180px"
                                language="auto"
                                defaultValue={`// Paste your content/payload here...`}
                                value={copyAndPastePayload}
                                onChange={(value) => value ? setCopyAndPastePayload(value) : setCopyAndPastePayload("")}
                            />
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>

            <Button variant="contained" color="primary" onClick={handleTranslate} disabled={isLoading || !contentToBeTranslated || contentToBeTranslated === ""}>
                Translate
                {isLoading && <CircularProgress size={20} sx={{ ml: 1 }} />}
            </Button>



            {!isLoading && translationResponse ?
                <Alert severity={translationResponse?.success ? "success" : "error"} >
                    <Stack spacing={1}>
                        <Typography variant="h6" fontWeight={"bold"}>
                            {translationResponse?.success ? "Translation successful" : "Translation failed"}
                        </Typography>
                        <Typography variant="body1">
                            {translationResponse?.message}
                        </Typography>

                    </Stack>
                </Alert>
                : null}



            {!isLoading && translationResponse ? <Grid container spacing={2} p={0}>
                <Grid item>
                    <Stack padding={1}>
                        <Typography variant="body2" fontWeight={"bold"}>Duration (seconds)</Typography>
                        <Typography variant="h4">{translationResponse?.duration}</Typography>
                    </Stack>
                </Grid>

                <Grid item>
                    <Stack padding={1}>
                        <Typography variant="body2" fontWeight={"bold"}>Translated Content-Type</Typography>
                        <Typography variant="h4">{translationResponse?.content_type || "---"}</Typography>
                    </Stack>
                </Grid>
            </Grid> : null}


            {!isLoading && translationResponse?.body && <Paper sx={{ padding: 2 }}>
                <Stack spacing={2}>
                    <Typography variant="h6" fontWeight={"bold"}>Translated Payload</Typography>
                    <Editor
                        height="180px"
                        language={translatedContentType}
                        value={translationResponse?.body}
                    />
                </Stack>
            </Paper>}

        </Stack>

    </Drawer>
}