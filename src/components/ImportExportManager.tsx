import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert,
  LinearProgress,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
} from '@mui/material';
import {
  Upload,
  Download,
  CloudUpload,
  GetApp,
  Warning,
  CheckCircle,
  Error as ErrorIcon,
} from '@mui/icons-material';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import { RootState } from '../store';
import { importData, TableRow } from '../store/slices/dataTableSlice';

interface ImportExportManagerProps {
  open: boolean;
  onClose: () => void;
}

const ImportExportManager: React.FC<ImportExportManagerProps> = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const { data, columns } = useSelector((state: RootState) => state.dataTable);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [importing, setImporting] = useState(false);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [importSuccess, setImportSuccess] = useState(false);

  const visibleColumns = columns.filter(col => col.visible);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setImportErrors([]);
    setImportSuccess(false);

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        try {
          const errors: string[] = [];
          const validRows: TableRow[] = [];

          results.data.forEach((row: any, index: number) => {
            // Validate required fields
            if (!row.name || !row.email) {
              errors.push(`Row ${index + 1}: Missing required fields (name, email)`);
              return;
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(row.email)) {
              errors.push(`Row ${index + 1}: Invalid email format`);
              return;
            }

            // Validate age is a number
            const age = parseInt(row.age);
            if (isNaN(age) || age < 0 || age > 120) {
              errors.push(`Row ${index + 1}: Invalid age (must be a number between 0-120)`);
              return;
            }

            // Create valid row
            const validRow: TableRow = {
              id: `imported_${Date.now()}_${index}`,
              name: row.name.trim(),
              email: row.email.trim().toLowerCase(),
              age: age,
              role: row.role?.trim() || 'Not specified',
              department: row.department?.trim() || '',
              location: row.location?.trim() || '',
            };

            validRows.push(validRow);
          });

          if (errors.length > 0) {
            setImportErrors(errors);
          } else {
            dispatch(importData(validRows));
            setImportSuccess(true);
          }
        } catch (error) {
          setImportErrors(['Failed to parse CSV file. Please check the format.']);
        } finally {
          setImporting(false);
        }
      },
      error: (error) => {
        setImportErrors([`CSV parsing error: ${error.message}`]);
        setImporting(false);
      },
    });

    // Reset file input
    event.target.value = '';
  };

  const handleExportCSV = () => {
    // Create CSV data with only visible columns
    const csvData = data.map(row => {
      const exportRow: any = {};
      visibleColumns.forEach(column => {
        exportRow[column.label] = row[column.id] || '';
      });
      return exportRow;
    });

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const fileName = `data_export_${new Date().toISOString().split('T')[0]}.csv`;
    saveAs(blob, fileName);
  };

  const downloadSampleCSV = () => {
    const sampleData = [
      {
        Name: 'John Doe',
        Email: 'john.doe@example.com',
        Age: 30,
        Role: 'Software Engineer',
        Department: 'Engineering',
        Location: 'San Francisco',
      },
      {
        Name: 'Jane Smith',
        Email: 'jane.smith@example.com',
        Age: 28,
        Role: 'Product Manager',
        Department: 'Product',
        Location: 'New York',
      },
    ];

    const csv = Papa.unparse(sampleData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'sample_import.csv');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6">Import & Export Data</Typography>
        <Typography variant="body2" color="text.secondary">
          Import CSV files or export current data
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <Stack spacing={3}>
          {/* Import Section */}
          <Paper elevation={1} sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Upload color="primary" />
              <Typography variant="h6">Import CSV Data</Typography>
            </Box>
            
            <Typography variant="body2" color="text.secondary" paragraph>
              Upload a CSV file to import data. Required columns: Name, Email, Age, Role.
              Optional: Department, Location.
            </Typography>

            <Stack spacing={2}>
              <Box display="flex" gap={2}>
                <Button
                  variant="contained"
                  startIcon={<CloudUpload />}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={importing}
                >
                  {importing ? 'Importing...' : 'Choose CSV File'}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  onClick={downloadSampleCSV}
                >
                  Download Sample
                </Button>
              </Box>

              {importing && <LinearProgress />}

              {importSuccess && (
                <Alert severity="success" icon={<CheckCircle />}>
                  Data imported successfully! {data.length} rows loaded.
                </Alert>
              )}

              {importErrors.length > 0 && (
                <Alert severity="error" icon={<ErrorIcon />}>
                  <Typography variant="subtitle2" gutterBottom>
                    Import failed with {importErrors.length} errors:
                  </Typography>
                  <List dense>
                    {importErrors.slice(0, 5).map((error, index) => (
                      <ListItem key={index} sx={{ py: 0 }}>
                        <ListItemIcon sx={{ minWidth: 20 }}>
                          <Warning fontSize="small" color="error" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={error}
                          sx={{ '& .MuiListItemText-primary': { fontSize: '0.875rem' } }}
                        />
                      </ListItem>
                    ))}
                    {importErrors.length > 5 && (
                      <Typography variant="caption" color="text.secondary">
                        ... and {importErrors.length - 5} more errors
                      </Typography>
                    )}
                  </List>
                </Alert>
              )}
            </Stack>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".csv"
              style={{ display: 'none' }}
            />
          </Paper>

          <Divider />

          {/* Export Section */}
          <Paper elevation={1} sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <GetApp color="primary" />
              <Typography variant="h6">Export Current Data</Typography>
            </Box>
            
            <Typography variant="body2" color="text.secondary" paragraph>
              Export the current table data as CSV. Only visible columns will be included.
            </Typography>

            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="body2">
                  <strong>{data.length}</strong> rows × <strong>{visibleColumns.length}</strong> columns
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Visible columns: {visibleColumns.map(col => col.label).join(', ')}
                </Typography>
              </Box>
              
              <Button
                variant="contained"
                startIcon={<Download />}
                onClick={handleExportCSV}
                disabled={data.length === 0}
              >
                Export CSV
              </Button>
            </Box>
          </Paper>
        </Stack>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImportExportManager;