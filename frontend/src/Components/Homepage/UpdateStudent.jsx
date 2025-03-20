import React, { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Loader2, ImagePlus, FileText, Phone, GraduationCap, User, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from '../LoginSignUp/axios';
import { login } from '../redux/authSlice';

const formSchema = z.object({
  phone: z.string().regex(/^\d{10}$/, 'Phone number must be 10 digits'),
  bio: z.string().min(10, 'Bio must be at least 10 characters').optional(),
  graduationMarks: z.coerce.number({ required_error: 'Marks are required' }).min(0, { message: 'Marks must be between 0 and 100' }).max(100, { message: 'Marks must be between 0 and 100' }),
  resume: z.string().url('Invalid URL'),
});

const UpdateStudent = ({ open, setOpen, setUser }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const initialValues = useRef({});

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: user?.phone || '',
      bio: user?.profile?.bio || '',
      graduationMarks: user?.profile?.graduationMarks || '',
      resume: user?.profile?.resume || '',
      email: user?.email,
    },
  });

  useEffect(() => {
    if (open && user) {
      initialValues.current = {
        phone: user.phone,
        bio: user.profile?.bio,
        graduationMarks: user.profile?.graduationMarks,
        resume: user.profile?.resume,
        email: user.email,
      };
      form.reset(initialValues.current);
    }
  }, [open, user, form]);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const hasChanges = (values) => {
    return Object.keys(values).some((key) => values[key] !== initialValues.current[key]) || image !== null;
  };

  const onSubmit = async (values) => {
    if (!hasChanges(values)) {
      toast.error('No changes detected');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('phone', values.phone);
      formData.append('bio', values.bio);
      formData.append('graduationMarks', values.graduationMarks);
      formData.append('resume', values.resume);
      formData.append('email', user.email);
      if (image) formData.append('image', image);
      const response = await axios.post('/update/user', formData);
      if (response.data.success) {
        toast.success('Profile updated successfully! ✨');
        setUser(response.data.user);
        dispatch(
          login({
            user: response.data.user,
            token: response.data.token || localStorage.getItem('token'),
          })
        );
        setOpen(false);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[400px] bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 shadow-xl border border-blue-100">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-600 text-center mb-4">
            🎓 Update Profile
          </DialogTitle>
          <Button variant="ghost" className="absolute right-4 top-4" onClick={() => setOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-blue-600">
              <Phone className="h-4 w-4" />
              <Label className="font-medium text-sm">Phone</Label>
            </div>
            <Input {...form.register('phone')} placeholder="Phone" className="h-10 px-3 rounded-xl border border-blue-200 focus:border-blue-400" />
            {form.formState.errors.phone && <p className="text-red-500 text-xs mt-1">{form.formState.errors.phone.message}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-blue-600">
              <User className="h-4 w-4" />
              <Label className="font-medium text-sm">Bio</Label>
            </div>
            <textarea {...form.register('bio')} placeholder="Bio" className="w-full rounded-xl border border-blue-200 p-2 h-20 text-xs focus:border-blue-400" />
            {form.formState.errors.bio && <p className="text-red-500 text-xs mt-1">{form.formState.errors.bio.message}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-blue-600">
              <GraduationCap className="h-4 w-4" />
              <Label className="font-medium text-sm">Marks (%)</Label>
            </div>
            <Input type="number" {...form.register('graduationMarks')} placeholder="Marks" className="h-10 px-3 rounded-xl border border-blue-200 focus:border-blue-400" />
            {form.formState.errors.graduationMarks && <p className="text-red-500 text-xs mt-1">{form.formState.errors.graduationMarks.message}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-blue-600 font-medium text-sm">Image</Label>
            <label className="cursor-pointer group">
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              <div className="flex items-center gap-2 p-2 rounded-xl border border-dashed border-blue-200 group-hover:border-blue-300 transition-colors text-xs">
                <ImagePlus className="h-4 w-4 text-blue-400" />
                <span>{image ? image.name : 'Upload'}</span>
              </div>
            </label>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-blue-600">
              <FileText className="h-4 w-4" />
              <Label className="font-medium text-sm">Resume URL</Label>
            </div>
            <Input {...form.register('resume')} placeholder="Resume URL" className="h-10 px-3 rounded-xl border border-blue-200 focus:border-blue-400" />
            {form.formState.errors.resume && <p className="text-red-500 text-xs mt-1">{form.formState.errors.resume.message}</p>}
          </div>

          <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white h-10 rounded-xl text-sm font-semibold shadow-md transition-all" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default UpdateStudent;