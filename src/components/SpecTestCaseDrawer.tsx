import { Drawer, TextField, Button, Grid, Stack, Typography, Paper, Select, MenuItem, Box } from "@mui/material"
import { useEffect, useState } from "react"
import { SpecTestCaseDetail, SpecTestCaseStatus } from "../api/types"
import { createTestCase, deleteTestCase, getTestCase, updateTestCase } from "../api/specs"
import { toast } from "react-toastify"
import { Editor } from "@monaco-editor/react"
import { useSpecDetail } from "../pages/SpecDetailContext"
import SpecTestCaseExecution from "./SpecTestCaseExecution"

export interface SpecTestCaseDrawerProps {
    specId: string
    testCaseId?: string
    open: boolean
    onClose: () => void
}

export default function SpecTestCaseDrawer(props: SpecTestCaseDrawerProps) {
    const context = useSpecDetail()
    const [editableTestCase, setEditableTestCase] = useState<SpecTestCaseDetail | undefined>()

    useEffect(() => {
        if (props.testCaseId && props.specId) {
            getTestCase(props.specId, props.testCaseId).then((data) => {
                setEditableTestCase(data)
            })
        } else if (!props.testCaseId) {
            setEditableTestCase({
                name: "",
                status: SpecTestCaseStatus.NOT_EXECUTED,
                definition: {
                    input: {
                        body: "",
                        content_type: ""
                    },
                    expectation: {
                        body: "",
                        content_type: "",
                        result: "success"
                    }
                }
            })
        }
    }, [props.specId, props.testCaseId])

    function updateField(field: string, value: any) {
        if (editableTestCase) {
            setEditableTestCase({ ...editableTestCase, [field]: value })
        }
    }

    async function handleDelete() {
        try {
            if (editableTestCase) {
                await deleteTestCase(props.specId, props.testCaseId!)
                toast.success("Test case deleted successfully")
                props.onClose()
                context.reloadTestCases()
            }
        } catch (error) {
            toast.error("Failed to delete test case")
        }
    }

    async function handleUpdate() {
        try {
            if (editableTestCase) {
                await updateTestCase(props.specId, props.testCaseId!, editableTestCase)
                toast.success("Test case updated successfully")
                props.onClose()
                context.reloadTestCases()
            }
        } catch (error) {
            toast.error("Failed to update test case")
        }
    }

    async function handleCreate() {
        try {
            if (editableTestCase) {
                await createTestCase(props.specId, {
                    name: editableTestCase.name,
                    definition: {
                        input: {
                            body: editableTestCase.definition.input.body,
                            content_type: editableTestCase.definition.input.content_type
                        },
                        expectation: {
                            body: editableTestCase.definition.expectation.body,
                            content_type: editableTestCase.definition.expectation.content_type,
                            result: editableTestCase.definition.expectation.result
                        }
                    }
                })
                toast.success("Test case created successfully")
                props.onClose()
                context.reloadTestCases()
            }

        } catch (error) {
            toast.error("Failed to create test case")
        }
    }

    return <Drawer
        open={props.open}
        onClose={props.onClose}
        anchor="right"
        sx={{
            "& .MuiDrawer-paper": {
                width: "90%",
                boxSizing: 'border-box'
            }
        }}>


        <Grid container spacing={2} padding={2}>
            <Grid item xs={12}>
                <Box justifyContent={"space-between"} flexDirection={"row"} display={"flex"}>
                    <Typography variant="h5" fontWeight={"bold"}>Test Case</Typography>
                </Box>
            </Grid>
            <Grid item xs={12}>
                <Grid container spacing={2} alignItems={"end"}>
                    <Grid item md={10}>
                        <TextField
                            label="Name"
                            fullWidth
                            variant="standard"
                            value={editableTestCase?.name || ""}
                            onChange={(e) => updateField("name", e.target.value)}
                        />

                    </Grid>
                    <Grid item md={2}>
                        <Select
                            label="Result"
                            fullWidth
                            variant="standard"
                            value={editableTestCase?.definition.expectation.result || ""}
                            onChange={(e) => updateField("definition", {
                                ...editableTestCase?.definition,
                                expectation: {
                                    ...editableTestCase?.definition.expectation,
                                    result: e.target.value as SpecTestCaseStatus
                                }
                            })}
                        >
                            <MenuItem value={SpecTestCaseStatus.SUCCESS}>Success</MenuItem>
                            <MenuItem value={SpecTestCaseStatus.FAILURE}>Failure</MenuItem>
                        </Select>
                    </Grid>

                </Grid>

            </Grid>
            <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={{ padding: 2 }}>
                    <Stack spacing={2}>
                        <Typography variant="h6">Input</Typography>
                        <Editor
                            height="200px"
                            language={context.spec?.definition?.input_rule?.content_type}
                            value={editableTestCase?.definition.input.body || ""}
                            onChange={(value) => {
                                updateField("definition", {
                                    ...editableTestCase?.definition,
                                    input: {
                                        ...editableTestCase?.definition.input,
                                        body: value
                                    }
                                })
                            }}
                        />
                    </Stack>
                </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={{ padding: 2 }}>
                    <Stack spacing={2}>
                        <Typography variant="h6">Expectation</Typography>
                        <Editor
                            height="200px"
                            language={context.spec?.definition?.output_rule?.content_type}
                            value={editableTestCase?.definition.expectation.body || ""}
                            onChange={(value) => {
                                updateField("definition", {
                                    ...editableTestCase?.definition,
                                    expectation: {
                                        ...editableTestCase?.definition.expectation,
                                        body: value
                                    }
                                })
                            }}
                        />
                    </Stack>
                </Paper>
            </Grid>

            {editableTestCase?.last_execution ?
                <Grid item xs={12}>
                    <SpecTestCaseExecution last_execution={editableTestCase.last_execution} />
                </Grid>

                : null}


            {/* Actions */}
            <Grid item xs={12}>
                {props.testCaseId === undefined ?
                    <Button variant="contained" color="primary" onClick={handleCreate}>
                        Create
                    </Button>
                    :
                    <Grid container spacing={2}>
                        <Grid item>
                            <Button variant="contained" color="primary" onClick={handleUpdate}>
                                Save
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" color="error" onClick={handleDelete}>
                                Delete
                            </Button>
                        </Grid>
                    </Grid>
                }
            </Grid>
        </Grid>
    </Drawer>
}