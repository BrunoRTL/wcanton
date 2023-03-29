
import SourceIcon from '@mui/icons-material/Source';
import SendIcon from '@mui/icons-material/Send';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AddCircleIcon from '@mui/icons-material/AddCircle';


export interface MenuItem {
  icon: any,
  label: string,
  path: string
}

export const drawerWidth = 200;

export const menuItems: MenuItem[] = [
  {icon:SourceIcon,label: 'My Asset Accounts', path: '/' },
  {icon:SendIcon, label: 'Pending Activities', path: '/pending' }, 
  {icon:AddCircleIcon,label: 'Create', path: '/create'},
  {icon:AccountBalanceWalletIcon,label: "Transaction History", path:'/transactions'}
]

export const sideMenuSx = {
  width: drawerWidth,
  flexShrink: 0,
  [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
}
export const helpMenuDrawerSx = {
  width: 400,
  flexShrink: 0,
  zIndex: 0,
  [`& .MuiDrawer-paper`]: { width: 300, boxSizing: "border-box" },
}