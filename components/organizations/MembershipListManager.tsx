// Enhanced React component for Membership List Management with vetting workflow
// src/components/organizations/MembershipListManager.tsx

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { 
  CloudUpload as CloudUploadIcon,
  Download as DownloadIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { RootState } from '../../app/store';
import { 
  fetchMembershipLists, 
  uploadMembershipList,
  reviewMembershipList
} from '../../features/organizations/membershipSlice';
import { formatDate } from '../../utils/dateUtils';
import FileDropzone from '../common/FileDropzone';

interface MembershipListManagerProps {
  organizationId: string;
}

const MembershipListManager: React.FC<MembershipListManagerProps> = ({ organizationId }) => {
  const dispatch = useDispatch();
  const { membershipLists, loading } = useSelector((state: RootState) => state.membership);
  const { currentUser } = useSelector((state: RootState) => state.auth);
  
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [selectedList, setSelectedList] = useState<any>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
    defaultValues: {
      submissionDate: new Date(),
      memberCount: 0,
      notes: ''
    }
  });
  
  const { register: registerReview, handleSubmit: handleSubmitReview, control: controlReview, reset: resetReview } = useForm({
    defaultValues: {
      status: 'approved',
      notes: '',
      issuesFound: '',
      resolution: ''
    }
  });

  useEffect(() => {
    if (organizationId) {
      dispatch(fetchMembershipLists(organizationId));
    }
  }, [dispatch, organizationId]);

  const handleOpenUploadDialog = () => {
    setOpenUploadDialog(true);
    setUploadFile(null);
    setUploadError(null);
    reset({
      submissionDate: new Date(),
      memberCount: 0,
      notes: ''
    });
  };

  const handleCloseUploadDialog = () => {
    setOpenUploadDialog(false);
  };

  const handleOpenReviewDialog = (list: any) => {
    setSelectedList(list);
    setOpenReviewDialog(true);
    resetReview({
      status: 'approved',
      notes: '',
      issuesFound: '',
      resolution: ''
    });
  };

  const handleCloseReviewDialog = () => {
    setOpenReviewDialog(false);
    setSelectedList(null);
  };

  const onFileChange = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      // Check file type
      const validTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        setUploadError('Invalid file type. Please upload Excel, CSV, or PDF files only.');
        setUploadFile(null);
        return;
      }
      
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setUploadError('File is too large. Maximum size is 10MB.');
        setUploadFile(null);
        return;
      }
      
      setUploadFile(file);
      setUploadError(null);
    }
  };

  const onSubmitUpload = (data: any) => {
    if (!uploadFile) {
      setUploadError('Please select a file to upload');
      return;
    }
    
    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('submissionDate', data.submissionDate.toISOString());
    formData.append('memberCount', data.memberCount.toString());
    formData.append('notes', data.notes);
    
    dispatch(uploadMembershipList({ organizationId, formData }))
      .then(() => {
        handleCloseUploadDialog();
        dispatch(fetchMembershipLists(organizationId));
      });
  };

  const onSubmitReview = (data: any) => {
    if (!selectedList) return;
    
    dispatch(reviewMembershipList({ 
      listId: selectedList.id, 
      data: {
        status: data.status,
        notes: data.notes,
        issuesFound: data.issuesFound,
        resolution: data.resolution
      }
    }))
      .then(() => {
        handleCloseReviewDialog();
        dispatch(fetchMembershipLists(organizationId));
      });
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'submitted':
        return <Chip label="Submitted" color="info" size="small" />;
      case 'under_review':
        return <Chip label="Under Review" color="warning" size="small" />;
      case 'approved':
        return <Chip label="Approved" color="success" size="small" />;
      case 'rejected':
        return <Chip label="Rejected" color="error" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  const canReview = () => {
    if (!currentUser || !currentUser.role) return false;
    const reviewRoles = ['REGISTRAR', 'DEPUTY_REGISTRAR', 'INSPECTOR'];
    return reviewRoles.includes(currentUser.role.roleCode);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Membership Lists</Typography>
        <Button
          variant="contained"
          startIcon={<CloudUploadIcon />}
          onClick={handleOpenUploadDialog}
        >
          Upload New Membership List
        </Button>
      </Box>
      
      {membershipLists.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="textSecondary">
            No membership lists found for this organization.
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Submission Date</TableCell>
                <TableCell align="right">Member Count</TableCell>
                <TableCell align="right">Change</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Reviewed By</TableCell>
                <TableCell>Review Date</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {membershipLists.map((list: any) => (
                <TableRow key={list.id}>
                  <TableCell>{formatDate(list.submissionDate)}</TableCell>
                  <TableCell align="right">{list.memberCount}</TableCell>
                  <TableCell align="right">
                    {list.changePercentage > 0 ? (
                      <Typography color="success.main">+{list.changePercentage.toFixed(2)}%</Typography>
                    ) : list.changePercentage < 0 ? (
                      <Typography color="error.main">{list.changePercentage.toFixed(2)}%</Typography>
                    ) : (
                      <Typography>0%</Typography>
                    )}
                  </TableCell>
                  <TableCell>{getStatusChip(list.status)}</TableCell>
                  <TableCell>{list.reviewedByName || '-'}</TableCell>
                  <TableCell>{list.reviewDate ? formatDate(list.reviewDate) : '-'}</TableCell>
                  <TableCell align="center">
                    <IconButton size="small" title="Download">
                      <DownloadIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" title="View Details">
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    {canReview() && list.status === 'submitted' && (
                      <IconButton 
                        size="small" 
                        title="Review" 
                        color="primary"
                        onClick={() => handleOpenReviewDialog(list)}
                      >
                        <CheckCircleIcon fontSize="small" />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      
      {/* Upload Dialog */}
      <Dialog open={openUploadDialog} onClose={handleCloseUploadDialog} maxWidth="md" fullWidth>
        <DialogTitle>Upload Membership List</DialogTitle>
        <form onSubmit={handleSubmit(onSubmitUpload)}>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FileDropzone
                  onFileChange={onFileChange}
                  acceptedFileTypes={['.xlsx', '.xls', '.csv', '.pdf']}
                  maxFiles={1}
                />
                {uploadError && (
                  <Alert severity="error" sx={{ mt: 2 }}>{uploadError}</Alert>
                )}
                {uploadFile && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    File selected: {uploadFile.name} ({(uploadFile.size / 1024 / 1024).toFixed(2)} MB)
                  </Alert>
                )}
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Controller
                  name="submissionDate"
                  control={control}
                  rules={{ required: 'Submission date is required' }}
                  render={({ field }) => (
                    <DatePicker
                      label="Submission Date"
                      value={field.value}
                      onChange={(date) => field.onChange(date)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.submissionDate,
                          helperText: errors.submissionDate?.message as string
                        }
                      }}
                    />
                  )}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Member Count"
                  type="number"
                  InputProps={{ inputProps: { min: 0 } }}
                  {...register('memberCount', {
                    required: 'Member count is required',
                    valueAsNumber: true,
                    min: {
                      value: 1,
                      message: 'Member count must be at least 1'
                    }
                  })}
                  error={!!errors.memberCount}
                  helperText={errors.memberCount?.message as string}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes"
                  multiline
                  rows={3}
                  {...register('notes')}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseUploadDialog}>Cancel</Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={loading || !uploadFile}
            >
              {loading ? 'Uploading...' : 'Upload'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      
      {/* Review Dialog */}
      <Dialog open={openReviewDialog} onClose={handleCloseReviewDialog} maxWidth="md" fullWidth>
        <DialogTitle>Review Membership List</DialogTitle>
        {selectedList && (
          <form onSubmit={handleSubmitReview(onSubmitReview)}>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2" color="textSecondary">Submission Date</Typography>
                      <Typography variant="body1">{formatDate(selectedList.submissionDate)}</Typography>
                      
                      <Typography variant="subtitle2" color="textSecondary" sx={{ mt: 2 }}>Member Count</Typography>
                      <Typography variant="body1">{selectedList.memberCount}</Typography>
                      
                      <Typography variant="subtitle2" color="textSecondary" sx={{ mt: 2 }}>Change from Previous</Typography>
                      <Typography variant="body1">
                        {selectedList.changePercentage > 0 ? (
                          <span style={{ color: 'green' }}>+{selectedList.changePercentage.toFixed(2)}%</span>
                        ) : selectedList.changePercentage < 0 ? (
                          <span style={{ color: 'red' }}>{selectedList.changePercentage.toFixed(2)}%</span>
                        ) : (
                          '0%'
                        )}
                      </Typography>
                      
                      <Typography variant="subtitle2" color="textSecondary" sx={{ mt: 2 }}>Submitted By</Typography>
                      <Typography variant="body1">{selectedList.submittedByName || 'Unknown'}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel>Review Status</InputLabel>
                    <Controller
                      name="status"
                      control={controlReview}
                      rules={{ required: 'Status is required' }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          label="Review Status"
                        >
                          <MenuItem value="approved">Approve</MenuItem>
                          <MenuItem value="rejected">Reject</MenuItem>
                          <MenuItem value="under_review">Keep Under Review</MenuItem>
                        </Select>
                      )}
                    />
                  </FormControl>
                  
                  <TextField
                    fullWidth
                    label="Review Notes"
                    multiline
                    rows={2}
                    sx={{ mb: 3 }}
                    {...registerReview('notes')}
                  />
                  
                  <TextField
                    fullWidth
                    label="Issues Found (if any)"
                    multiline
                    rows={2}
                    sx={{ mb: 3 }}
                    {...registerReview('issuesFound')}
                  />
                  
                  <TextField
                    fullWidth
                    label="Resolution"
                    multiline
                    rows={2}
                    {...registerReview('resolution')}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseReviewDialog}>Cancel</Button>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Review'}
              </Button>
            </DialogActions>
          </form>
        )}
      </Dialog>
    </Box>
  );
};

export default MembershipListManager;
