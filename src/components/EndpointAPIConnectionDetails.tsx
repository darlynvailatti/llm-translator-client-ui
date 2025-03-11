import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, Stack, Typography } from "@mui/material"
import { AccountDetail, TranslationEndpointDetail } from "../api/types"
import { useEffect, useState } from "react"
import { getAccountByEndpoint } from "../api/endpoints"
import { Editor } from "@monaco-editor/react"
import { API_URL, TRANSLATE_ENDPOINT } from "../constants"

export interface EndpointAPIConnectionDetailsProps {
    onClose: () => void
    open: boolean
    endpoint: TranslationEndpointDetail
}

export default function EndpointAPIConnectionDetails(props: EndpointAPIConnectionDetailsProps) {

    const [accountDetail, setAccountDetail] = useState<AccountDetail>()

    const apiTranslationUrl = `${API_URL}${TRANSLATE_ENDPOINT}/${props.endpoint.key}`
    const apiKey = accountDetail?.api_keys.at(0)
    const apiTranslationMethod = "POST"
    const examplePayload = `import requests
import json

api_url = "${apiTranslationUrl}"
api_key = "${apiKey}"

headers = {
    "Authorization": f"{api_key}",
    "Content-Type": "application/json"
}

payload = {
    "text": "Hello, world!",
    "source_language": "en",
    "target_language": "es"
}

response = requests.post(api_url, headers=headers, data=json.dumps(payload))`

    useEffect(() => {
        // Fetch account details
        if (props.endpoint.uuid)
            getAccountByEndpoint(props.endpoint.uuid).then((data) => {
                setAccountDetail(data)
            })
    }, [props.endpoint.uuid])

    // return a MUI simple dialog
    return <Dialog
        open={props.open}
        onClose={props.onClose}
        maxWidth="md"
        fullWidth
    >
        <DialogTitle>
            <Typography variant="h4" fontWeight={"bold"}>HTTP API Connection</Typography>
        </DialogTitle>
        <DialogContent>
            <Stack spacing={2} padding={2}>
                <Grid container>
                    <Grid item xs={6}>
                        <Stack spacing={1}>
                            <Typography variant="body1" fontWeight={"bold"}>URL</Typography>
                            <Typography variant="body2" color="textSecondary">{apiTranslationUrl}</Typography>
                        </Stack>
                    </Grid>
                    <Grid item xs={6}>
                        <Stack spacing={1}>
                            <Typography variant="body1" fontWeight={"bold"}>Method</Typography>
                            <Typography variant="body2" color="textSecondary">{apiTranslationMethod}</Typography>
                        </Stack>
                    </Grid>
                </Grid>
                <Divider />
                <Typography variant="h6" fontWeight={"bold"}>Authentication Details</Typography>
                <Grid container>
                    <Grid item xs={6}>
                        <Stack spacing={1}>
                            <Typography variant="body1" fontWeight={"bold"}>Header</Typography>
                            <Typography variant="body2" color="textSecondary">Authorization</Typography>
                        </Stack>
                    </Grid>
                    <Grid item xs={6}>
                        <Stack spacing={1}>
                            <Typography variant="body1" fontWeight={"bold"}>Value</Typography>
                            <Typography variant="body2" color="textSecondary">{apiKey}</Typography>
                        </Stack>
                    </Grid>
                </Grid>
                <Divider />
                <Typography variant="body2" fontWeight={"bold"}>Request Payload Example</Typography>
                <Editor
                    height="40vh"
                    language="python"
                    options={{
                        minimap: { enabled: false },
                    }}
                    value={examplePayload}
                    />
            </Stack>
        </DialogContent>
        <DialogActions>
            <Button onClick={props.onClose}>Close</Button>
        </DialogActions>
    </Dialog>
}