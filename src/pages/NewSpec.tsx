import { Box, Button, Container, Grid, Paper, Stack, TextField } from "@mui/material"
import { useNavigate, useParams } from "react-router-dom"
import { Breadcrumb } from "../components/Breadcrumb"
import { useState } from "react"
import { NewTranslationSpec } from "../api/types"
import { createSpec } from "../api/specs"
import { toast } from "react-toastify"


export default function NewSpec() {

    const navigate = useNavigate()
    const params = useParams<{ id: string }>()

    const [spec, setSpec] = useState<NewTranslationSpec>({
        name: "",
        version: "",
        definition: {
            input_rule: {
                content_type: "",
                schema_: ""
            },
            output_rule: {
                content_type: "",
                schema_: ""
            },
            extra_context: ""
        }
    })

    function updateField(field: string, value: string) {
        setSpec({ ...spec, [field]: value })
    }

    async function create() {
        // Call the createSpec API
        // Redirect to the spec detail page
        if (!params.id) {
            toast.error("Invalid endpoint id")
            return
        }

        try {
            const response = await createSpec(params.id, spec)
            toast.success("Spec created successfully")
            navigate(`/endpoints/${params.id}/specs/${response.uuid}`)
        } catch (error) {
            toast.error("Failed to create spec: " + error)
        }
    }

    return (
        <Container maxWidth={false} sx={{ p: 3 }}>
            <Stack spacing={2}>
            <Box sx={{ mb: 3 }}>
                <Breadcrumb
                    items={[
                        { label: "My Account", href: "/" },
                        { label: "Endpoints", href: "/" },
                        { label: params.id || "" },
                        { label: "New Spec" }
                    ]}
                />
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {/* Endpoint info card */}
                <Paper sx={{ p: 2 }}>
                    <Grid container spacing={2} alignItems="center">

                        <Grid item xs={12}>
                            <TextField
                                id="spec-name"
                                label="Spec Name"
                                fullWidth
                                placeholder="Enter Nae"
                                variant="standard"
                                value={spec.name}
                                onChange={(e) => updateField("name", e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                id="spec-version"
                                label="Spec Version"
                                fullWidth
                                placeholder="Enter spec version"
                                variant="standard"
                                value={spec.version}
                                onChange={(e) => updateField("version", e.target.value)}
                            />
                        </Grid>
                    </Grid>
                </Paper>
            </Box>

            {/* Save Button */}
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button variant="contained" color="primary" onClick={create}>
                    Create
                </Button>
            </Box>
            </Stack>

        </Container>
    )
}