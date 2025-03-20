import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Loader2, ImagePlus, Phone, Pencil } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import axios from '../LoginSignUp/axios'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { login } from '../redux/authSlice'
import { X } from "lucide-react";

const formSchema = z.object({
  phone: z.string()
    .regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  bio: z.string().optional(),
})

const UpdateAdmin = ({ open, setOpen,setUser }) => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const [image, setImage] = React.useState(null)
  const [loading, setLoading] = React.useState(false)
  const initialValues = React.useRef({ phone: '', bio: '' })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: user?.phone || '',
      bio: user?.profile?.bio || ''
    }
  })

  React.useEffect(() => {
    if (open && user) {
      initialValues.current = {
        phone: user.phone || '',
        bio: user.profile?.bio || ''
      }
    }
  }, [open, user])

  const handleImageChange = (e) => {
    setImage(e.target.files[0])
  }

  const hasChanges = (values) => {
    return (
      values.phone !== initialValues.current.phone ||
      values.bio !== initialValues.current.bio ||
      image !== null
    )
  }

  const onSubmit = async (values) => {
    if (!hasChanges(values)) {
      toast.error('No changes detected')
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("phone", values.phone)
      formData.append("bio", values.bio)
      formData.append("email", user.email)
      if (image) formData.append('image', image)

      const response = await axios.post('/update/admin', formData)
      console.log(response.data.user)
      
      if (response.data.success) {
        setUser(response.data.user);
        toast.success('Profile updated successfully! 🌟')
        dispatch(login({
          user: response.data.user,
          token: response.data.token || localStorage.getItem("token")
        }))
        setOpen(false)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed 😢')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-white to-purple-50 rounded-2xl p-8 shadow-2xl border border-purple-100">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-purple-600 text-center mb-6">
            ✨ Update Profile ✨
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Phone Input */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-purple-600">
              <Phone className="h-5 w-5" />
              <Label className="font-medium">Phone Number</Label>
            </div>
            <Input
              {...form.register("phone")}
              className="rounded-xl border-2 border-purple-100 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 h-12 px-4 text-purple-800"
              placeholder="Enter 10-digit phone number"
            />
            {form.formState.errors.phone && (
              <p className="text-red-400 text-sm mt-1 ml-1">
                {form.formState.errors.phone.message}
              </p>
            )}
          </div>

          {/* Bio Input */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-purple-600">
              <Pencil className="h-5 w-5" />
              <Label className="font-medium">Bio</Label>
            </div>
            <textarea
              {...form.register("bio")}
              className="w-full rounded-xl border-2 border-purple-100 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 p-3 h-32 text-purple-800 placeholder-purple-300"
              placeholder="Share something about yourself..."
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label className="text-purple-600 font-medium">Profile Image</Label>
            <label className="cursor-pointer group">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <div className="flex flex-col items-center justify-center gap-3 p-6 border-2 border-dashed border-purple-100 rounded-xl group-hover:border-purple-300 transition-all">
                <ImagePlus className="h-8 w-8 text-purple-400 group-hover:text-purple-500" />
                <p className="text-purple-500 text-center">
                  {image ? image.name : "Click to upload new image (optional)"}
                </p>
                {image && (
                  <div className="mt-3 relative">
                    <img 
                      src={URL.createObjectURL(image)} 
                      alt="Preview" 
                      className="h-20 w-20 rounded-full object-cover shadow-md"
                    />
                    <button
                      type="button"
                      onClick={() => setImage(null)}
                      className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-sm hover:bg-red-50"
                    >
                      <X className="h-5 w-5 text-red-400" />
                    </button>
                  </div>
                )}
              </div>
            </label>
          </div>

          <Button 
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white h-14 rounded-xl text-lg font-semibold shadow-lg hover:shadow-purple-200 transition-all"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              'Save Changes 🌈'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default UpdateAdmin