// UI components for the OIR Dashboard application
// Layout components for the main application structure

import React, { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { logout } from '../../features/auth/authSlice';
import themeConfig from '../../config/theme';

// Icons (would be imported from a library like Material UI or Lucide in a real implementation)
const DashboardIcon = () => <span>📊</span>;
const OrganizationsIcon = () => <span>🏢</span>;
const AgreementsIcon = () => <span>📝</span>;
const BallotsIcon = () => <span>🗳️</span>;
const TrainingsIcon = () => <span>🎓</span>;
const ComplianceIcon = () => <span>✓</span>;
const DocumentsIcon = () => <span>📁</span>;
const ReportsIcon = () => <span>📈</span>;
const SettingsIcon = () => <span>⚙️</span>;
const NotificationsIcon = () => <span>🔔</span>;
const UserIcon = () => <span>👤</span>;
const LogoutIcon = () => <span>🚪</span>;
const MenuIcon = () => <span>☰</span>;

// Header component
interface HeaderProps {
  toggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header
      style={{
        height: `${themeConfig.components.header.height}px`,
        backgroundColor: themeConfig.components.header.bgColor,
        color: themeConfig.components.header.textColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button
          onClick={toggleSidebar}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.5rem',
            marginRight: '15px',
          }}
        >
          <MenuIcon />
        </button>
        <h1 style={{ margin: 0, fontSize: '1.2rem' }}>OIR Dashboard</h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'relative', marginRight: '20px' }}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.2rem',
            }}
          >
            <NotificationsIcon />
          </button>
          {notificationsOpen && (
            <div
              style={{
                position: 'absolute',
                top: '40px',
                right: 0,
                width: '300px',
                backgroundColor: 'white',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                borderRadius: '8px',
                padding: '10px',
                zIndex: 1001,
              }}
            >
              <h3>Notifications</h3>
              <div>
                <p>No new notifications</p>
              </div>
            </div>
          )}
        </div>

        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <UserIcon />
            <span style={{ marginLeft: '8px' }}>
              {user ? `${user.firstName} ${user.lastName}` : 'User'}
            </span>
          </button>
          {userMenuOpen && (
            <div
              style={{
                position: 'absolute',
                top: '40px',
                right: 0,
                width: '200px',
                backgroundColor: 'white',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                borderRadius: '8px',
                padding: '10px',
                zIndex: 1001,
              }}
            >
              <div
                style={{
                  padding: '10px',
                  borderBottom: '1px solid #eee',
                }}
              >
                <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>
                  {user ? `${user.firstName} ${user.lastName}` : 'User'}
                </p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#666' }}>
                  {user ? user.email : 'user@example.com'}
                </p>
              </div>
              <div style={{ padding: '10px 0' }}>
                <Link
                  to="/profile"
                  style={{
                    display: 'block',
                    padding: '8px 10px',
                    textDecoration: 'none',
                    color: '#333',
                  }}
                >
                  Profile
                </Link>
                <Link
                  to="/settings"
                  style={{
                    display: 'block',
                    padding: '8px 10px',
                    textDecoration: 'none',
                    color: '#333',
                  }}
                >
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px 10px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#d32f2f',
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

// Sidebar component
interface SidebarProps {
  isOpen: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);

  // Define menu items based on user role
  const menuItems = [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: <DashboardIcon />,
      roles: ['ADMIN', 'REGISTRAR', 'DEPUTY_REG', 'INSPECTOR', 'REG_OFFICER', 'DB_ADMIN', 'DATA_ENTRY', 'LIAISON', 'ADMIN_ASST'],
    },
    {
      title: 'Organizations',
      path: '/organizations',
      icon: <OrganizationsIcon />,
      roles: ['ADMIN', 'REGISTRAR', 'DEPUTY_REG', 'INSPECTOR', 'REG_OFFICER', 'DB_ADMIN', 'DATA_ENTRY', 'LIAISON'],
    },
    {
      title: 'Agreements',
      path: '/agreements',
      icon: <AgreementsIcon />,
      roles: ['ADMIN', 'REGISTRAR', 'DEPUTY_REG', 'REG_OFFICER', 'DB_ADMIN', 'DATA_ENTRY'],
    },
    {
      title: 'Ballots',
      path: '/ballots',
      icon: <BallotsIcon />,
      roles: ['ADMIN', 'REGISTRAR', 'DEPUTY_REG', 'INSPECTOR', 'DB_ADMIN'],
    },
    {
      title: 'Trainings',
      path: '/trainings',
      icon: <TrainingsIcon />,
      roles: ['ADMIN', 'REGISTRAR', 'DEPUTY_REG', 'DB_ADMIN', 'LIAISON', 'ADMIN_ASST'],
    },
    {
      title: 'Compliance',
      path: '/compliance',
      icon: <ComplianceIcon />,
      roles: ['ADMIN', 'REGISTRAR', 'DEPUTY_REG', 'INSPECTOR', 'DB_ADMIN'],
    },
    {
      title: 'Documents',
      path: '/documents',
      icon: <DocumentsIcon />,
      roles: ['ADMIN', 'REGISTRAR', 'DEPUTY_REG', 'REG_OFFICER', 'DB_ADMIN', 'DATA_ENTRY', 'ADMIN_ASST'],
    },
    {
      title: 'Reports',
      path: '/reports',
      icon: <ReportsIcon />,
      roles: ['ADMIN', 'REGISTRAR', 'DEPUTY_REG', 'DB_ADMIN'],
    },
    {
      title: 'Settings',
      path: '/settings',
      icon: <SettingsIcon />,
      roles: ['ADMIN', 'DB_ADMIN'],
    },
  ];

  // Filter menu items based on user role
  const filteredMenuItems = user
    ? menuItems.filter((item) => item.roles.includes(user.role.roleCode))
    : menuItems;

  return (
    <aside
      style={{
        width: isOpen ? `${themeConfig.components.sidebar.width}px` : `${themeConfig.components.sidebar.closedWidth}px`,
        backgroundColor: themeConfig.components.sidebar.bgColor,
        color: themeConfig.components.sidebar.textColor,
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        paddingTop: `${themeConfig.components.header.height}px`,
        transition: 'width 0.3s ease',
        boxShadow: '2px 0 5px rgba(0,0,0,0.05)',
        zIndex: 900,
        overflowX: 'hidden',
        overflowY: 'auto',
      }}
    >
      <nav style={{ padding: '20px 0' }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {filteredMenuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 20px',
                  textDecoration: 'none',
                  color: location.pathname === item.path
                    ? themeConfig.components.sidebar.activeTextColor
                    : themeConfig.components.sidebar.textColor,
                  backgroundColor: location.pathname === item.path
                    ? themeConfig.components.sidebar.activeBgColor
                    : 'transparent',
                  borderLeft: location.pathname === item.path
                    ? `4px solid ${themeConfig.colors.primary.main}`
                    : '4px solid transparent',
                  transition: 'background-color 0.2s',
                }}
              >
                <span style={{ fontSize: '1.2rem', marginRight: '10px' }}>{item.icon}</span>
                {isOpen && <span>{item.title}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

// Main layout component
interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar isOpen={sidebarOpen} />
      <Header toggleSidebar={toggleSidebar} />
      <main
        style={{
          flexGrow: 1,
          marginLeft: sidebarOpen
            ? `${themeConfig.components.sidebar.width}px`
            : `${themeConfig.components.sidebar.closedWidth}px`,
          marginTop: `${themeConfig.components.header.height}px`,
          padding: '20px',
          transition: 'margin-left 0.3s ease',
          backgroundColor: themeConfig.colors.background.default,
        }}
      >
        {children}
      </main>
    </div>
  );
};

// Card component for dashboard widgets
interface CardProps {
  title: string;
  children: ReactNode;
  fullWidth?: boolean;
}

export const Card: React.FC<CardProps> = ({ title, children, fullWidth = false }) => {
  return (
    <div
      style={{
        backgroundColor: themeConfig.colors.background.paper,
        borderRadius: themeConfig.components.card.borderRadius,
        boxShadow: themeConfig.components.card.boxShadow,
        padding: '20px',
        marginBottom: '20px',
        width: fullWidth ? '100%' : 'auto',
      }}
    >
      <h2 style={{ margin: '0 0 15px 0', fontSize: '1.2rem' }}>{title}</h2>
      {children}
    </div>
  );
};

// Stat card component for dashboard metrics
interface StatCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  color?: string;
  change?: number;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color = themeConfig.colors.primary.main,
  change,
}) => {
  return (
    <div
      style={{
        backgroundColor: themeConfig.colors.background.paper,
        borderRadius: themeConfig.components.card.borderRadius,
        boxShadow: themeConfig.components.card.boxShadow,
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div>
        <h3 style={{ margin: '0 0 5px 0', fontSize: '0.9rem', color: '#666' }}>{title}</h3>
        <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 'bold' }}>{value}</p>
        {change !== undefined && (
          <p
            style={{
              margin: '5px 0 0 0',
              fontSize: '0.8rem',
              color: change >= 0 ? themeConfig.colors.success.main : themeConfig.colors.error.main,
            }}
          >
            {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
          </p>
        )}
      </div>
      <div
        style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          backgroundColor: `${color}20`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          color: color,
        }}
      >
        {icon}
      </div>
    </div>
  );
};

