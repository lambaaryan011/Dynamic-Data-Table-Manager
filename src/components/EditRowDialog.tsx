import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Alert,
  Stack,
} from '@mui/material';
import { Save, Cancel } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { RootState } from '../store';
import { updateRow, addRow, TableRow } from '../store/slices/dataTableSlice';

interface EditRowDialogProps {
  open: boolean;
  onClose: () => void;
  row: TableRow | null;
}

interface FormData {
  name: string;
  email: string;
  age: number;
  role: string;
  department: string;
  location: string;
}

const EditRowDialog: React.FC<EditRowDialogProps> = ({ open, onClose, row }) => {
  const dispatch = useDispatch();
  const { columns } = useSelector((state: RootState) => state.dataTable);
  const [submitError, setSubmitError] = useState<string>('');

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      age: 25,
      role: '',
      department: '',
      location: '',
    },
  });

  const isEditMode = Boolean(row);

  useEffect(() => {
    if (row) {
      reset({
        name: row.name || '',
        email: row.email || '',
        age: row.age || 25,
        role: row.role || '',
        department: row.department || '',
        location: row.location || '',
      });
    } else {
      reset({
        name: '',
        email: '',
        age: 25,
        role: '',
        department: '',
        location: '',
      });
    }
    setSubmitError('');
  }, [row, reset]);

  const onSubmit = (data: FormData) => {
    try {
      if (isEditMode && row) {
        // Update existing row
        dispatch(updateRow({ id: row.id, data }));
      } else {
        // Add new row
        const newRow: TableRow = {
          id: `new_${Date.now()}`,
          ...data,
        };
        dispatch(addRow(newRow));
      }
      onClose();
    } catch (error) {
      setSubmitError('Failed to save row. Please try again.');
    }
  };

  const handleClose = () => {
    reset();
    setSubmitError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6">
          {isEditMode ? 'Edit Row' : 'Add New Row'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {isEditMode ? 'Update the row information' : 'Enter information for the new row'}
        </Typography>
      </DialogTitle>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          {submitError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {submitError}
            </Alert>
          )}

          <Stack spacing={3}>
            <Box display="flex" gap={2}>
              <Controller
                name="name"
                control={control}
                rules={{
                  required: 'Name is required',
                  minLength: { value: 2, message: 'Name must be at least 2 characters' },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Name"
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    placeholder="Enter full name"
                  />
                )}
              />

              <Controller
                name="email"
                control={control}
                rules={{
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Please enter a valid email address',
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email"
                    type="email"
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    placeholder="user@company.com"
                  />
                )}
              />
            </Box>

            <Box display="flex" gap={2}>
              <Controller
                name="age"
                control={control}
                rules={{
                  required: 'Age is required',
                  min: { value: 18, message: 'Age must be at least 18' },
                  max: { value: 100, message: 'Age must be less than 100' },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Age"
                    type="number"
                    fullWidth
                    error={!!errors.age}
                    helperText={errors.age?.message}
                    placeholder="25"
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                )}
              />

              <Controller
                name="role"
                control={control}
                rules={{
                  required: 'Role is required',
                  minLength: { value: 2, message: 'Role must be at least 2 characters' },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Role"
                    fullWidth
                    error={!!errors.role}
                    helperText={errors.role?.message}
                    placeholder="e.g., Software Engineer"
                  />
                )}
              />
            </Box>

            <Box display="flex" gap={2}>
              <Controller
                name="department"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Department"
                    fullWidth
                    placeholder="e.g., Engineering"
                  />
                )}
              />

              <Controller
                name="location"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Location"
                    fullWidth
                    placeholder="e.g., San Francisco"
                  />
                )}
              />
            </Box>
          </Stack>
        </DialogContent>
        
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={handleClose}
            startIcon={<Cancel />}
            color="inherit"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            startIcon={<Save />}
            variant="contained"
            disabled={!isValid}
          >
            {isEditMode ? 'Update Row' : 'Add Row'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditRowDialog;