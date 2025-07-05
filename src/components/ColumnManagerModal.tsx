import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControlLabel,
  Checkbox,
  TextField,
  MenuItem,
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Stack,
} from '@mui/material';
import { Add, Visibility, VisibilityOff } from '@mui/icons-material';
import { RootState } from '../store';
import { toggleColumnVisibility, addColumn, Column } from '../store/slices/dataTableSlice';

interface ColumnManagerModalProps {
  open: boolean;
  onClose: () => void;
}

const ColumnManagerModal: React.FC<ColumnManagerModalProps> = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const { columns } = useSelector((state: RootState) => state.dataTable);
  
  const [newColumnLabel, setNewColumnLabel] = useState('');
  const [newColumnId, setNewColumnId] = useState('');
  const [newColumnType, setNewColumnType] = useState<'string' | 'number' | 'email'>('string');

  const handleToggleColumn = (columnId: string) => {
    dispatch(toggleColumnVisibility(columnId));
  };

  const handleAddColumn = () => {
    if (!newColumnLabel.trim() || !newColumnId.trim()) return;

    const newColumn: Omit<Column, 'visible'> = {
      id: newColumnId.toLowerCase().replace(/\s+/g, '_'),
      label: newColumnLabel,
      sortable: true,
      type: newColumnType,
    };

    dispatch(addColumn(newColumn));
    setNewColumnLabel('');
    setNewColumnId('');
    setNewColumnType('string');
  };

  const visibleColumns = columns.filter(col => col.visible);
  const hiddenColumns = columns.filter(col => !col.visible);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6">Manage Columns</Typography>
        <Typography variant="body2" color="text.secondary">
          Show/hide columns and add new custom fields
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Visibility color="primary" />
            Visible Columns ({visibleColumns.length})
          </Typography>
          <List dense>
            {visibleColumns.map((column) => (
              <ListItem key={column.id} divider>
                <ListItemIcon>
                  <Checkbox
                    checked={true}
                    onChange={() => handleToggleColumn(column.id)}
                    color="primary"
                  />
                </ListItemIcon>
                <ListItemText 
                  primary={column.label}
                  secondary={`Type: ${column.type} • Sortable: ${column.sortable ? 'Yes' : 'No'}`}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={() => handleToggleColumn(column.id)}
                    title="Hide column"
                  >
                    <VisibilityOff />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Box>

        {hiddenColumns.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <VisibilityOff color="action" />
              Hidden Columns ({hiddenColumns.length})
            </Typography>
            <List dense>
              {hiddenColumns.map((column) => (
                <ListItem key={column.id} divider>
                  <ListItemIcon>
                    <Checkbox
                      checked={false}
                      onChange={() => handleToggleColumn(column.id)}
                      color="primary"
                    />
                  </ListItemIcon>
                  <ListItemText 
                    primary={column.label}
                    secondary={`Type: ${column.type} • Sortable: ${column.sortable ? 'Yes' : 'No'}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => handleToggleColumn(column.id)}
                      title="Show column"
                    >
                      <Visibility />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        <Divider sx={{ my: 3 }} />

        <Box>
          <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Add color="primary" />
            Add New Column
          </Typography>
          <Stack spacing={2}>
            <TextField
              label="Column Label"
              value={newColumnLabel}
              onChange={(e) => {
                setNewColumnLabel(e.target.value);
                setNewColumnId(e.target.value.toLowerCase().replace(/\s+/g, '_'));
              }}
              fullWidth
              placeholder="e.g., Department"
            />
            <TextField
              label="Column ID"
              value={newColumnId}
              onChange={(e) => setNewColumnId(e.target.value)}
              fullWidth
              placeholder="e.g., department"
              helperText="Used internally, will be auto-generated from label"
            />
            <TextField
              select
              label="Data Type"
              value={newColumnType}
              onChange={(e) => setNewColumnType(e.target.value as 'string' | 'number' | 'email')}
              fullWidth
            >
              <MenuItem value="string">Text</MenuItem>
              <MenuItem value="number">Number</MenuItem>
              <MenuItem value="email">Email</MenuItem>
            </TextField>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddColumn}
              disabled={!newColumnLabel.trim() || !newColumnId.trim()}
              fullWidth
            >
              Add Column
            </Button>
          </Stack>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>Done</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ColumnManagerModal;