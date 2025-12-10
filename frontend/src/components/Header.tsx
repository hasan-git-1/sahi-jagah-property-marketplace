import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home,
  Search,
  Add,
  Favorite,
  CalendarMonth,
  Message,
  Person,
  Logout,
  Login,
  Notifications,
} from '@mui/icons-material';
import { NotificationBell } from './NotificationBell';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { messagingService } from '../services/messagingService';

export const Header: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      loadUnreadCount();
      // Poll for unread count every 30 seconds
      const interval = setInterval(loadUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const loadUnreadCount = async () => {
    try {
      const count = await messagingService.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Failed to load unread count:', error);
    }
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleProfileMenuClose();
    navigate('/');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
    handleProfileMenuClose();
  };

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { label: 'Home', path: '/', icon: <Home />, public: true },
    { label: 'Search', path: '/search', icon: <Search />, public: true },
    { label: 'Properties', path: '/properties', icon: <Home />, public: true },
  ];

  const authenticatedMenuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <Home /> },
    { label: 'Create Listing', path: '/properties/create', icon: <Add />, roles: ['owner', 'agent'] },
    { label: 'Favorites', path: '/favorites', icon: <Favorite /> },
    { label: 'Bookings', path: '/bookings', icon: <CalendarMonth /> },
    { label: 'Messages', path: '/messages', icon: <Message />, badge: unreadCount },
    { label: 'Profile', path: '/profile', icon: <Person /> },
  ];

  const canAccessMenuItem = (item: any) => {
    if (!item.roles) return true;
    return item.roles.includes(user?.role);
  };

  const renderDesktopMenu = () => (
    <>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        {menuItems.map((item) => (
          <Button
            key={item.path}
            color="inherit"
            onClick={() => handleNavigation(item.path)}
            sx={{
              fontWeight: isActive(item.path) ? 600 : 400,
              borderBottom: isActive(item.path) ? 2 : 0,
              borderRadius: 0,
            }}
          >
            {item.label}
          </Button>
        ))}
      </Box>

      <Box sx={{ flexGrow: 1 }} />

      {isAuthenticated ? (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {authenticatedMenuItems
            .filter(canAccessMenuItem)
            .map((item) => (
              <IconButton
                key={item.path}
                color="inherit"
                onClick={() => handleNavigation(item.path)}
                sx={{
                  bgcolor: isActive(item.path) ? 'rgba(255,255,255,0.1)' : 'transparent',
                }}
              >
                <Badge badgeContent={item.badge || 0} color="error">
                  {item.icon}
                </Badge>
              </IconButton>
            ))}

          <NotificationBell />

          <IconButton onClick={handleProfileMenuOpen} sx={{ ml: 1 }}>
            <Avatar src={user?.photoURL} alt={user?.name} sx={{ width: 32, height: 32 }}>
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem disabled>
              <Box>
                <Typography variant="subtitle2">{user?.name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.email || user?.phone}
                </Typography>
              </Box>
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => handleNavigation('/profile')}>
              <ListItemIcon>
                <Person fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button color="inherit" onClick={() => handleNavigation('/login')}>
            Login
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleNavigation('/signup')}
          >
            Sign Up
          </Button>
        </Box>
      )}
    </>
  );

  const renderMobileMenu = () => (
    <>
      <IconButton
        color="inherit"
        edge="start"
        onClick={() => setMobileMenuOpen(true)}
        sx={{ mr: 2 }}
      >
        <MenuIcon />
      </IconButton>

      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        Sahi Jagah
      </Typography>

      {isAuthenticated && (
        <IconButton color="inherit" onClick={() => handleNavigation('/messages')}>
          <Badge badgeContent={unreadCount} color="error">
            <Message />
          </Badge>
        </IconButton>
      )}

      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      >
        <Box sx={{ width: 280 }} role="presentation">
          <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
            {isAuthenticated ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar src={user?.photoURL} alt={user?.name}>
                  {user?.name?.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1">{user?.name}</Typography>
                  <Typography variant="caption">{user?.email || user?.phone}</Typography>
                </Box>
              </Box>
            ) : (
              <Typography variant="h6">Sahi Jagah</Typography>
            )}
          </Box>

          <List>
            {menuItems.map((item) => (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  selected={isActive(item.path)}
                  onClick={() => handleNavigation(item.path)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}

            {isAuthenticated && (
              <>
                <Divider sx={{ my: 1 }} />
                {authenticatedMenuItems
                  .filter(canAccessMenuItem)
                  .map((item) => (
                    <ListItem key={item.path} disablePadding>
                      <ListItemButton
                        selected={isActive(item.path)}
                        onClick={() => handleNavigation(item.path)}
                      >
                        <ListItemIcon>
                          <Badge badgeContent={item.badge || 0} color="error">
                            {item.icon}
                          </Badge>
                        </ListItemIcon>
                        <ListItemText primary={item.label} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                <Divider sx={{ my: 1 }} />
                <ListItem disablePadding>
                  <ListItemButton onClick={handleLogout}>
                    <ListItemIcon>
                      <Logout />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                  </ListItemButton>
                </ListItem>
              </>
            )}

            {!isAuthenticated && (
              <>
                <Divider sx={{ my: 1 }} />
                <ListItem disablePadding>
                  <ListItemButton onClick={() => handleNavigation('/login')}>
                    <ListItemIcon>
                      <Login />
                    </ListItemIcon>
                    <ListItemText primary="Login" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton onClick={() => handleNavigation('/signup')}>
                    <ListItemIcon>
                      <Person />
                    </ListItemIcon>
                    <ListItemText primary="Sign Up" />
                  </ListItemButton>
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );

  return (
    <AppBar position="sticky">
      <Toolbar>
        {isMobile ? (
          renderMobileMenu()
        ) : (
          <>
            <Typography
              variant="h6"
              component="div"
              sx={{ mr: 4, cursor: 'pointer', fontWeight: 700 }}
              onClick={() => handleNavigation('/')}
            >
              Sahi Jagah
            </Typography>
            {renderDesktopMenu()}
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};
