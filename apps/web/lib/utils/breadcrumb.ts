import { usePathname } from 'next/navigation'

export interface BreadcrumbItem {
  label: string
  href: string
  isCurrentPage: boolean
}

// Mapping of route paths to user-friendly labels
const pathLabelMap: Record<string, string> = {
  '/': 'Home',
  '/dashboard': 'Dashboard',
  '/symptom-checker': 'Symptom Checker',
  '/health-records': 'Health Records',
  '/pharmacy': 'Pharmacy',
  '/book-consultation': 'Book Consultation',
  '/consultation': 'Consultation',
  '/register': 'Register',
}

// Function to get label for a path segment
function getPathLabel(path: string): string {
  // Check direct mapping first
  if (pathLabelMap[path]) {
    return pathLabelMap[path]
  }
  
  // Handle dynamic routes (e.g., /consultation/[id])
  if (path.includes('/consultation/') && path !== '/consultation') {
    return 'Video Call'
  }
  
  // Fallback: capitalize and format the path segment
  const segment = path.split('/').pop() || ''
  return segment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Custom hook to generate breadcrumb items
export function useBreadcrumbs(): BreadcrumbItem[] {
  const pathname = usePathname()
  
  // Always start with Home
  const breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Home',
      href: '/',
      isCurrentPage: pathname === '/'
    }
  ]
  
  // Don't add additional breadcrumbs for home page
  if (pathname === '/') {
    return breadcrumbs
  }
  
  // Split the pathname and build breadcrumbs
  const pathSegments = pathname.split('/').filter(segment => segment !== '')
  let currentPath = ''
  
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`
    const isLast = index === pathSegments.length - 1
    
    breadcrumbs.push({
      label: getPathLabel(currentPath),
      href: currentPath,
      isCurrentPage: isLast
    })
  })
  
  return breadcrumbs
}