// Enhanced React components for OIR Dashboard with advanced features
// src/components/organizations/OrganizationForm.tsx

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  FormHelperText,
  Grid,
  Paper,
  Typography,
  Divider,
  Box
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { RootState } from '../../app/store';
import { createOrganization, updateOrganization } from '../../features/organizations/organizationsSlice';
import { fetchOrganizationTypes } from '../../features/organizations/organizationTypesSlice';
import { fetchRegions, fetchDistrictsByRegion } from '../../features/geography/geographySlice';

interface OrganizationFormProps {
  organizationId?: string;
  initialData?: any;
  onSuccess?: () => void;
}

const OrganizationForm: React.FC<OrganizationFormProps> = ({ 
  organizationId, 
  initialData, 
  onSuccess 
}) => {
  const dispatch = useDispatch();
  const { register, handleSubmit, control, setValue, watch, formState: { errors } } = useForm({
    defaultValues: initialData || {
      registrationNumber: '',
      organizationName: '',
      organizationTypeId: '',
      registrationDate: null,
      firstRegisteredDate: null,
      expiryDate: null,
      status: 'active',
      address: '',
      regionId: '',
      districtId: '',
      contactPerson: '',
      contactEmail: '',
      contactPhone: '',
      website: '',
      membershipCount: 0,
      isCompliant: true
    }
  });

  const organizationTypes = useSelector((state: RootState) => state.organizationTypes.items);
  const regions = useSelector((state: RootState) => state.geography.regions);
  const districts = useSelector((state: RootState) => state.geography.districts);
  const loading = useSelector((state: RootState) => state.organizations.loading);
  
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  
  const watchRegionId = watch('regionId');

  useEffect(() => {
    dispatch(fetchOrganizationTypes());
    dispatch(fetchRegions());
  }, [dispatch]);

  useEffect(() => {
    if (watchRegionId && watchRegionId !== selectedRegion) {
      setSelectedRegion(watchRegionId);
      dispatch(fetchDistrictsByRegion(watchRegionId));
    }
  }, [watchRegionId, selectedRegion, dispatch]);

  const onSubmit = (data: any) => {
    if (organizationId) {
      dispatch(updateOrganization({ id: organizationId, data }))
        .then(() => {
          if (onSuccess) onSuccess();
        });
    } else {
      dispatch(createOrganization(data))
        .then(() => {
          if (onSuccess) onSuccess();
        });
    }
  };

  // Validate registration number format (IO-XX)
  const validateRegistrationNumber = (value: string) => {
    return /^IO-\d{2,}$/.test(value) || 'Registration number must be in format IO-XX (e.g., IO-01, IO-02)';
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {organizationId ? 'Edit Organization' : 'Register New Organization'}
      </Typography>
      <Divider sx={{ mb: 3 }} />
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Registration Number (IO-XX format)"
              {...register('registrationNumber', { 
                required: 'Registration number is required',
                validate: validateRegistrationNumber
              })}
              error={!!errors.registrationNumber}
              helperText={errors.registrationNumber?.message as string}
              placeholder="e.g., IO-01"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Organization Name"
              {...register('organizationName', { required: 'Organization name is required' })}
              error={!!errors.organizationName}
              helperText={errors.organizationName?.message as string}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.organizationTypeId}>
              <InputLabel>Organization Type</InputLabel>
              <Controller
                name="organizationTypeId"
                control={control}
                rules={{ required: 'Organization type is required' }}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Organization Type"
                  >
                    {organizationTypes.map((type) => (
                      <MenuItem key={type.id} value={type.id}>
                        {type.typeName}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.organizationTypeId && (
                <FormHelperText>{errors.organizationTypeId.message as string}</FormHelperText>
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
                    <MenuItem value="suspended">Suspended</MenuItem>
                    <MenuItem value="deregistered">Deregistered</MenuItem>
                  </Select>
                )}
              />
              {errors.status && (
                <FormHelperText>{errors.status.message as string}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Controller
              name="registrationDate"
              control={control}
              rules={{ required: 'Registration date is required' }}
              render={({ field }) => (
                <DatePicker
                  label="Registration Date"
                  value={field.value}
                  onChange={(date) => field.onChange(date)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.registrationDate,
                      helperText: errors.registrationDate?.message as string
                    }
                  }}
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Controller
              name="firstRegisteredDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  label="First Registered Date (Historical)"
                  value={field.value}
                  onChange={(date) => field.onChange(date)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.firstRegisteredDate,
                      helperText: errors.firstRegisteredDate?.message as string
                    }
                  }}
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Controller
              name="expiryDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  label="Expiry Date (if applicable)"
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
            <TextField
              fullWidth
              label="Address"
              multiline
              rows={2}
              {...register('address')}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Region</InputLabel>
              <Controller
                name="regionId"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Region"
                  >
                    {regions.map((region) => (
                      <MenuItem key={region.id} value={region.id}>
                        {region.regionName}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>District</InputLabel>
              <Controller
                name="districtId"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="District"
                    disabled={!selectedRegion}
                  >
                    {districts.map((district) => (
                      <MenuItem key={district.id} value={district.id}>
                        {district.districtName}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Contact Person"
              {...register('contactPerson')}
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Contact Email"
              type="email"
              {...register('contactEmail', {
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              error={!!errors.contactEmail}
              helperText={errors.contactEmail?.message as string}
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Contact Phone"
              {...register('contactPhone')}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Website"
              {...register('website')}
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Membership Count"
              type="number"
              InputProps={{ inputProps: { min: 0 } }}
              {...register('membershipCount', {
                valueAsNumber: true
              })}
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Compliance Status</InputLabel>
              <Controller
                name="isCompliant"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Compliance Status"
                  >
                    <MenuItem value={true}>Compliant</MenuItem>
                    <MenuItem value={false}>Non-Compliant</MenuItem>
                  </Select>
                )}
              />
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? 'Saving...' : organizationId ? 'Update Organization' : 'Register Organization'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default OrganizationForm;
