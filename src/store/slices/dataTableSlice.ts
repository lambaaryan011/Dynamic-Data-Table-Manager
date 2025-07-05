import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TableRow {
  id: string;
  name: string;
  email: string;
  age: number;
  role: string;
  department?: string;
  location?: string;
  [key: string]: any;
}

export interface Column {
  id: string;
  label: string;
  visible: boolean;
  sortable: boolean;
  type: 'string' | 'number' | 'email';
}

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

interface DataTableState {
  data: TableRow[];
  columns: Column[];
  searchTerm: string;
  sortConfig: SortConfig | null;
  currentPage: number;
  rowsPerPage: number;
  selectedRows: string[];
  editingRowId: string | null;
  theme: 'light' | 'dark';
}

const defaultColumns: Column[] = [
  { id: 'name', label: 'Name', visible: true, sortable: true, type: 'string' },
  { id: 'email', label: 'Email', visible: true, sortable: true, type: 'email' },
  { id: 'age', label: 'Age', visible: true, sortable: true, type: 'number' },
  { id: 'role', label: 'Role', visible: true, sortable: true, type: 'string' },
  { id: 'department', label: 'Department', visible: false, sortable: true, type: 'string' },
  { id: 'location', label: 'Location', visible: false, sortable: true, type: 'string' },
];

const sampleData: TableRow[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@company.com',
    age: 28,
    role: 'Frontend Developer',
    department: 'Engineering',
    location: 'San Francisco',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@company.com',
    age: 32,
    role: 'Product Manager',
    department: 'Product',
    location: 'New York',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob.johnson@company.com',
    age: 45,
    role: 'Senior Engineer',
    department: 'Engineering',
    location: 'Austin',
  },
  {
    id: '4',
    name: 'Alice Brown',
    email: 'alice.brown@company.com',
    age: 29,
    role: 'UX Designer',
    department: 'Design',
    location: 'Seattle',
  },
  {
    id: '5',
    name: 'Charlie Wilson',
    email: 'charlie.wilson@company.com',
    age: 38,
    role: 'DevOps Engineer',
    department: 'Engineering',
    location: 'Portland',
  },
];

const initialState: DataTableState = {
  data: sampleData,
  columns: defaultColumns,
  searchTerm: '',
  sortConfig: null,
  currentPage: 0,
  rowsPerPage: 10,
  selectedRows: [],
  editingRowId: null,
  theme: 'light',
};

const dataTableSlice = createSlice({
  name: 'dataTable',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<TableRow[]>) => {
      state.data = action.payload;
    },
    addRow: (state, action: PayloadAction<TableRow>) => {
      state.data.push(action.payload);
    },
    updateRow: (state, action: PayloadAction<{ id: string; data: Partial<TableRow> }>) => {
      const index = state.data.findIndex(row => row.id === action.payload.id);
      if (index !== -1) {
        state.data[index] = { ...state.data[index], ...action.payload.data };
      }
    },
    deleteRow: (state, action: PayloadAction<string>) => {
      state.data = state.data.filter(row => row.id !== action.payload);
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      state.currentPage = 0; // Reset to first page when searching
    },
    setSortConfig: (state, action: PayloadAction<SortConfig | null>) => {
      state.sortConfig = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setRowsPerPage: (state, action: PayloadAction<number>) => {
      state.rowsPerPage = action.payload;
      state.currentPage = 0; // Reset to first page when changing page size
    },
    toggleColumnVisibility: (state, action: PayloadAction<string>) => {
      const column = state.columns.find(col => col.id === action.payload);
      if (column) {
        column.visible = !column.visible;
      }
    },
    addColumn: (state, action: PayloadAction<Omit<Column, 'visible'>>) => {
      const newColumn: Column = { ...action.payload, visible: true };
      state.columns.push(newColumn);
    },
    setSelectedRows: (state, action: PayloadAction<string[]>) => {
      state.selectedRows = action.payload;
    },
    setEditingRowId: (state, action: PayloadAction<string | null>) => {
      state.editingRowId = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    importData: (state, action: PayloadAction<TableRow[]>) => {
      // Replace existing data with imported data
      state.data = action.payload;
      state.currentPage = 0;
    },
  },
});

export const {
  setData,
  addRow,
  updateRow,
  deleteRow,
  setSearchTerm,
  setSortConfig,
  setCurrentPage,
  setRowsPerPage,
  toggleColumnVisibility,
  addColumn,
  setSelectedRows,
  setEditingRowId,
  toggleTheme,
  importData,
} = dataTableSlice.actions;

export default dataTableSlice.reducer;