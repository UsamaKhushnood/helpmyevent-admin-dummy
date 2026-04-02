export const isImage = (fileType) => {
  return fileType && fileType.startsWith('image/')
}

export const notImage = (fileType) => {
  return !fileType || !fileType.startsWith('image/')
}


export const getFileSize = (fileSizeInBytes) => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let index = 0
  let size = fileSizeInBytes

  while (size >= 1024 && index < units.length - 1) {
    size /= 1024
    index++
  }

  return `${size.toFixed(2)} ${units[index]}`
}

export const getDeviceName = () => {
  const userAgent = navigator.userAgent
  if (/android/i.test(userAgent)) return 'Android Device'
  if (/iPad|iPhone|iPod/.test(userAgent)) return 'iOS Device'
  if (/windows/i.test(userAgent)) return 'Windows PC'
  if (/macintosh/i.test(userAgent)) return 'Macintosh'
  if (/linux/i.test(userAgent)) return 'Linux PC'
  return 'Unknown Device'
}

export const getIpAddress = async () => {
  try {
    const response = await fetch('https://api.ipify.org?format=json')
    const data = await response.json()
    return data.ip
  } catch (error) {
    console.error('Error fetching IP:', error)
    return '0.0.0.0'
  }
}

export const getLocation = async () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

export const downloadFile = (fileUrl) => {
  const link = document.createElement('a')
  link.href = fileUrl
  link.setAttribute('target', 'blank')
  link.setAttribute('download', 'true')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  return 'success'
}

export const getInitials = (name) => {
  if (!name) return ''
  const names = name.split(' ')
  if (names.length === 1) return names[0].substring(0, 2).toUpperCase()
  return names.map((n) => n[0]).join('').toUpperCase()
}

export const formatDatetime = (date) => {
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const formatDate = (date) => {
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  })
}

export const formatFileSize = (bytes) => {
  if (!bytes) return
  const units = ['B', 'KB', 'MB', 'GB']
  let size = bytes
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`
}

export const formatTime = (date) => {
  return new Date(date).toLocaleString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
}