import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Camera, KeyRound, RefreshCw, Save, Upload } from 'lucide-react'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'
import { adminProfileApi } from '@/apis/admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAdminAuth } from '@/contexts/admin/AdminAuthContext'
import {
  adminAvatarSchema,
  adminPasswordSchema,
  adminProfileSchema,
} from '@/validations/admin/profile.validation'

export function AdminProfilePage() {
  const { admin, role, login, refreshUser } = useAdminAuth()

  const fullName = admin?.fullName || ''
  const email = admin?.email || ''
  const avatarText = fullName?.[0]?.toUpperCase() || 'A'
  const roleName = role?.name || role?.code || 'Admin'
  const [previewUrl, setPreviewUrl] = useState(null)
  const avatarForm = useForm({
    resolver: zodResolver(adminAvatarSchema),
  })
  const selectedAvatar = avatarForm.watch('avatar')

  const fileName = selectedAvatar && selectedAvatar.length > 0 ? selectedAvatar[0].name : null
  useEffect(() => {
    // Nếu người dùng có chọn file
    if (selectedAvatar && selectedAvatar.length > 0) {
      const file = selectedAvatar[0]
      // Tạo một URL tạm thời cho file đó
      const objectUrl = URL.createObjectURL(file)
      setPreviewUrl(objectUrl)

      // RẤT QUAN TRỌNG: Xóa URL tạm này khi component unmount hoặc chọn file khác
      // để tránh tràn bộ nhớ (Memory Leak)
      return () => URL.revokeObjectURL(objectUrl)
    } else {
      // Nếu chưa chọn hoặc reset form thì xóa preview
      setPreviewUrl(null)
    }
  }, [selectedAvatar])
  const profileForm = useForm({
    resolver: zodResolver(adminProfileSchema),
    defaultValues: { fullName },
  })

  const passwordForm = useForm({
    resolver: zodResolver(adminPasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  useEffect(() => {
    profileForm.reset({ fullName })
  }, [fullName, profileForm])

  const handleRefreshProfile = async () => {
    const res = await refreshUser()
    toast.success(res.data.message)
  }

  const handleUpdateProfile = async (data) => {
    const response = await adminProfileApi.updateProfile({
      fullName: data.fullName,
    })
    const responseData = response.data
    login(responseData.accountAdmin, responseData.role)
    toast.success(responseData.message || 'Cập nhật hồ sơ thành công!')
  }

  const handleUploadAvatar = async (data) => {
    const formData = new FormData()
    formData.append('avatar', data.avatar[0])

    const response = await adminProfileApi.uploadAvatar(formData)
    const responseData = response.data
    login(responseData.accountAdmin, responseData.role)
    avatarForm.reset()
    toast.success(responseData.message || 'Cập nhật ảnh đại diện thành công!')
  }

  const handleChangePassword = async (data) => {
    const response = await adminProfileApi.changePassword({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    })
    const responseData = response.data
    passwordForm.reset()
    toast.success(responseData.message || 'Đổi mật khẩu thành công!')
  }

  return (
    <div className="max-w-4xl space-y-5">
      <div className="bg-gradient-to-br from-violet-500 to-blue-500 rounded-lg p-8 text-white">
        <div className="flex items-center gap-5">
          {admin?.avatarUrl ? (
            <img
              src={admin.avatarUrl}
              alt={fullName}
              className="h-20 w-20 rounded-full border-2 border-white/50 object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-white/50 bg-white/30 text-3xl font-extrabold">
              {avatarText}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="truncate text-xl font-extrabold">{fullName || 'Admin'}</div>
            <div className="mt-1 truncate text-sm opacity-80">{email || 'Chưa có email'}</div>
            <div className="mt-3">
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold">🛡️ {roleName}</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white"
            onClick={handleRefreshProfile}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Làm mới
          </Button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <form
            onSubmit={profileForm.handleSubmit(handleUpdateProfile)}
            className="rounded-lg border border-gray-200 bg-white"
          >
            <div className="border-b border-gray-100 px-6 py-4">
              <h2 className="font-extrabold text-gray-800">Thông tin cá nhân</h2>
            </div>
            <div className="space-y-4 p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="fullName">Họ và tên <span className="text-red-500">*</span></Label>
                  {/* <Input
                    id="fullName"
                    className={`mt-1 ${profileForm.formState.errors.fullName ? 'border-red-500' : ''}`}
                    {...profileForm.register('fullName')}
                  /> */}
                  <Controller
                    name="fullName"
                    control={profileForm.control}
                    render={({ field }) => (
                      <Input
                        id="fullName"
                        className={`mt-1 ${profileForm.formState.errors.fullName ? 'border-red-500' : ''}`}
                        {...field} // Đẩy toàn bộ onChange, onBlur, value, ref vào đây
                      />
                    )}
                  />
                  {profileForm.formState.errors.fullName && (
                    <p className="mt-1.5 text-sm text-red-500">{profileForm.formState.errors.fullName.message}</p>
                  )}
                </div>

                <div>
                  <Label>Email</Label>
                  <Input className="mt-1" value={email} readOnly />
                </div>

                <div>
                  <Label>Vai trò</Label>
                  <Input className="mt-1" value={roleName} readOnly />
                </div>

                <div>
                  <Label>Trạng thái</Label>
                  <Input className="mt-1" value={admin?.isActive ? 'Đang hoạt động' : 'Không hoạt động'} readOnly />
                </div>
              </div>

              <Button type="submit" disabled={profileForm.formState.isSubmitting}>
                <Save className="mr-2 h-4 w-4" />
                {profileForm.formState.isSubmitting ? 'Đang lưu...' : 'Lưu thông tin'}
              </Button>
            </div>
          </form>

          <form
            onSubmit={passwordForm.handleSubmit(handleChangePassword)}
            className="rounded-lg border border-gray-200 bg-white"
          >
            <div className="border-b border-gray-100 px-6 py-4">
              <h2 className="font-extrabold text-gray-800">Đổi mật khẩu</h2>
            </div>
            <div className="space-y-4 p-6">
              <div>
                <Label htmlFor="currentPassword">Mật khẩu hiện tại <span className="text-red-500">*</span></Label>
                <Input
                  id="currentPassword"
                  className={`mt-1 ${passwordForm.formState.errors.currentPassword ? 'border-red-500' : ''}`}
                  type="password"
                  placeholder="Nhập mật khẩu hiện tại"
                  {...passwordForm.register('currentPassword')}
                />
                {passwordForm.formState.errors.currentPassword && (
                  <p className="mt-1.5 text-sm text-red-500">{passwordForm.formState.errors.currentPassword.message}</p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="newPassword">Mật khẩu mới <span className="text-red-500">*</span></Label>
                  <Input
                    id="newPassword"
                    className={`mt-1 ${passwordForm.formState.errors.newPassword ? 'border-red-500' : ''}`}
                    type="password"
                    placeholder="Ít nhất 6 ký tự"
                    {...passwordForm.register('newPassword')}
                  />
                  {passwordForm.formState.errors.newPassword && (
                    <p className="mt-1.5 text-sm text-red-500">{passwordForm.formState.errors.newPassword.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới <span className="text-red-500">*</span></Label>
                  <Input
                    id="confirmPassword"
                    className={`mt-1 ${passwordForm.formState.errors.confirmPassword ? 'border-red-500' : ''}`}
                    type="password"
                    placeholder="Nhập lại mật khẩu mới"
                    {...passwordForm.register('confirmPassword')}
                  />
                  {passwordForm.formState.errors.confirmPassword && (
                    <p className="mt-1.5 text-sm text-red-500">{passwordForm.formState.errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>

              <Button type="submit" disabled={passwordForm.formState.isSubmitting}>
                <KeyRound className="mr-2 h-4 w-4" />
                {passwordForm.formState.isSubmitting ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
              </Button>
            </div>
          </form>
        </div>

        <form
          onSubmit={avatarForm.handleSubmit(handleUploadAvatar)}
          className="h-fit rounded-lg border border-gray-200 bg-white"
        >
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 className="font-extrabold text-gray-800">Ảnh đại diện <span className="text-red-500">*</span></h2>
          </div>
          <div className="space-y-4 p-6">
            <div className="flex justify-center">
              {admin?.avatarUrl ? (
                <img
                  src={admin.avatarUrl}
                  alt={fullName}
                  className="h-28 w-28 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-violet-100 text-4xl font-extrabold text-violet-600">
                  {avatarText}
                </div>
              )}
            </div>

            <div>
              {/* <Label htmlFor="avatar" className="flex items-center gap-2">
                <Camera className="h-4 w-4" />
                Chọn ảnh mới
              </Label> */}
              {/* <Input
                id="avatar"
                type="file"
                accept="image/*"
                className={`mt-1 ${avatarForm.formState.errors.avatar ? 'border-red-500' : ''}`}
                {...avatarForm.register('avatar')}
              /> */}
              <div>
              {/* <Label className="block text-sm font-medium mb-2 text-gray-700">Tải ảnh lên</Label> */}
              
              {/* Khung viền đứt đoạn thay thế cho Input mặc định */}
              <Label
                htmlFor="avatar"
                className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                  avatarForm.formState.errors.avatar 
                    ? 'border-red-500 bg-red-50 hover:bg-red-100' 
                    : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Camera className={`w-8 h-8 mb-3 ${fileName ? 'text-violet-500' : 'text-gray-400'}`} />
                  
                  {/* Hiển thị tên file nếu đã chọn, nếu chưa thì hiện lời nhắc */}
                  {fileName ? (
                    <p className="text-sm font-semibold text-violet-600 truncate max-w-[200px]">
                      {fileName}
                    </p>
                  ) : (
                    <>
                      <p className="mb-1 text-sm text-gray-500">
                        <span className="font-semibold text-violet-600">Nhấn để chọn ảnh</span>
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG hoặc JPEG (Tối đa 2MB)</p>
                    </>
                  )}
                </div>
                
                {/* Cái ô Input thật sự thì bị giấu đi bằng class "hidden" */}
                <Input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  className="hidden" 
                  {...avatarForm.register('avatar')}
                />
              </Label>

              {/* Báo lỗi nếu có */}
              {avatarForm.formState.errors.avatar && (
                <p className="mt-1.5 text-sm text-red-500 text-center">
                  {avatarForm.formState.errors.avatar.message}
                </p>
              )}
            </div>
              {/* {avatarForm.formState.errors.avatar && (
                <p className="mt-1.5 text-sm text-red-500">{avatarForm.formState.errors.avatar.message}</p>
              )} */}

              {previewUrl && (
                <div className="mt-4 flex flex-col items-center animate-in fade-in zoom-in duration-300">
                  <span className="text-xs font-medium text-gray-500 mb-2">Ảnh chuẩn bị tải lên:</span>
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="h-24 w-24 object-cover rounded-full border-2 border-violet-200 shadow-md"
                  />
                </div>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={avatarForm.formState.isSubmitting}>
              <Upload className="mr-2 h-4 w-4" />
              {avatarForm.formState.isSubmitting ? 'Đang tải lên...' : 'Tải ảnh lên'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
