// Enhanced React component for Award Management with categorization
// src/components/agreements/AwardForm.tsx

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { RootState } from '../../app/store';
import { createAgreement, updateAgreement } from '../../features/agreements/agreementsSlice';
import { fetchAwardCategories } from '../../features/agreements/awardCategoriesSlice';
import { fetchOrganizations } from '../../features/organizations/organizationsSlice';
import FileDropzone from '../common/FileDropzone';

interface AwardFormProps {
  agreementId?: string;
  initialData?: any;
  onSuccess?: () => void;
}

const AwardForm: React.FC<AwardFormProps> = ({ agreementId, initialData, onSuccess }) => {
  const dispatch = useDispatch();
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: initialData || {
      agreementNumber: '',
      agreementName: '',
      agreementTypeId: '',
      awardCategoryId: '',
      primaryOrganizationId: '',
      counterpartyName: '',
      counterpartyOrganizationId: '',
      effectiveDate: null,
      expiryDate: null,
      status: 'active',
      notes: ''
    }
  });

  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const awardCategories = useSelector((state: RootState) => state.awardCategories.items);
  const organizations = useSelector((state: RootState) => state.organizations.items);
  const loading = useSelector((state: RootState) => state.agreements.loading);

  useEffect(() => {
    dispatch(fetchAwardCategories());
    dispatch(fetchOrganizations({ page: 1, pageSize: 100, status: 'active' }));
  }, [dispatch]);

  const onFileChange = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      // Check file type
      const validTypes = ['application/pdf'];
      if (!validTypes.includes(file.type)) {
        setFileError('Invalid file type. Please upload PDF files only.');
        setDocumentFile(null);
        return;
      }
      
      // Check file size (max 20MB)
      if (file.size > 20 * 1024 * 1024) {
        setFileError('File is too large. Maximum size is 20MB.');
        setDocumentFile(null);
        return;
      }
      
      setDocumentFile(file);
      setFileError(null);
    }
  };

  const onSubmit = (data: any) => {
    const formData = new FormData();
    
    // Add all form fields to formData
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        if (key === 'effectiveDate' || key === 'expiryDate') {
          if (data[key]) {
            formData.append(key, data[key].toISOString());
          }
        } else {
          formData.append(key, data[key]);
        }
      }
    });
    
    // Add document file if available
    if (documentFile) {
      formData.append('document', documentFile);
    }
    
    if (agreementId) {
      dispatch(updateAgreement({ id: agreementId, data: formData }))
        .then(() => {
          if (onSuccess) onSuccess();
        });
    } else {
      dispatch(createAgreement(formData))
        .then(() => {
          if (onSuccess) onSuccess();
        });
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {agreementId ? 'Edit Award' : 'Register New Award'}
      </Typography>
      <Divider sx={{ mb: 3 }} />
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Award/Agreement Number"
              {...register('agreementNumber', { required: 'Agreement number is required' })}
              error={!!errors.agreementNumber}
              helperText={errors.agreementNumber?.message as string}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Award/Agreement Name"
              {...register('agreementName', { required: 'Agreement name is required' })}
              error={!!errors.agreementName}
              helperText={errors.agreementName?.message as string}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.awardCategoryId}>
              <InputLabel>Award Category</InputLabel>
              <Controller
                name="awardCategoryId"
                control={control}
                rules={{ required: 'Award category is required' }}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Award Category"
                  >
                    {awardCategories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.categoryName} - {category.legalFramework}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.awardCategoryId && (
                <FormHelperText>{errors.awardCategoryId.message as string}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.status}>
              <InputLabel>Status</InputLabel>
              <Controller
                name="status"
                control={control}
                rules={{ required: 'Status is required' }}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Status"
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="expired">Expired</MenuItem>
                    <MenuItem value="terminated">Terminated</MenuItem>
                    <MenuItem value="in_negotiation">In Negotiation</MenuItem>
                  </Select>
                )}
              />
              {errors.status && (
                <FormHelperText>{errors.status.message as string}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.primaryOrganizationId}>
              <InputLabel>Primary Organization</InputLabel>
              <Controller
                name="primaryOrganizationId"
                control={control}
                rules={{ required: 'Primary organization is required' }}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Primary Organization"
                  >
                    {organizations.map((org) => (
                      <MenuItem key={org.id} value={org.id}>
                        {org.registrationNumber} - {org.organizationName}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.primaryOrganizationId && (
                <FormHelperText>{errors.primaryOrganizationId.message as string}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Counterparty Organization (if applicable)</InputLabel>
              <Controller
                name="counterpartyOrganizationId"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Counterparty Organization (if applicable)"
                  >
                    <MenuItem value="">None</MenuItem>
                    {organizations.map((org) => (
                      <MenuItem key={org.id} value={org.id}>
                        {org.registrationNumber} - {org.organizationName}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Counterparty Name (if not in system)"
              {...register('counterpartyName')}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Controller
              name="effectiveDate"
              control={control}
              rules={{ required: 'Effective date is required' }}
              render={({ field }) => (
                <DatePicker
                  label="Effective Date"
                  value={field.value}
                  onChange={(date) => field.onChange(date)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.effectiveDate,
                      helperText: errors.effectiveDate?.message as string
                    }
                  }}
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Controller
              name="expiryDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  label="Expiry Date"
                  value={field.value}
                  onChange={(date) => field.onChange(date)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.expiryDate,
                      helperText: errors.expiryDate?.message as string
                    }
                  }}
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Upload Award Document (PDF)
            </Typography>
            <FileDropzone
              onFileChange={onFileChange}
              acceptedFileTypes={['.pdf']}
              maxFiles={1}
            />
            {fileError && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {fileError}
              </Typography>
            )}
            {documentFile && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Selected file: {documentFile.name} ({(documentFile.size / 1024 / 1024).toFixed(2)} MB)
              </Typography>
            )}
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
          
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? 'Saving...' : agreementId ? 'Update Award' : 'Register Award'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default AwardForm;
