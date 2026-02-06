import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../services/auth.service'
import { useUser } from './useUser'
import { useToast } from './useToast'

export function useSettings() {
  const router = useRouter()
  const toast = useToast()
  const isCollapsed = ref(true)
  const { loadUser, updateAvatar, avatarUrl, clearAvatar } = useUser()
  const fileInput = ref<HTMLInputElement | null>(null)

  const toggleSidebar = () => {
    isCollapsed.value = !isCollapsed.value
  }

  onMounted(async () => {
    try {
      await loadUser()
    } catch (_err) {
      toast.error('Tu sesión ha caducado. Vuelve a iniciar sesión.')
      await authService.logout()
      router.push('/login')
    }
  })

  const handleLogout = async () => {
    clearAvatar()
    await authService.logout()
    router.push('/login')
  }

  const handleAvatarClick = () => {
    fileInput.value?.click()
  }

  const handleAvatarChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    
    if (!file) return
    
    if (file.size > 1024 * 1024) {
      toast.error('El archivo es demasiado grande. Máximo 1MB.')
      return
    }
    
    if (!['image/jpeg', 'image/gif', 'image/png'].includes(file.type)) {
      toast.error('Solo se permiten archivos JPG, GIF o PNG.')
      return
    }
    
    const reader = new FileReader()
    reader.onload = (e) => {
      const avatarUrl = e.target?.result as string
      updateAvatar(avatarUrl)
      toast.success('Avatar actualizado')
    }
    reader.readAsDataURL(file)
  }

  const handlePersonalInfoSubmit = () => {
    toast.success('Información personal guardada correctamente')
  }

  const handleDeleteAccount = () => {
    toast.error('Esta acción no se puede deshacer')
  }

  return {
    isCollapsed,
    avatarUrl,
    fileInput,
    toggleSidebar,
    handleLogout,
    handleAvatarClick,
    handleAvatarChange,
    handlePersonalInfoSubmit,
    handleDeleteAccount
  }
}
