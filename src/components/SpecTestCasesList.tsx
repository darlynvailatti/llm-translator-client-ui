import { SpecTestCaseStatus } from "../api/types"
import {Box, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import { useSpecDetail } from "../pages/SpecDetailContext"

export interface SpecTestCasesListProps {
    specId: string
    onSelectTestCase: (testCaseId: string) => void
}


export default function SpecTestCasesList(props: SpecTestCasesListProps) {

    const context = useSpecDetail()

    return (
        <Box>
            {context.testCases?.length === 0 && <Box
                sx={{ height: 50 }} alignContent={"center"} justifyItems={"center"}>
                <Typography variant="caption">No test cases have been created...</Typography>
            </Box>
            }

            {
                context.testCases && context.testCases?.length > 0 &&
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {context.testCases?.map((testCase) => (
                                <TableRow
                                    key={testCase.name}
                                    onClick={() => props.onSelectTestCase(testCase.uuid)}
                                    hover
                                >
                                    <TableCell>{testCase.name}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={testCase.status}
                                            color={testCase.status === SpecTestCaseStatus.SUCCESS ? "success" : "error"}/>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                </TableContainer>

            }

        </Box>
    )
}