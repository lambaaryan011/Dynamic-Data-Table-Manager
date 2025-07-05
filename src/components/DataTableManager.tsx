import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow as MuiTableRow,
  TablePagination,
  TextField,
  InputAdornment,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Checkbox,
  TableSortLabel,
  Chip,
  Stack,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Search,
  Upload,
  Download,
  Settings,
  Edit,
  Delete,
  Add,
  DarkMode,
  LightMode,
} from '@mui/icons-material';
import { Fab } from '@mui/material';
import { RootState } from '../store';
import {
  setSearchTerm,
  setSortConfig,
  setCurrentPage,
  setRowsPerPage,
  setSelectedRows,
  setEditingRowId,
  deleteRow,
  toggleTheme,
  SortConfig,
  TableRow,
} from '../store/slices/dataTableSlice';
import ColumnManagerModal from './ColumnManagerModal';
import ImportExportManager from './ImportExportManager';
import EditRowDialog from './EditRowDialog';
import DeleteConfirmDialog from './DeleteConfirmDialog';

const DataTableManager: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  
  const {
    data,
    columns,
    searchTerm,
    sortConfig,
    currentPage,
    rowsPerPage,
    selectedRows,
    editingRowId,
    theme: appTheme,
  } = useSelector((state: RootState) => state.dataTable);

  const [columnModalOpen, setColumnModalOpen] = useState(false);
  const [importExportOpen, setImportExportOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [rowToEdit, setRowToEdit] = useState<TableRow | null>(null);
  const [rowToDelete, setRowToDelete] = useState<string | null>(null);

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = data.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    if (sortConfig) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [data, searchTerm, sortConfig]);

  // Paginated data
  const paginatedData = useMemo(() => {
    const startIndex = currentPage * rowsPerPage;
    return filteredAndSortedData.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredAndSortedData, currentPage, rowsPerPage]);

  // Visible columns
  const visibleColumns = columns.filter(col => col.visible);

  const handleSort = (columnId: string) => {
    const column = columns.find(col => col.id === columnId);
    if (!column?.sortable) return;

    const isCurrentColumn = sortConfig?.key === columnId;
    const newDirection = isCurrentColumn && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    
    dispatch(setSortConfig({ key: columnId, direction: newDirection }));
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = paginatedData.map(row => row.id);
      dispatch(setSelectedRows(newSelected));
    } else {
      dispatch(setSelectedRows([]));
    }
  };

  const handleSelectRow = (id: string) => {
    const selectedIndex = selectedRows.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedRows, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedRows.slice(1));
    } else if (selectedIndex === selectedRows.length - 1) {
      newSelected = newSelected.concat(selectedRows.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedRows.slice(0, selectedIndex),
        selectedRows.slice(selectedIndex + 1),
      );
    }

    dispatch(setSelectedRows(newSelected));
  };

  const handleEditRow = (row: TableRow) => {
    setRowToEdit(row);
    setEditDialogOpen(true);
  };

  const handleDeleteRow = (id: string) => {
    setRowToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleAddNew = () => {
    setRowToEdit(null);
    setEditDialogOpen(true);
  };

  const confirmDelete = () => {
    if (rowToDelete) {
      dispatch(deleteRow(rowToDelete));
      setDeleteDialogOpen(false);
      setRowToDelete(null);
    }
  };

  const isSelected = (id: string) => selectedRows.indexOf(id) !== -1;

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Data Table Manager
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
              Professional data management with advanced features
            </Typography>
          </Box>
          <Box display="flex" gap={1}>
            <IconButton
              color="inherit"
              onClick={() => dispatch(toggleTheme())}
              title="Toggle theme"
            >
              {appTheme === 'light' ? <DarkMode /> : <LightMode />}
            </IconButton>
          </Box>
        </Box>
      </Paper>

      {/* Toolbar */}
      <Paper elevation={1} sx={{ mb: 3 }}>
        <Toolbar>
          <Box display="flex" alignItems="center" gap={2} flex={1}>
            <TextField
              placeholder="Search all fields..."
              value={searchTerm}
              onChange={(e) => dispatch(setSearchTerm(e.target.value))}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 300 }}
            />
            
            <Box display="flex" gap={1}>
              <Button
                variant="outlined"
                startIcon={<Upload />}
                onClick={() => setImportExportOpen(true)}
              >
                Import/Export
              </Button>
              <Button
                variant="outlined"
                startIcon={<Settings />}
                onClick={() => setColumnModalOpen(true)}
              >
                Manage Columns
              </Button>
            </Box>
          </Box>

          {selectedRows.length > 0 && (
            <Box display="flex" alignItems="center" gap={1}>
              <Typography color="primary">
                {selectedRows.length} selected
              </Typography>
              <Button
                color="error"
                startIcon={<Delete />}
                onClick={() => {
                  selectedRows.forEach(id => dispatch(deleteRow(id)));
                  dispatch(setSelectedRows([]));
                }}
              >
                Delete Selected
              </Button>
            </Box>
          )}
        </Toolbar>
      </Paper>

      {/* Data Table */}
      <Paper elevation={1}>
        <TableContainer>
          <Table>
            <TableHead>
              <MuiTableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.05) }}>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={
                      selectedRows.length > 0 && selectedRows.length < paginatedData.length
                    }
                    checked={
                      paginatedData.length > 0 && selectedRows.length === paginatedData.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                {visibleColumns.map((column) => (
                  <TableCell key={column.id} sx={{ fontWeight: 'bold' }}>
                    {column.sortable ? (
                      <TableSortLabel
                        active={sortConfig?.key === column.id}
                        direction={
                          sortConfig?.key === column.id ? sortConfig.direction : 'asc'
                        }
                        onClick={() => handleSort(column.id)}
                      >
                        {column.label}
                      </TableSortLabel>
                    ) : (
                      column.label
                    )}
                  </TableCell>
                ))}
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                  Actions
                </TableCell>
              </MuiTableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((row) => {
                const isItemSelected = isSelected(row.id);
                return (
                  <MuiTableRow
                    key={row.id}
                    hover
                    selected={isItemSelected}
                    sx={{
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.04),
                      },
                    }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        onChange={() => handleSelectRow(row.id)}
                      />
                    </TableCell>
                    {visibleColumns.map((column) => (
                      <TableCell key={column.id}>
                        {column.type === 'email' ? (
                          <Chip
                            label={row[column.id]}
                            variant="outlined"
                            size="small"
                            sx={{ fontFamily: 'monospace' }}
                          />
                        ) : (
                          String(row[column.id] || '')
                        )}
                      </TableCell>
                    ))}
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleEditRow(row)}
                          title="Edit row"
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteRow(row.id)}
                          title="Delete row"
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </MuiTableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={filteredAndSortedData.length}
          page={currentPage}
          onPageChange={(_, newPage) => dispatch(setCurrentPage(newPage))}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => dispatch(setRowsPerPage(parseInt(e.target.value, 10)))}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Paper>

      {/* Modals and Dialogs */}
      <ColumnManagerModal
        open={columnModalOpen}
        onClose={() => setColumnModalOpen(false)}
      />
      
      <ImportExportManager
        open={importExportOpen}
        onClose={() => setImportExportOpen(false)}
      />
      
      <EditRowDialog
        open={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
          setRowToEdit(null);
        }}
        row={rowToEdit}
      />
      
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setRowToDelete(null);
        }}
        onConfirm={confirmDelete}
      />

      {/* Floating Action Button for Adding New Rows */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 1000,
        }}
        onClick={handleAddNew}
      >
        <Add />
      </Fab>
    </Box>
  );
};

export default DataTableManager;