// Button component
interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'text';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  type = 'button',
}) => {
  // Get color based on variant
  const getColor = () => {
    switch (variant) {
      case 'primary':
        return themeConfig.colors.primary;
      case 'secondary':
        return themeConfig.colors.secondary;
      case 'success':
        return themeConfig.colors.success;
      case 'warning':
        return themeConfig.colors.warning;
      case 'error':
        return themeConfig.colors.error;
      case 'info':
        return themeConfig.colors.info;
      case 'text':
        return { main: 'transparent', contrastText: themeConfig.colors.primary.main };
      default:
        return themeConfig.colors.primary;
    }
  };

  // Get padding based on size
  const getPadding = () => {
    switch (size) {
      case 'small':
        return '6px 12px';
      case 'medium':
        return '8px 16px';
      case 'large':
        return '10px 20px';
      default:
        return '8px 16px';
    }
  };

  // Get font size based on size
  const getFontSize = () => {
    switch (size) {
      case 'small':
        return '0.8rem';
      case 'medium':
        return '0.875rem';
      case 'large':
        return '1rem';
      default:
        return '0.875rem';
    }
  };

  const color = getColor();

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        backgroundColor: variant === 'text' ? 'transparent' : color.main,
        color: variant === 'text' ? color.contrastText : color.contrastText,
        border: variant === 'text' ? 'none' : '1px solid transparent',
        borderRadius: themeConfig.components.button.borderRadius,
        padding: getPadding(),
        fontSize: getFontSize(),
        fontWeight: 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.7 : 1,
        width: fullWidth ? '100%' : 'auto',
        transition: 'background-color 0.2s, box-shadow 0.2s',
        textTransform: 'none',
        boxShadow: variant === 'text' ? 'none' : '0 1px 3px rgba(0,0,0,0.1)',
      }}
    >
      {children}
    </button>
  );
};

