import { Paper, Typography, Stack, Alert, Box } from "@mui/material";
import { Editor } from "@monaco-editor/react";
import { SpecTestCaseStatus } from "../api/types";
import React from "react";

interface SpecTestCaseExecutionProps {
  last_execution: any;
}

// Custom diff component with GitHub-like highlighting
interface DiffLine {
  type: 'added' | 'removed' | 'unchanged';
  content: string;
  lineNumber?: number;
}

interface DiffViewerProps {
  oldValue: string;
  newValue: string;
}

const DiffViewer: React.FC<DiffViewerProps> = ({ oldValue, newValue }) => {
  const generateDiff = (oldStr: string, newStr: string): DiffLine[] => {
    const oldLines = oldStr.split('\n');
    const newLines = newStr.split('\n');
    const diff: DiffLine[] = [];
    
    let i = 0, j = 0;
    
    while (i < oldLines.length || j < newLines.length) {
      const oldLine = oldLines[i] || '';
      const newLine = newLines[j] || '';
      
      if (oldLine === newLine) {
        diff.push({ type: 'unchanged', content: oldLine, lineNumber: i + 1 });
        i++;
        j++;
      } else {
        // Check if this is a deletion
        if (i < oldLines.length && !newLines.includes(oldLine)) {
          diff.push({ type: 'removed', content: oldLine, lineNumber: i + 1 });
          i++;
        }
        // Check if this is an addition
        else if (j < newLines.length && !oldLines.includes(newLine)) {
          diff.push({ type: 'added', content: newLine, lineNumber: j + 1 });
          j++;
        } else {
          // Handle modified lines
          diff.push({ type: 'removed', content: oldLine, lineNumber: i + 1 });
          diff.push({ type: 'added', content: newLine, lineNumber: j + 1 });
          i++;
          j++;
        }
      }
    }
    
    return diff;
  };

  const diffLines = generateDiff(oldValue, newValue);

  return (
    <Box sx={{ 
      border: '1px solid #424242', 
      borderRadius: '6px', 
      overflow: 'hidden',
      fontFamily: 'monospace',
      fontSize: '12px',
      lineHeight: '1.5',
      backgroundColor: '#1e1e1e'
    }}>
      {diffLines.map((line, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            backgroundColor: line.type === 'added' ? '#0d1117' : 
                           line.type === 'removed' ? '#67060c' : 
                           '#1e1e1e',
            borderBottom: '1px solid #424242',
            '&:last-child': { borderBottom: 'none' }
          }}
        >
          <Box
            sx={{
              width: '50px',
              padding: '8px 12px',
              textAlign: 'right',
              color: '#8b949e',
              backgroundColor: '#0d1117',
              borderRight: '1px solid #424242',
              userSelect: 'none'
            }}
          >
            {line.type === 'removed' ? line.lineNumber : ''}
          </Box>
          <Box
            sx={{
              width: '50px',
              padding: '8px 12px',
              textAlign: 'right',
              color: '#8b949e',
              backgroundColor: '#0d1117',
              borderRight: '1px solid #424242',
              userSelect: 'none'
            }}
          >
            {line.type === 'added' ? line.lineNumber : ''}
          </Box>
          <Box
            sx={{
              flex: 1,
              padding: '8px 12px',
              color: line.type === 'added' ? '#7ee787' : 
                     line.type === 'removed' ? '#f85149' : 
                     '#c9d1d9',
              backgroundColor: line.type === 'added' ? '#0d1117' : 
                             line.type === 'removed' ? '#67060c' : 
                             '#1e1e1e',
              position: 'relative',
              '&::before': line.type === 'added' ? {
                content: '""',
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: '4px',
                backgroundColor: '#238636'
              } : line.type === 'removed' ? {
                content: '""',
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: '4px',
                backgroundColor: '#da3633'
              } : {}
            }}
          >
            <span style={{ 
              color: line.type === 'added' ? '#7ee787' : 
                     line.type === 'removed' ? '#f85149' : 
                     '#c9d1d9'
            }}>
              {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
            </span>
            {line.content}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

// Helper function to format JSON for better readability
function formatJSON(obj: any): string {
  try {
    return JSON.stringify(obj, null, 2);
  } catch {
    return String(obj);
  }
}

const SpecTestCaseExecution: React.FC<SpecTestCaseExecutionProps> = ({ last_execution }) => {
  const status = last_execution?.status;
  const result = last_execution?.result;
  
  // Check if this is a failed test case with translated and expectation fields
  const hasPayloadDiff = 
    status === SpecTestCaseStatus.FAILURE &&
    result &&
    typeof result === "object" &&
    "translated" in result &&
    "expectation" in result;

  return (
    <Paper sx={{ padding: 2 }}>
      <Stack spacing={2}>
        <Typography variant="h6">Last Execution</Typography>
        <Alert severity={status === SpecTestCaseStatus.SUCCESS ? "success" : status === SpecTestCaseStatus.FAILURE ? "error" : "info"}>
          {status}
        </Alert>
        
        {hasPayloadDiff ? (
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Payload Diff (Expected vs Translated):
            </Typography>
            <DiffViewer 
              oldValue={result.expectation.body || ""}
              newValue={result.translated.body || ""}
            />
          </Box>
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