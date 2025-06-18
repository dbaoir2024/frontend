// Enhanced React component for Document Management
// src/components/documents/DocumentManager.tsx

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Visibility as VisibilityIcon,
  GetApp as DownloadIcon,
  Delete as DeleteIcon,
  History as HistoryIcon,
  InsertDriveFile as FileIcon,
  PictureAsPdf as PdfIcon,
  Description as DocIcon,
  TableChart as ExcelIcon,
  Image as ImageIcon,
  Folder as FolderIcon,
  Upload as UploadIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import { RootState } from '../../app/store';
import { formatDate, formatFileSize } from '../../utils/formatUtils';
import FileDropzone from '../common/FileDropzone';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`document-tabpanel-${index}`}
      aria-labelledby={`document-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const DocumentManager: React.FC = () => {
  const dispatch = useDispatch();
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [dateRangeStart, setDateRangeStart] = useState<Date | null>(null);
  const [dateRangeEnd, setDateRangeEnd] = useState<Date | null>(null);
  
  const [selectedOrganization, setSelectedOrganization] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [openVersionDialog, setOpenVersionDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  
  // Mock data for demonstration
  const documentCategories = [
    { id: 'GEN', name: 'General Matters', code: '0' },
    { id: 'APP', name: 'Application For Registration', code: '1' },
    { id: 'CERT', name: 'Registration Certificate', code: '2' },
    { id: 'RULES', name: 'Rules and Constitution', code: '3' },
    { id: 'MEM', name: 'Financial Membership List', code: '4' },
    { id: 'ELECT', name: 'Election of Office Bearers', code: '5' },
    { id: 'BALLOT', name: 'Secret Ballots', code: '6' },
    { id: 'FIN', name: 'Financial Returns', code: '7' },
    { id: 'INSP', name: 'Inspection Reports', code: '9' },
    { id: 'GS', name: 'General Secretary Appointments', code: '10' },
    { id: 'WELF', name: 'Welfare Funds', code: '11' }
  ];
  
  const mockOrganizations = [
    { id: 1, registration_number: 'IO-101', organization_name: 'National Academic Staff Association of the University of PNG' },
    { id: 2, registration_number: 'IO-102', organization_name: 'PNG Teachers Association' },
    { id: 3, registration_number: 'IO-142', organization_name: 'PNG Maritime Workers Industrial Union' }
  ];
  
  const mockDocuments = [
    {
      id: 1,
      organization_id: 3,
      category_id: 'RULES',
      document_number: 'IO-142-3',
      file_name: 'constitution_2023.pdf',
      file_path: '/data/unions/IO-142/3_Rules_and_Constitution/constitution_2023.pdf',
      file_type: 'application/pdf',
      file_size: 2457600,
      description: 'Updated constitution approved in 2023',
      upload_date: '2023-05-15T10:30:00Z',
      version: 2,
      status: 'active'
    },
    {
      id: 2,
      organization_id: 3,
      category_id: 'MEM',
      document_number: 'IO-142-4',
      file_name: 'membership_list_2025.xlsx',
      file_path: '/data/unions/IO-142/4_Financial_Membership_List/membership_list_2025.xlsx',
      file_type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      file_size: 1548800,
      description: 'Current financial membership list for 2025',
      upload_date: '2025-01-10T14:45:00Z',
      version: 1,
      status: 'active'
    },
    {
      id: 3,
      organization_id: 3,
      category_id: 'ELECT',
      document_number: 'IO-142-5',
      file_name: 'election_results_2024.pdf',
      file_path: '/data/unions/IO-142/5_Election_of_Office_Bearers/election_results_2024.pdf',
      file_type: 'application/pdf',
      file_size: 1024000,
      description: 'Results of the 2024 executive election',
      upload_date: '2024-06-22T09:15:00Z',
      version: 1,
      status: 'active'
    },
    {
      id: 4,
      organization_id: 3,
      category_id: 'FIN',
      document_number: 'IO-142-7',
      file_name: 'financial_return_2024.pdf',
      file_path: '/data/unions/IO-142/7_Financial_Returns/financial_return_2024.pdf',
      file_type: 'application/pdf',
      file_size: 3145728,
      description: 'Annual financial return for 2024',
      upload_date: '2025-02-28T16:20:00Z',
      version: 1,
      status: 'active'
    },
    {
      id: 5,
      organization_id: 3,
      category_id: 'INSP',
      document_number: 'IO-142-9',
      file_name: 'inspection_report_2025.pdf',
      file_path: '/data/unions/IO-142/9_Inspection_Reports/inspection_report_2025.pdf',
      file_type: 'application/pdf',
      file_size: 2097152,
      description: 'OIR inspection report from March 2025',
      upload_date: '2025-03-15T11:10:00Z',
      version: 1,
      status: 'active'
    }
  ];
  
  const mockVersions = [
    {
      id: 1,
      document_id: 1,
      version: 1,
      file_path: '/data/unions/IO-142/3_Rules_and_Constitution/constitution_2020.pdf',
      file_size: 2097152,
      modification_date: '2020-06-10T09:30:00Z',
      change_notes: 'Initial upload of constitution'
    },
    {
      id: 2,
      document_id: 1,
      version: 2,
      file_path: '/data/unions/IO-142/3_Rules_and_Constitution/constitution_2023.pdf',
      file_size: 2457600,
      modification_date: '2023-05-15T10:30:00Z',
      change_notes: 'Updated with amendments approved at 2023 AGM'
    }
  ];

  useEffect(() => {
    // In a real application, this would fetch documents based on filters
    // For now, we're using mock data
    setSelectedOrganization(mockOrganizations[2]); // Default to IO-142
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleCategoryFilterChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setCategoryFilter(event.target.value as string);
  };

  const handleOpenUploadDialog = (category: string) => {
    setSelectedCategory(category);
    setOpenUploadDialog(true);
  };

  const handleCloseUploadDialog = () => {
    setOpenUploadDialog(false);
    setSelectedCategory('');
  };

  const handleViewVersions = (document: any) => {
    setSelectedDocument(document);
    setOpenVersionDialog(true);
  };

  const handleCloseVersionDialog = () => {
    setOpenVersionDialog(false);
    setSelectedDocument(null);
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) {
      return <PdfIcon color="error" />;
    } else if (fileType.includes('word') || fileType.includes('document')) {
      return <DocIcon color="primary" />;
    } else if (fileType.includes('sheet') || fileType.includes('excel') || fileType.includes('csv')) {
      return <ExcelIcon color="success" />;
    } else if (fileType.includes('image')) {
      return <ImageIcon color="secondary" />;
    } else {
      return <FileIcon />;
    }
  };

  const getFilteredDocuments = () => {
    if (!selectedOrganization) return [];
    
    let filtered = mockDocuments.filter(doc => doc.organization_id === selectedOrganization.id);
    
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(doc => doc.category_id === categoryFilter);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(doc => 
        doc.file_name.toLowerCase().includes(query) || 
        doc.description.toLowerCase().includes(query) ||
        doc.document_number.toLowerCase().includes(query)
      );
    }
    
    if (dateRangeStart) {
      filtered = filtered.filter(doc => new Date(doc.upload_date) >= dateRangeStart);
    }
    
    if (dateRangeEnd) {
      filtered = filtered.filter(doc => new Date(doc.upload_date) <= dateRangeEnd);
    }
    
    return filtered;
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Union Document Management</Typography>
        <FormControl sx={{ minWidth: 300 }}>
          <InputLabel>Select Union</InputLabel>
          <Select
            value={selectedOrganization ? selectedOrganization.id : ''}
            onChange={(e) => {
              const orgId = e.target.value as number;
              const org = mockOrganizations.find(o => o.id === orgId);
              setSelectedOrganization(org);
            }}
            label="Select Union"
          >
            {mockOrganizations.map(org => (
              <MenuItem key={org.id} value={org.id}>
                {org.registration_number} - {org.organization_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      
      {selectedOrganization && (
        <>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="document tabs" variant="scrollable" scrollButtons="auto">
              <Tab label="All Documents" />
              <Tab label="Document Explorer" />
              <Tab label="Recent Uploads" />
              <Tab label="Document Statistics" />
            </Tabs>
          </Box>
          
          <Box sx={{ mb: 3, mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={5}>
                <TextField
                  fullWidth
                  label="Search Documents"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search by file name, document number, or description..."
                  InputProps={{
                    startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={categoryFilter}
                    onChange={handleCategoryFilterChange}
                    label="Category"
                  >
                    <MenuItem value="all">All Categories</MenuItem>
                    {documentCategories.map(category => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <DatePicker
                  label="From Date"
                  value={dateRangeStart}
                  onChange={(date) => setDateRangeStart(date)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: 'small'
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <DatePicker
                  label="To Date"
                  value={dateRangeEnd}
                  onChange={(date) => setDateRangeEnd(date)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: 'small'
                    }
                  }}
                />
              </Grid>
            </Grid>
          </Box>
          
          <TabPanel value={tabValue} index={0}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Document Number</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>File Name</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Size</TableCell>
                    <TableCell>Upload Date</TableCell>
                    <TableCell>Version</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getFilteredDocuments().map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>{doc.document_number}</TableCell>
                      <TableCell>
                        {documentCategories.find(c => c.id === doc.category_id)?.name || doc.category_id}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {getFileIcon(doc.file_type)}
                          <Typography sx={{ ml: 1 }}>{doc.file_name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{doc.description}</TableCell>
                      <TableCell>{formatFileSize(doc.file_size)}</TableCell>
                      <TableCell>{new Date(doc.upload_date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Chip 
                          label={`v${doc.version}`} 
                          size="small" 
                          color={doc.version > 1 ? "primary" : "default"}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton size="small" title="View Document">
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" title="Download">
                          <DownloadIcon fontSize="small" />
                        </IconButton>
                        {doc.version > 1 && (
                          <IconButton 
                            size="small" 
                            title="View Version History"
                            onClick={() => handleViewVersions(doc)}
                          >
                            <HistoryIcon fontSize="small" />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={3}>
              {documentCategories.map((category) => (
                <Grid item xs={12} md={4} key={category.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">{category.name}</Typography>
                        <Chip 
                          label={`${mockDocuments.filter(d => d.category_id === category.id && d.organization_id === selectedOrganization.id).length} files`} 
                          size="small" 
                          color="primary"
                        />
                      </Box>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        Document Number: {selectedOrganization.registration_number}-{category.code}
                      </Typography>
                      <List dense>
                        {mockDocuments
                          .filter(d => d.category_id === category.id && d.organization_id === selectedOrganization.id)
                          .slice(0, 3)
                          .map((doc) => (
                            <ListItem key={doc.id}>
                              <ListItemIcon>
                                {getFileIcon(doc.file_type)}
                              </ListItemIcon>
                              <ListItemText 
                                primary={doc.file_name} 
                                secondary={`${new Date(doc.upload_date).toLocaleDateString()} • ${formatFileSize(doc.file_size)}`} 
                              />
                              <ListItemSecondaryAction>
                                <IconButton edge="end" size="small">
                                  <VisibilityIcon fontSize="small" />
                                </IconButton>
                              </ListItemSecondaryAction>
                            </ListItem>
                          ))}
                      </List>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                        <Button 
                          size="small" 
                          variant="outlined"
                          disabled={mockDocuments.filter(d => d.category_id === category.id && d.organization_id === selectedOrganization.id).length === 0}
                        >
                          View All
                        </Button>
                        <Button 
                          size="small" 
                          variant="contained" 
                          startIcon={<UploadIcon />}
                          onClick={() => handleOpenUploadDialog(category.id)}
                        >
                          Upload
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </TabPanel>
          
          <TabPanel value={tabValue} index={2}>
            <Typography variant="h6" gutterBottom>Recent Document Uploads</Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Document Number</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>File Name</TableCell>
                    <TableCell>Upload Date</TableCell>
                    <TableCell>Size</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mockDocuments
                    .filter(doc => doc.organization_id === selectedOrganization.id)
                    .sort((a, b) => new Date(b.upload_date).getTime() - new Date(a.upload_date).getTime())
                    .slice(0, 10)
                    .map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell>{doc.document_number}</TableCell>
                        <TableCell>
                          {documentCategories.find(c => c.id === doc.category_id)?.name || doc.category_id}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {getFileIcon(doc.file_type)}
                            <Typography sx={{ ml: 1 }}>{doc.file_name}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{new Date(doc.upload_date).toLocaleString()}</TableCell>
                        <TableCell>{formatFileSize(doc.file_size)}</TableCell>
                        <TableCell align="center">
                          <IconButton size="small" title="View Document">
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" title="Download">
                            <DownloadIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
          
          <TabPanel value={tabValue} index={3}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Document Count by Category</Typography>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Category</TableCell>
                            <TableCell align="right">Document Count</TableCell>
                            <TableCell align="right">Total Size</TableCell>
                            <TableCell align="right">Last Updated</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {documentCategories.map((category) => {
                            const docs = mockDocuments.filter(d => d.category_id === category.id && d.organization_id === selectedOrganization.id);
                            const totalSize = docs.reduce((sum, doc) => sum + doc.file_size, 0);
                            const lastUpdated = docs.length > 0 
                              ? new Date(Math.max(...docs.map(d => new Date(d.upload_date).getTime()))).toLocaleDateString()
                              : 'N/A';
                            
                            return (
                              <TableRow key={category.id}>
                                <TableCell>{category.name}</TableCell>
                                <TableCell align="right">{docs.length}</TableCell>
                                <TableCell align="right">{formatFileSize(totalSize)}</TableCell>
                                <TableCell align="right">{lastUpdated}</TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Document Storage Summary</Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body1">
                        <strong>Total Documents:</strong> {mockDocuments.filter(d => d.organization_id === selectedOrganization.id).length}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Total Storage Used:</strong> {formatFileSize(mockDocuments.filter(d => d.organization_id === selectedOrganization.id).reduce((sum, doc) => sum + doc.file_size, 0))}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Document Categories Used:</strong> {new Set(mockDocuments.filter(d => d.organization_id === selectedOrganization.id).map(d => d.category_id)).size} of {documentCategories.length}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Most Recent Upload:</strong> {
                          mockDocuments.filter(d => d.organization_id === selectedOrganization.id).length > 0 
                            ? new Date(Math.max(...mockDocuments.filter(d => d.organization_id === selectedOrganization.id).map(d => new Date(d.upload_date).getTime()))).toLocaleString()
                            : 'N/A'
                        }
                      </Typography>
                      <Typography variant="body1">
                        <strong>Average File Size:</strong> {
                          mockDocuments.filter(d => d.organization_id === selectedOrganization.id).length > 0 
                            ? formatFileSize(mockDocuments.filter(d => d.organization_id === selectedOrganization.id).reduce((sum, doc) => sum + doc.file_size, 0) / mockDocuments.filter(d => d.organization_id === selectedOrganization.id).length)
                            : 'N/A'
                        }
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>
        </>
      )}
      
      {/* Upload Document Dialog */}
      <Dialog open={openUploadDialog} onClose={handleCloseUploadDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Upload Document - {documentCategories.find(c => c.id === selectedCategory)?.name || ''}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Document Number: {selectedOrganization ? `${selectedOrganization.registration_number}-${documentCategories.find(c => c.id === selectedCategory)?.code || ''}` : ''}
            </Typography>
            
            <TextField
              fullWidth
              label="Document Description"
              placeholder="Enter a description for this document"
              margin="normal"
            />
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" gutterBottom>Upload File</Typography>
              <FileDropzone
                accept={{
                  'application/pdf': ['.pdf'],
                  'application/msword': ['.doc'],
                  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
                  'application/vnd.ms-excel': ['.xls'],
                  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
                  'image/jpeg': ['.jpg', '.jpeg'],
                  'image/png': ['.png']
                }}
                maxFiles={1}
                maxSize={20971520} // 20MB
              />
            </Box>
            
            <FormControl fullWidth margin="normal">
              <InputLabel>Version Type</InputLabel>
              <Select
                label="Version Type"
                defaultValue="new"
              >
                <MenuItem value="new">New Document</MenuItem>
                <MenuItem value="update">Update Existing Document</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="Version Notes"
              placeholder="Enter notes about this version (changes made, reason for update, etc.)"
              margin="normal"
              multiline
              rows={3}
            />
            
            <FormControl fullWidth margin="normal">
              <InputLabel>Confidentiality</InputLabel>
              <Select
                label="Confidentiality"
                defaultValue="standard"
              >
                <MenuItem value="standard">Standard</MenuItem>
                <MenuItem value="confidential">Confidential</MenuItem>
                <MenuItem value="restricted">Restricted Access</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUploadDialog}>Cancel</Button>
          <Button 
            variant="contained" 
            color="primary"
          >
            Upload Document
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Version History Dialog */}
      <Dialog open={openVersionDialog} onClose={handleCloseVersionDialog} maxWidth="md" fullWidth>
        {selectedDocument && (
          <>
            <DialogTitle>
              Version History - {selectedDocument.file_name}
            </DialogTitle>
            <DialogContent>
              <Typography variant="subtitle2" gutterBottom>
                Document Number: {selectedDocument.document_number}
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                {selectedDocument.description}
              </Typography>
              
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Version</TableCell>
                      <TableCell>Date Modified</TableCell>
                      <TableCell>File Size</TableCell>
                      <TableCell>Change Notes</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockVersions
                      .filter(v => v.document_id === selectedDocument.id)
                      .sort((a, b) => b.version - a.version)
                      .map((version) => (
                        <TableRow key={version.id}>
                          <TableCell>
                            <Chip 
                              label={`v${version.version}`} 
                              size="small" 
                              color={version.version === selectedDocument.version ? "primary" : "default"}
                            />
                            {version.version === selectedDocument.version && (
                              <Typography variant="caption" color="primary" sx={{ ml: 1 }}>
                                (Current)
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>{new Date(version.modification_date).toLocaleString()}</TableCell>
                          <TableCell>{formatFileSize(version.file_size)}</TableCell>
                          <TableCell>{version.change_notes}</TableCell>
                          <TableCell align="center">
                            <IconButton size="small" title="View Document">
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" title="Download">
                              <DownloadIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseVersionDialog}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Paper>
  );
};

export default DocumentManager;
