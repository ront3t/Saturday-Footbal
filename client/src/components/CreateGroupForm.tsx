import React from 'react';
import { useForm } from 'react-hook-form';
import { useAppDispatch } from './../hooks/redux';
import { createGroup } from './../store/slices/groupSlice';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';
import toast from 'react-hot-toast';

interface CreateGroupFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

interface FormData {
  name: string;
  description: string;
  privacy: 'public' | 'private' | 'invite-only';
  city: string;
  rules?: string;
}

const CreateGroupForm: React.FC<CreateGroupFormProps> = ({ onSuccess, onCancel }) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>();

  const privacyOptions = [
    { value: 'public', label: 'Public - Anyone can join' },
    { value: 'private', label: 'Private - Invite required' },
    { value: 'invite-only', label: 'Invite Only - Manager approval' }
  ];

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await dispatch(createGroup({
        ...data,
        location: { city: data.city }
      })).unwrap();
      toast.success('Group created successfully!');
      onSuccess();
    } catch (error: any) {
      toast.error(error || 'Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        {...register('name', {
          required: 'Group name is required',
          maxLength: {
            value: 100,
            message: 'Name cannot exceed 100 characters'
          }
        })}
        label="Group Name"
        placeholder="Enter group name"
        error={errors.name?.message}
      />

      <div>
        <label className="block text-sm font-medium text-slate-200 mb-1">
          Description
        </label>
        <textarea
          {...register('description', {
            required: 'Description is required',
            maxLength: {
              value: 500,
              message: 'Description cannot exceed 500 characters'
            }
          })}
          className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
          rows={3}
          placeholder="Describe your group"
        />
        {errors.description && (
          <p className="text-sm text-red-400 mt-1">{errors.description.message}</p>
        )}
      </div>

      <Select
        {...register('privacy', { required: 'Privacy setting is required' })}
        label="Privacy"
        options={privacyOptions}
        error={errors.privacy?.message}
      />

      <Input
        {...register('city', { required: 'City is required' })}
        label="City"
        placeholder="Enter city name"
        error={errors.city?.message}
      />

      <div>
        <label className="block text-sm font-medium text-slate-200 mb-1">
          Group Rules (Optional)
        </label>
        <textarea
          {...register('rules', {
            maxLength: {
              value: 1000,
              message: 'Rules cannot exceed 1000 characters'
            }
          })}
          className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
          rows={4}
          placeholder="Set group rules and guidelines"
        />
        {errors.rules && (
          <p className="text-sm text-red-400 mt-1">{errors.rules.message}</p>
        )}
      </div>

      <div className="flex space-x-3 pt-4">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          fullWidth
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={loading}
          fullWidth
        >
          Create Group
        </Button>
      </div>
    </form>
  );
};

export default CreateGroupForm;