// Input component
interface InputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  fullWidth = false,
  disabled = false,
}) => {
  return (
    <div
      style={{
        marginBottom: '15px',
        width: fullWidth ? '100%' : 'auto',
      }}
    >
      <label
        style={{
          display: 'block',
          marginBottom: '5px',
          fontSize: '0.875rem',
          fontWeight: 500,
        }}
      >
        {label} {required && <span style={{ color: themeConfig.colors.error.main }}>*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        style={{
          width: '100%',
          padding: '8px 12px',
          fontSize: '0.875rem',
          border: `1px solid ${error ? themeConfig.colors.error.main : themeConfig.colors.grey[300]}`,
          borderRadius: themeConfig.components.input.borderRadius,
          backgroundColor: disabled ? themeConfig.colors.grey[100] : 'white',
          color: disabled ? themeConfig.colors.text.disabled : themeConfig.colors.text.primary,
        }}
      />
      {error && (
        <p
          style={{
            margin: '5px 0 0 0',
            fontSize: '0.75rem',
            color: themeConfig.colors.error.main,
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
};

// Select component
interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps {
  label: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  error?: string;
  required?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  label,
  value,
  onChange,
  options,
  error,
  required = false,
  fullWidth = false,
  disabled = false,
}) => {
  return (
    <div
      style={{
        marginBottom: '15px',
        width: fullWidth ? '100%' : 'auto',
      }}
    >
      <label
        style={{
          display: 'block',
          marginBottom: '5px',
          fontSize: '0.875rem',
          fontWeight: 500,
        }}
      >
        {label} {required && <span style={{ color: themeConfig.colors.error.main }}>*</span>}
      </label>
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        style={{
          width: '100%',
          padding: '8px 12px',
          fontSize: '0.875rem',
          border: `1px solid ${error ? themeConfig.colors.error.main : themeConfig.colors.grey[300]}`,
          borderRadius: themeConfig.components.input.borderRadius,
          backgroundColor: disabled ? themeConfig.colors.grey[100] : 'white',
          color: disabled ? themeConfig.colors.text.disabled : themeConfig.colors.text.primary,
          appearance: 'none',
          backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 8px center',
          backgroundSize: '16px',
        }}
      >
        <option value="">Select...</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p
          style={{
            margin: '5px 0 0 0',
            fontSize: '0.75rem',
            color: themeConfig.colors.error.main,
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
};

// Table component
interface TableColumn {
  id: string;
  label: string;
  render?: (value: any, row: any) => ReactNode;
}

interface TableProps {
  columns: TableColumn[];
  data: any[];
  loading?: boolean;
  emptyMessage?: string;
}

export const Table: React.FC<TableProps> = ({
  columns,
  data,
  loading = false,
  emptyMessage = 'No data available',
}) => {
  return (
    <div
      style={{
        width: '100%',
        overflowX: 'auto',
      }}
    >
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
        }}
      >
        <thead>
          <tr
            style={{
              backgroundColor: themeConfig.components.table.headerBgColor,
              borderBottom: `1px solid ${themeConfig.components.table.borderColor}`,
            }}
          >
            {columns.map((column) => (
              <th
                key={column.id}
                style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                }}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td
                colSpan={columns.length}
                style={{
                  padding: '16px',
                  textAlign: 'center',
                  color: themeConfig.colors.text.secondary,
                }}
              >
                Loading...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                style={{
                  padding: '16px',
                  textAlign: 'center',
                  color: themeConfig.colors.text.secondary,
                }}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                style={{
                  borderBottom: `1px solid ${themeConfig.components.table.borderColor}`,
                  ':hover': {
                    backgroundColor: themeConfig.components.table.hoverColor,
                  },
                }}
              >
                {columns.map((column) => (
                  <td
                    key={`${rowIndex}-${column.id}`}
                    style={{
                      padding: '12px 16px',
                      fontSize: '0.875rem',
                    }}
                  >
                    {column.render
                      ? column.render(row[column.id], row)
                      : row[column.id]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

// Badge component
interface BadgeProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'primary' }) => {
  // Get color based on variant
  const getColor = () => {
    switch (variant) {
      case 'primary':
        return themeConfig.colors.primary;
      case 'secondary':
        return themeConfig.colors.secondary;
      case 'success':
        return themeConfig.colors.success;
      case 'warning':
        return themeConfig.colors.warning;
      case 'error':
        return themeConfig.colors.error;
      case 'info':
        return themeConfig.colors.info;
      default:
        return themeConfig.colors.primary;
    }
  };

  const color = getColor();

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '0.75rem',
        fontWeight: 500,
        backgroundColor: `${color.main}20`,
        color: color.main,
      }}
    >
      {label}
    </span>
  );
};

// Alert component
interface AlertProps {
  children: ReactNode;
  severity?: 'success' | 'warning' | 'error' | 'info';
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({
  children,
  severity = 'info',
  onClose,
}) => {
  // Get color based on severity
  const getColor = () => {
    switch (severity) {
      case 'success':
        return themeConfig.colors.success;
      case 'warning':
        return themeConfig.colors.warning;
      case 'error':
        return themeConfig.colors.error;
      case 'info':
        return themeConfig.colors.info;
      default:
        return themeConfig.colors.info;
    }
  };

  const color = getColor();

  return (
    <div
      style={{
        padding: '12px 16px',
        borderRadius: '8px',
        backgroundColor: `${color.main}10`,
        border: `1px solid ${color.main}30`,
        color: color.main,
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div>{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1rem',
            color: color.main,
          }}
        >
          ×
        </button>
      )}
    </div>
  );
};

// Pagination component
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if total pages is less than or equal to max pages to show
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      // Calculate start and end page numbers
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if at the beginning or end
      if (currentPage <= 2) {
        endPage = 4;
      } else if (currentPage >= totalPages - 1) {
        startPage = totalPages - 3;
      }
      
      // Add ellipsis if needed
      if (startPage > 2) {
        pages.push('...');
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Add ellipsis if needed
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '20px',
      }}
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          padding: '6px 12px',
          backgroundColor: 'white',
          border: `1px solid ${themeConfig.colors.grey[300]}`,
          borderRadius: '4px 0 0 4px',
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
          opacity: currentPage === 1 ? 0.5 : 1,
        }}
      >
        Previous
      </button>
      
      {getPageNumbers().map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          disabled={page === '...'}
          style={{
            padding: '6px 12px',
            backgroundColor: currentPage === page ? themeConfig.colors.primary.main : 'white',
            color: currentPage === page ? 'white' : themeConfig.colors.text.primary,
            border: `1px solid ${themeConfig.colors.grey[300]}`,
            borderLeft: 'none',
            cursor: page === '...' ? 'default' : 'pointer',
          }}
        >
          {page}
        </button>
      ))}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{
          padding: '6px 12px',
          backgroundColor: 'white',
          border: `1px solid ${themeConfig.colors.grey[300]}`,
          borderLeft: 'none',
          borderRadius: '0 4px 4px 0',
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
          opacity: currentPage === totalPages ? 0.5 : 1,
        }}
      >
        Next
      </button>
    </div>
  );
};

