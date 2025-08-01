import { Paper, Typography, Stack, Alert } from "@mui/material";
import { Editor } from "@monaco-editor/react";
import { SpecTestCaseStatus } from "../api/types";
import React from "react";
// @ts-ignore
import { Diff, Hunk, parseDiff } from "react-diff-view";
import "react-diff-view/style/index.css";

interface SpecTestCaseExecutionProps {
  last_execution: any;
}

function getDiff(expected: string, translated: string) {
  // Simple line diff for now
  const oldLines = expected.split("\n");
  const newLines = translated.split("\n");
  let diffText = "";
  for (let i = 0; i < Math.max(oldLines.length, newLines.length); i++) {
    const oldLine = oldLines[i] || "";
    const newLine = newLines[i] || "";
    if (oldLine !== newLine) {
      diffText += `--- expected\n${oldLine}\n+++ translated\n${newLine}\n`;
    }
  }
  // This is a hacky unified diff, for demo purposes
  return `--- expected\n+++ translated\n@@ \n${expected}\n${translated}`;
}

const SpecTestCaseExecution: React.FC<SpecTestCaseExecutionProps> = ({ last_execution }) => {
  const status = last_execution?.status;
  const result = last_execution?.result;
  const hasDiff =
    status === SpecTestCaseStatus.FAILURE &&
    result &&
    typeof result === "object" &&
    "expected" in result &&
    "translated" in result;

  let diffElements = null;
  if (hasDiff) {
    const expected = result.expected || "";
    const translated = result.translated || "";
    const diffText = getDiff(expected, translated);
    const files = parseDiff(diffText);
    diffElements = files.map((file: any) => (
      <Diff key={file.oldPath} viewType="split" diffType={"modify"} hunks={file.hunks}>
        {(hunks: any) => hunks.map((hunk: any) => <Hunk key={hunk.content} hunk={hunk} />)}
      </Diff>
    ));
  }

  return (
    <Paper sx={{ padding: 2 }}>
      <Stack spacing={2}>
        <Typography variant="h6">Last Execution</Typography>
        <Alert severity={status === SpecTestCaseStatus.SUCCESS ? "success" : status === SpecTestCaseStatus.FAILURE ? "error" : "info"}>
          {status}
        </Alert>
        {hasDiff ? (
          <>
            <Typography variant="subtitle1">Diff (Expected vs Translated):</Typography>
            <div>{diffElements}</div>
          </>
        ) : (
          <Editor
            height="200px"
            language="json"
            value={JSON.stringify(last_execution, null, 2) || ""}
            options={{ readOnly: true, wordWrap: "on" }}
          />
        )}
      </Stack>
    </Paper>
  );
};

export default SpecTestCaseExecution; 