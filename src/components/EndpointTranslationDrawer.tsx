import { Editor } from "@monaco-editor/react";
import { Alert, Button, CircularProgress, Dialog, DialogContent, DialogTitle, Grid, IconButton, Paper, Stack, Typography } from "@mui/material";
import { SwapHoriz } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { translate } from "../api/endpoints";
import { toast } from "react-toastify";
import { TranslationResponse } from "../api/types";

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

    return (
        <Dialog
            open={props.isOpen}
            onClose={props.onClose}
            maxWidth="xl"
            fullWidth
            PaperProps={{
                sx: {
                    minHeight: '80vh',
                    maxHeight: '90vh'
                }
            }}
        >
            <DialogTitle>
                <Typography variant="h4" fontWeight="bold">Endpoint Translation</Typography>
            </DialogTitle>
            
            <DialogContent>
                <Grid container spacing={3} sx={{ height: '100%' }}>
                    {/* First Column - Input Methods */}
                    <Grid item xs={4}>
                        <Stack spacing={2} sx={{ height: '100%' }}>
                            {/* Drag and Drop */}
                            <Paper sx={{ 
                                padding: 2, 
                                height: "200px", 
                                border: "3px dashed #ccc",
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                cursor: 'pointer',
                                '&:hover': {
                                    borderColor: '#999',
                                    backgroundColor: '#f5f5f5'
                                }
                            }}>
                                <Typography variant="h6" fontWeight="bold" textAlign="center">
                                    Drag and Drop
                                </Typography>
                                <Typography variant="body2" textAlign="center" color="text.secondary">
                                    Drag and drop your file here to translate
                                </Typography>
                            </Paper>

                            {/* Copy & Paste */}
                            <Paper sx={{ padding: 2, flex: 1 }}>
                                <Stack spacing={2} sx={{ height: '100%' }}>
                                    <Typography variant="h6" fontWeight="bold">
                                        Copy & Paste
                                    </Typography>
                                    <Editor
                                        height="300px"
                                        language="auto"
                                        defaultValue={`// Paste your content/payload here...`}
                                        value={copyAndPastePayload}
                                        onChange={(value) => value ? setCopyAndPastePayload(value) : setCopyAndPastePayload("")}
                                        theme="vs-dark"
                                    />
                                </Stack>
                            </Paper>
                        </Stack>
                    </Grid>

                    {/* Second Column - Translation Button */}
                    <Grid item xs={1}>
                        <Stack justifyContent="center" alignItems="center" sx={{ height: '100%' }}>
                            <IconButton
                                onClick={handleTranslate}
                                disabled={isLoading || !contentToBeTranslated || contentToBeTranslated === ""}
                                sx={{
                                    width: 80,
                                    height: 80,
                                    backgroundColor: 'primary.main',
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: 'primary.dark',
                                    },
                                    '&:disabled': {
                                        backgroundColor: 'grey.300',
                                        color: 'grey.500'
                                    }
                                }}
                            >
                                {isLoading ? (
                                    <CircularProgress size={40} sx={{ color: 'white' }} />
                                ) : (
                                    <SwapHoriz sx={{ fontSize: 40 }} />
                                )}
                            </IconButton>
                        </Stack>
                    </Grid>

                    {/* Third Column - Translation Result */}
                    <Grid item xs={7}>
                        <Stack spacing={2} sx={{ height: '100%' }}>
                            {!isLoading && translationResponse && (
                                <Alert severity={translationResponse?.success ? "success" : "error"}>
                                    <Stack spacing={1}>
                                        <Typography variant="h6" fontWeight="bold">
                                            {translationResponse?.success ? "Translation successful" : "Translation failed"}
                                        </Typography>
                                        <Typography variant="body1">
                                            {translationResponse?.message}
                                        </Typography>
                                    </Stack>
                                </Alert>
                            )}

                            {!isLoading && translationResponse && (
                                <Grid container spacing={2}>
                                    <Grid item>
                                        <Stack padding={1}>
                                            <Typography variant="body2" fontWeight="bold">Duration (seconds)</Typography>
                                            <Typography variant="h4">{translationResponse?.duration}</Typography>
                                        </Stack>
                                    </Grid>
                                    <Grid item>
                                        <Stack padding={1}>
                                            <Typography variant="body2" fontWeight="bold">Translated Content-Type</Typography>
                                            <Typography variant="h4">{translationResponse?.content_type || "---"}</Typography>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            )}

                            {!isLoading && translationResponse?.body ? (
                                <Paper sx={{ padding: 2, flex: 1 }}>
                                    <Stack spacing={2} sx={{ height: '100%' }}>
                                        <Typography variant="h6" fontWeight="bold">Translated Payload</Typography>
                                        <Editor
                                            height="400px"
                                            language={translatedContentType}
                                            value={translationResponse?.body}
                                            theme="vs-dark"
                                        />
                                    </Stack>
                                </Paper>
                            ) : (
                                <Paper sx={{ 
                                    padding: 2, 
                                    flex: 1, 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    backgroundColor: '#f5f5f5'
                                }}>
                                    <Typography variant="body1" color="text.secondary" textAlign="center">
                                        Translation result will appear here
                                    </Typography>
                                </Paper>
                            )}
                        </Stack>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
}