// Modal component
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1100,
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          width: '90%',
          maxWidth: '500px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            padding: '16px 20px',
            borderBottom: `1px solid ${themeConfig.colors.grey[200]}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <h2 style={{ margin: 0, fontSize: '1.2rem' }}>{title}</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: themeConfig.colors.grey[500],
            }}
          >
            ×
          </button>
        </div>
        
        <div
          style={{
            padding: '20px',
            overflowY: 'auto',
          }}
        >
          {children}
        </div>
        
        {footer && (
          <div
            style={{
              padding: '16px 20px',
              borderTop: `1px solid ${themeConfig.colors.grey[200]}`,
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px',
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

// Tabs component
interface Tab {
  label: string;
  id: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => {
  return (
    <div
      style={{
        borderBottom: `1px solid ${themeConfig.colors.grey[300]}`,
        marginBottom: '20px',
      }}
    >
      <div
        style={{
          display: 'flex',
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              padding: '12px 16px',
              background: 'none',
              border: 'none',
              borderBottom: `2px solid ${
                activeTab === tab.id
                  ? themeConfig.colors.primary.main
                  : 'transparent'
              }`,
              color:
                activeTab === tab.id
                  ? themeConfig.colors.primary.main
                  : themeConfig.colors.text.primary,
              fontWeight: activeTab === tab.id ? 500 : 400,
              cursor: 'pointer',
              transition: 'color 0.2s, border-color 0.2s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

// File upload component
interface FileUploadProps {
  label: string;
  onChange: (file: File | null) => void;
  accept?: string;
  error?: string;
  required?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  onChange,
  accept,
  error,
  required = false,
}) => {
  const [fileName, setFileName] = useState<string>('');
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setFileName(file.name);
      onChange(file);
    } else {
      setFileName('');
      onChange(null);
    }
  };

  return (
    <div
      style={{
        marginBottom: '15px',
      }}
    >
      <label
        style={{
          display: 'block',
          marginBottom: '5px',
          fontSize: '0.875rem',
          fontWeight: 500,
        }}
      >
        {label} {required && <span style={{ color: themeConfig.colors.error.main }}>*</span>}
      </label>
      
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <input
          type="file"
          onChange={handleFileChange}
          accept={accept}
          style={{ display: 'none' }}
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          style={{
            padding: '8px 16px',
            backgroundColor: themeConfig.colors.primary.main,
            color: 'white',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.875rem',
          }}
        >
          Choose File
        </label>
        <span
          style={{
            marginLeft: '10px',
            fontSize: '0.875rem',
            color: fileName ? themeConfig.colors.text.primary : themeConfig.colors.text.secondary,
          }}
        >
          {fileName || 'No file chosen'}
        </span>
      </div>
      
      {error && (
        <p
          style={{
            margin: '5px 0 0 0',
            fontSize: '0.75rem',
            color: themeConfig.colors.error.main,
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
};

// Checkbox component
interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  onChange,
  disabled = false,
}) => {
  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.7 : 1,
        marginBottom: '10px',
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        style={{
          marginRight: '8px',
        }}
      />
      <span style={{ fontSize: '0.875rem' }}>{label}</span>
    </label>
  );
};

// Radio component
interface RadioProps {
  label: string;
  value: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  disabled?: boolean;
}

export const Radio: React.FC<RadioProps> = ({
  label,
  value,
  checked,
  onChange,
  name,
  disabled = false,
}) => {
  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.7 : 1,
        marginBottom: '10px',
      }}
    >
      <input
        type="radio"
        value={value}
        checked={checked}
        onChange={onChange}
        name={name}
        disabled={disabled}
        style={{
          marginRight: '8px',
        }}
      />
      <span style={{ fontSize: '0.875rem' }}>{label}</span>
    </label>
  );
};

// Textarea component
interface TextareaProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  rows?: number;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  fullWidth = false,
  disabled = false,
  rows = 4,
}) => {
  return (
    <div
      style={{
        marginBottom: '15px',
        width: fullWidth ? '100%' : 'auto',
      }}
    >
      <label
        style={{
          display: 'block',
          marginBottom: '5px',
          fontSize: '0.875rem',
          fontWeight: 500,
        }}
      >
        {label} {required && <span style={{ color: themeConfig.colors.error.main }}>*</span>}
      </label>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        style={{
          width: '100%',
          padding: '8px 12px',
          fontSize: '0.875rem',
          border: `1px solid ${error ? themeConfig.colors.error.main : themeConfig.colors.grey[300]}`,
          borderRadius: themeConfig.components.input.borderRadius,
          backgroundColor: disabled ? themeConfig.colors.grey[100] : 'white',
          color: disabled ? themeConfig.colors.text.disabled : themeConfig.colors.text.primary,
          resize: 'vertical',
        }}
      />
      {error && (
        <p
          style={{
            margin: '5px 0 0 0',
            fontSize: '0.75rem',
            color: themeConfig.colors.error.main,
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
};

// DatePicker component (simplified version)
interface DatePickerProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  min?: string;
  max?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onChange,
  error,
  required = false,
  fullWidth = false,
  disabled = false,
  min,
  max,
}) => {
  return (
    <div
      style={{
        marginBottom: '15px',
        width: fullWidth ? '100%' : 'auto',
      }}
    >
      <label
        style={{
          display: 'block',
          marginBottom: '5px',
          fontSize: '0.875rem',
          fontWeight: 500,
        }}
      >
        {label} {required && <span style={{ color: themeConfig.colors.error.main }}>*</span>}
      </label>
      <input
        type="date"
        value={value}
        onChange={onChange}
        disabled={disabled}
        min={min}
        max={max}
        style={{
          width: '100%',
          padding: '8px 12px',
          fontSize: '0.875rem',
          border: `1px solid ${error ? themeConfig.colors.error.main : themeConfig.colors.grey[300]}`,
          borderRadius: themeConfig.components.input.borderRadius,
          backgroundColor: disabled ? themeConfig.colors.grey[100] : 'white',
          color: disabled ? themeConfig.colors.text.disabled : themeConfig.colors.text.primary,
        }}
      />
      {error && (
        <p
          style={{
            margin: '5px 0 0 0',
            fontSize: '0.75rem',
            color: themeConfig.colors.error.main,
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
};

// Breadcrumbs component
interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <div
      style={{
        marginBottom: '20px',
        fontSize: '0.875rem',
      }}
    >
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span style={{ margin: '0 8px', color: themeConfig.colors.grey[400] }}>/</span>}
          {item.path && index !== items.length - 1 ? (
            <Link
              to={item.path}
              style={{
                color: themeConfig.colors.primary.main,
                textDecoration: 'none',
              }}
            >
              {item.label}
            </Link>
          ) : (
            <span
              style={{
                color: index === items.length - 1 ? themeConfig.colors.text.primary : themeConfig.colors.primary.main,
                fontWeight: index === items.length - 1 ? 500 : 400,
              }}
            >
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

// Export all components
export default {
  Header,
  Sidebar,
  MainLayout,
  Card,
  StatCard,
  Button,
  Input,
  Select,
  Table,
  Badge,
  Alert,
  Pagination,
  Modal,
  Tabs,
  FileUpload,
  Checkbox,
  Radio,
  Textarea,
  DatePicker,
  Breadcrumbs,
};
