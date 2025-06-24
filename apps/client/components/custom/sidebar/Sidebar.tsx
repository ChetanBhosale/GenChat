import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Logo from "../Landing/Logo"
import { CreditCardIcon, FolderIcon, HomeIcon, LogOutIcon, UserIcon } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"

let iconsSize = 'w-5 h-5'

const sidebarItems = [
  {
    name : "Dashboard",
    href : "/dashboard",
    icon : <HomeIcon className={iconsSize} />
  },
  {
    name : "Projects",
    href : "/dashboard/projects",
    icon : <FolderIcon className={iconsSize} />,
  },
  {
    name : "Plans",
    href : "/dashboard/plans",
    icon : <CreditCardIcon className={iconsSize} />,
  }
]

const userData = {
  name: "John Doe",
  email: "john.doe@example.com",
  initials: "JD"
}

const SidebarDashboard = () => {
  
  const pathname = usePathname()
  return (
    <Sidebar>
      <SidebarHeader className="py-6 px-6">
        <div className="">
          <Logo />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <h1 className="">Getting Started</h1>
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-2">
            {sidebarItems.map((item) => (
              <Link 
                key={item.name} 
                href={item.href} 
                className={`flex gap-3 hover:text-gray-300 ml-4 my-4 text-gray-400 text-base font-medium transition-colors ${pathname === item.href && "text-white "}`}
              >
                {item.icon} {item.name}
              </Link>
            ))}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full h-auto p-3 justify-start hover:bg-sidebar-accent">
              <div className="flex items-center gap-3 w-full">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                  {userData.initials}
                </div>
                <div className="flex flex-col items-start text-sm">
                  <span className="font-medium text-sidebar-foreground truncate max-w-[120px]">
                    {userData.name}
                  </span>
                  <span className="text-xs text-sidebar-foreground/70 truncate max-w-[120px]">
                    {userData.email}
                  </span>
                </div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{userData.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {userData.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">
              <LogOutIcon className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

export default SidebarDashboard