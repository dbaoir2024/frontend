// Enhanced React component for Workflow Management
// src/components/workflow/WorkflowDashboard.tsx

import React, { useEffect, useState } from 'react';
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
  DialogTitle
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Assignment as AssignmentIcon,
  Description as DescriptionIcon,
  History as HistoryIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import { fetchWorkflowItems, createWorkflowItem } from '../../features/workflow/workflowSlice';
import { RootState } from '../../app/store';
import { formatDate } from '../../utils/dateUtils';
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
      id={`workflow-tabpanel-${index}`}
      aria-labelledby={`workflow-tab-${index}`}
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

const WorkflowDashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { workflowItems, workflowTypes, workflowStatuses, loading } = useSelector((state: RootState) => state.workflow);
  const { currentUser } = useSelector((state: RootState) => state.auth);
  
  const [tabValue, setTabValue] = useState(0);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dateRangeStart, setDateRangeStart] = useState<Date | null>(null);
  const [dateRangeEnd, setDateRangeEnd] = useState<Date | null>(null);
  
  const [openNewDialog, setOpenNewDialog] = useState(false);
  const [newWorkflowType, setNewWorkflowType] = useState<string>('');
  const [newWorkflowTitle, setNewWorkflowTitle] = useState<string>('');
  const [newWorkflowDescription, setNewWorkflowDescription] = useState<string>('');
  const [newWorkflowDueDate, setNewWorkflowDueDate] = useState<Date | null>(null);
  const [newWorkflowOrganization, setNewWorkflowOrganization] = useState<string>('');
  const [newWorkflowPriority, setNewWorkflowPriority] = useState<string>('MEDIUM');
  
  const [selectedWorkflow, setSelectedWorkflow] = useState<any>(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  
  useEffect(() => {
    dispatch(fetchWorkflowItems({ 
      type: typeFilter !== 'all' ? typeFilter : undefined,
      status: statusFilter !== 'all' ? statusFilter : undefined,
      search: searchQuery || undefined,
      startDate: dateRangeStart ? dateRangeStart.toISOString() : undefined,
      endDate: dateRangeEnd ? dateRangeEnd.toISOString() : undefined
    }));
  }, [dispatch, typeFilter, statusFilter, searchQuery, dateRangeStart, dateRangeEnd]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleTypeFilterChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setTypeFilter(event.target.value as string);
  };

  const handleStatusFilterChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setStatusFilter(event.target.value as string);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleOpenNewDialog = () => {
    setOpenNewDialog(true);
  };

  const handleCloseNewDialog = () => {
    setOpenNewDialog(false);
    resetNewWorkflowForm();
  };

  const resetNewWorkflowForm = () => {
    setNewWorkflowType('');
    setNewWorkflowTitle('');
    setNewWorkflowDescription('');
    setNewWorkflowDueDate(null);
    setNewWorkflowOrganization('');
    setNewWorkflowPriority('MEDIUM');
  };

  const handleCreateWorkflow = () => {
    if (!newWorkflowType || !newWorkflowTitle) {
      return; // Validation failed
    }
    
    dispatch(createWorkflowItem({
      workflow_type_id: parseInt(newWorkflowType),
      title: newWorkflowTitle,
      description: newWorkflowDescription,
      organization_id: newWorkflowOrganization ? parseInt(newWorkflowOrganization) : undefined,
      due_date: newWorkflowDueDate ? newWorkflowDueDate.toISOString() : undefined,
      priority: newWorkflowPriority
    }))
      .then(() => {
        handleCloseNewDialog();
        dispatch(fetchWorkflowItems({}));
      });
  };

  const handleViewWorkflow = (workflow: any) => {
    setSelectedWorkflow(workflow);
    setOpenDetailDialog(true);
  };

  const handleCloseDetailDialog = () => {
    setOpenDetailDialog(false);
    setSelectedWorkflow(null);
  };

  const getStatusChip = (status: string) => {
    const statusObj = workflowStatuses.find(s => s.id === status);
    if (!statusObj) return <Chip label={status} size="small" />;
    
    let color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' = 'default';
    
    switch (statusObj.status_code) {
      case 'DRAFT':
        color = 'default';
        break;
      case 'PENDING':
        color = 'warning';
        break;
      case 'IN_PROGRESS':
        color = 'info';
        break;
      case 'REVIEW':
        color = 'secondary';
        break;
      case 'APPROVED':
        color = 'success';
        break;
      case 'REJECTED':
        color = 'error';
        break;
      case 'COMPLETED':
        color = 'success';
        break;
      case 'CANCELLED':
        color = 'error';
        break;
      case 'ON_HOLD':
        color = 'warning';
        break;
    }
    
    return <Chip label={statusObj.status_name} color={color} size="small" />;
  };

  const getPriorityChip = (priority: string) => {
    let color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' = 'default';
    
    switch (priority) {
      case 'LOW':
        color = 'info';
        break;
      case 'MEDIUM':
        color = 'warning';
        break;
      case 'HIGH':
        color = 'error';
        break;
    }
    
    return <Chip label={priority} color={color} size="small" />;
  };

  const getWorkflowTypeLabel = (typeId: string) => {
    const typeObj = workflowTypes.find(t => t.id === typeId);
    return typeObj ? typeObj.type_name : typeId;
  };

  // Filter workflows based on tab
  const getFilteredWorkflows = () => {
    if (tabValue === 0) {
      // All workflows
      return workflowItems;
    } else if (tabValue === 1) {
      // My workflows (assigned to me)
      return workflowItems.filter(item => item.assigned_to === currentUser?.id);
    } else if (tabValue === 2) {
      // Created by me
      return workflowItems.filter(item => item.initiated_by === currentUser?.id);
    } else if (tabValue === 3) {
      // Pending workflows
      return workflowItems.filter(item => {
        const statusObj = workflowStatuses.find(s => s.id === item.status_id);
        return statusObj && ['PENDING', 'IN_PROGRESS', 'REVIEW'].includes(statusObj.status_code);
      });
    } else if (tabValue === 4) {
      // Completed workflows
      return workflowItems.filter(item => {
        const statusObj = workflowStatuses.find(s => s.id === item.status_id);
        return statusObj && ['COMPLETED', 'APPROVED'].includes(statusObj.status_code);
      });
    }
    
    return workflowItems;
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Workflow Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenNewDialog}
        >
          New Workflow
        </Button>
      </Box>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="workflow tabs">
          <Tab label="All Workflows" />
          <Tab label="My Tasks" />
          <Tab label="Created by Me" />
          <Tab label="Pending" />
          <Tab label="Completed" />
        </Tabs>
      </Box>
      
      <TabPanel value={tabValue} index={0}>
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Search"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search by title, tracking number..."
                InputProps={{
                  startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={typeFilter}
                  onChange={handleTypeFilterChange}
                  label="Type"
                >
                  <MenuItem value="all">All Types</MenuItem>
                  {workflowTypes.map(type => (
                    <MenuItem key={type.id} value={type.id}>
                      {type.type_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
                  label="Status"
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  {workflowStatuses.map(status => (
                    <MenuItem key={status.id} value={status.id}>
                      {status.status_name}
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
        
        {renderWorkflowTable(getFilteredWorkflows())}
      </TabPanel>
      
      <TabPanel value={tabValue} index={1}>
        {renderWorkflowTable(getFilteredWorkflows())}
      </TabPanel>
      
      <TabPanel value={tabValue} index={2}>
        {renderWorkflowTable(getFilteredWorkflows())}
      </TabPanel>
      
      <TabPanel value={tabValue} index={3}>
        {renderWorkflowTable(getFilteredWorkflows())}
      </TabPanel>
      
      <TabPanel value={tabValue} index={4}>
        {renderWorkflowTable(getFilteredWorkflows())}
      </TabPanel>
      
      {/* New Workflow Dialog */}
      <Dialog open={openNewDialog} onClose={handleCloseNewDialog} maxWidth="md" fullWidth>
        <DialogTitle>Create New Workflow</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Workflow Type</InputLabel>
                <Select
                  value={newWorkflowType}
                  onChange={(e) => setNewWorkflowType(e.target.value as string)}
                  label="Workflow Type"
                >
                  {workflowTypes.map(type => (
                    <MenuItem key={type.id} value={type.id}>
                      {type.type_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={newWorkflowPriority}
                  onChange={(e) => setNewWorkflowPriority(e.target.value as string)}
                  label="Priority"
                >
                  <MenuItem value="LOW">Low</MenuItem>
                  <MenuItem value="MEDIUM">Medium</MenuItem>
                  <MenuItem value="HIGH">High</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Title"
                value={newWorkflowTitle}
                onChange={(e) => setNewWorkflowTitle(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={newWorkflowDescription}
                onChange={(e) => setNewWorkflowDescription(e.target.value)}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Organization ID"
                value={newWorkflowOrganization}
                onChange={(e) => setNewWorkflowOrganization(e.target.value)}
                type="number"
                helperText="Leave blank if not related to a specific organization"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <DatePicker
                label="Due Date"
                value={newWorkflowDueDate}
                onChange={(date) => setNewWorkflowDueDate(date)}
                slotProps={{
                  textField: {
                    fullWidth: true
                  }
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNewDialog}>Cancel</Button>
          <Button 
            onClick={handleCreateWorkflow} 
            variant="contained" 
            color="primary"
            disabled={!newWorkflowType || !newWorkflowTitle}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Workflow Detail Dialog */}
      <Dialog open={openDetailDialog} onClose={handleCloseDetailDialog} maxWidth="md" fullWidth>
        {selectedWorkflow && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">
                  {selectedWorkflow.title}
                </Typography>
                <Chip 
                  label={selectedWorkflow.tracking_number} 
                  color="primary" 
                  variant="outlined"
                />
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">Type</Typography>
                  <Typography variant="body1">
                    {getWorkflowTypeLabel(selectedWorkflow.workflow_type_id)}
                  </Typography>
                  
                  <Typography variant="subtitle2" color="textSecondary" sx={{ mt: 2 }}>Status</Typography>
                  <Box>
                    {getStatusChip(selectedWorkflow.status_id)}
                  </Box>
                  
                  <Typography variant="subtitle2" color="textSecondary" sx={{ mt: 2 }}>Priority</Typography>
                  <Box>
                    {getPriorityChip(selectedWorkflow.priority)}
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">Start Date</Typography>
                  <Typography variant="body1">
                    {formatDate(selectedWorkflow.start_date)}
                  </Typography>
                  
                  <Typography variant="subtitle2" color="textSecondary" sx={{ mt: 2 }}>Due Date</Typography>
                  <Typography variant="body1">
                    {selectedWorkflow.due_date ? formatDate(selectedWorkflow.due_date) : 'Not set'}
                  </Typography>
                  
                  <Typography variant="subtitle2" color="textSecondary" sx={{ mt: 2 }}>Completion Date</Typography>
                  <Typography variant="body1">
                    {selectedWorkflow.completion_date ? formatDate(selectedWorkflow.completion_date) : 'Not completed'}
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" color="textSecondary">Description</Typography>
                  <Typography variant="body1" paragraph>
                    {selectedWorkflow.description || 'No description provided.'}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">Initiated By</Typography>
                  <Typography variant="body1">
                    {selectedWorkflow.initiator_name || 'Unknown'}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">Assigned To</Typography>
                  <Typography variant="body1">
                    {selectedWorkflow.assignee_name || 'Unassigned'}
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" gutterBottom>Documents</Typography>
                  
                  {selectedWorkflow.documents && selectedWorkflow.documents.length > 0 ? (
                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Document Name</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Uploaded By</TableCell>
                            <TableCell>Upload Date</TableCell>
                            <TableCell>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedWorkflow.documents.map((doc: any) => (
                            <TableRow key={doc.id}>
                              <TableCell>{doc.file_name}</TableCell>
                              <TableCell>{doc.document_type}</TableCell>
                              <TableCell>{doc.uploader_name || 'Unknown'}</TableCell>
                              <TableCell>{formatDate(doc.upload_date)}</TableCell>
                              <TableCell>
                                <IconButton size="small" title="View Document">
                                  <VisibilityIcon fontSize="small" />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No documents attached to this workflow.
                    </Typography>
                  )}
                </Grid>
                
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" gutterBottom>History</Typography>
                  
                  {selectedWorkflow.history && selectedWorkflow.history.length > 0 ? (
                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Action By</TableCell>
                            <TableCell>Comments</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedWorkflow.history.map((hist: any) => (
                            <TableRow key={hist.id}>
                              <TableCell>{formatDate(hist.action_date)}</TableCell>
                              <TableCell>
                                {getStatusChip(hist.status_id)}
                              </TableCell>
                              <TableCell>{hist.action_by_name || 'System'}</TableCell>
                              <TableCell>{hist.comments || '-'}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No history records available.
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDetailDialog}>Close</Button>
              <Button 
                variant="outlined" 
                color="primary"
                startIcon={<EditIcon />}
              >
                Edit
              </Button>
              <Button 
                variant="contained" 
                color="primary"
                startIcon={<AssignmentIcon />}
              >
                Update Status
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Paper>
  );
  
  function renderWorkflowTable(workflows: any[]) {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      );
    }
    
    if (workflows.length === 0) {
      return (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="textSecondary">
            No workflow items found.
          </Typography>
        </Paper>
      );
    }
    
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tracking Number</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {workflows.map((workflow) => (
              <TableRow key={workflow.id}>
                <TableCell>{workflow.tracking_number}</TableCell>
                <TableCell>{workflow.title}</TableCell>
                <TableCell>{getWorkflowTypeLabel(workflow.workflow_type_id)}</TableCell>
                <TableCell>{getStatusChip(workflow.status_id)}</TableCell>
                <TableCell>{getPriorityChip(workflow.priority)}</TableCell>
                <TableCell>{formatDate(workflow.start_date)}</TableCell>
                <TableCell>
                  {workflow.due_date ? (
                    <Typography 
                      color={
                        new Date(workflow.due_date) < new Date() && 
                        !workflow.completion_date ? 
                        'error.main' : 'inherit'
                      }
                    >
                      {formatDate(workflow.due_date)}
                    </Typography>
                  ) : '-'}
                </TableCell>
                <TableCell>{workflow.assignee_name || 'Unassigned'}</TableCell>
                <TableCell align="center">
                  <IconButton 
                    size="small" 
                    title="View Details"
                    onClick={() => handleViewWorkflow(workflow)}
                  >
                    <VisibilityIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" title="Edit">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" title="Documents">
                    <DescriptionIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" title="History">
                    <HistoryIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
};

export default WorkflowDashboard;
