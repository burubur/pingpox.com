"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Button,
  Divider,
  Avatar,
  Paper,
  Menu,
  MenuList,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  IconButton,
} from "@mui/material";
import {
  AccountCircleRounded,
  LogoutRounded,
  Logout,
} from "@mui/icons-material";
import Router from "next/router";

const ProfileMenu: React.FC<{ signOut: () => void }> = ({ signOut }) => {
  return <div></div>;
};

const SignInOrSignOut = () => {
  // tracke the html element as menu's anchor
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // handle user profile component's click event
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (anchorEl == null) {
      setAnchorEl(event.currentTarget);
    } else {
      setAnchorEl(null);
    }
  };

  // toggle off the menu by un-anchoring the element
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (path: string) => {
    handleClose();
    // router.push(path);
  };

  const handleLogout = () => {
    handleClose();
    signOut();
  };

  const { data: session } = useSession();
  const avatarImageURL = session?.user?.image || "";
  if (!session) {
    return (
      <Link
        href="/api/auth/signin"
        className="hover:border-b-4 hover:border-pink-500 p-2"
      >
        Sign In
      </Link>
    );
  } else {
    return (
      <div>
        <Tooltip title="Akun">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar src={avatarImageURL} alt="user" />
          </IconButton>
        </Tooltip>

        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem onClick={handleClose}>
            <Avatar /> My account
          </MenuItem>
          <MenuItem> 
            User Mode
          </MenuItem>
          <MenuItem> 
            Coach Mode
          </MenuItem>
          <Divider />
          <MenuItem
            onClick={() => {
              handleLogout();
            }}
          >
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </div>
    );
  }
};

const SignInOrSignOutMobile = () => {
  const { data: session } = useSession();

  if (!session) {
    return (
      <Link
        href="/api/auth/signin"
        className="hover:border-b-4 hover:border-pink-500 p-2"
      >
        Sign In
      </Link>
    );
  }
  return (
    <div className="flex flex-row gap-2">
      <Link href="/" className="self-center">
        <Button variant="contained">Profile</Button>
      </Link>
      <SignInOrSignOut />
      {/* <span className="self-center">
        <Button variant="contained" onClick={signOut}>
          Sign Out
        </Button>
      </span> */}
    </div>
  );
};

interface TypeMenu {
  urlText: string;
  urlLink: string;
  isActive?: boolean;
  onClick?: (isMobileMenuOpened: boolean) => void;
}

const CMenu: React.FC<TypeMenu> = ({ urlText, urlLink, isActive }) => {
  var className = "p-2 border-b-4 hover:border-b-4 hover:border-pink-500";
  if (isActive) {
    className += " border-pink-500";
  } else {
    className += " border-transparent";
  }

  return (
    <Link key={urlLink} href={urlLink} className={className}>
      {urlText}
    </Link>
  );
};

const CMenuMobile: React.FC<TypeMenu> = ({
  urlText,
  urlLink,
  isActive,
  onClick,
}) => {
  var className =
    "block p-2 border-b-4 hover:border-b-4 hover:border-pink-500 text-center";
  if (isActive) {
    className += " border-pink-500";
  } else {
    className += " border-transparent";
  }

  return (
    <Link
      key={urlLink}
      href={urlLink}
      className={className}
      onClick={() => {
        if (onClick != undefined) {
          onClick(false);
        }
      }}
    >
      {urlText}
    </Link>
  );
};

const Header: React.FC = () => {
  // for desktop

  // for mobile phone screen
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const { data: session } = useSession();

  // const router = useRouter();
  // const currentRoutePath = router.pathname;
  const pathName = usePathname();

  const menuItems: TypeMenu[] = [
    {
      urlText: "Pelatih",
      urlLink: "/coaches",
    },
    {
      urlText: "Kelas Latihan",
      urlLink: "/classes",
    },
    {
      urlText: "Lokasi Latihan",
      urlLink: "/locations",
    },
    {
      urlText: "Tournaments",
      urlLink: "/tournaments",
    },
    {
      urlText: "Tentang Kami",
      urlLink: "/abouts",
    },
  ];

  return (
    <div>
      <div>
        <div className="container mx-auto flex justify-between items-center p-4">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                placeholder="empty"
                priority={false}
                src="/pingpox-logo.png"
                alt="Pingpox Home"
                width={80}
                height={80}
                className="p-2"
                loading="lazy"
              />
              <span className="ml-2 font-semibold">pingpox.com</span>
            </Link>
          </div>
          <div className="hidden lg:flex space-x-4">
            {menuItems.map((item) => (
              <CMenu
                key={item.urlLink}
                urlText={item.urlText}
                urlLink={item.urlLink}
                isActive={pathName == item.urlLink}
              />
            ))}
            <SignInOrSignOut />
          </div>
          <div className="lg:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="outline-none mobile-menu-button"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M4 6h16M4 12h16m-7 6h7"></path>
              </svg>
            </button>
          </div>
        </div>
        {isOpen && (
          <div>
            {menuItems.map((item) => (
              <CMenuMobile
                key={item.urlLink}
                urlText={item.urlText}
                urlLink={item.urlLink}
                isActive={pathName == item.urlLink}
                onClick={toggleMenu}
              />
            ))}
            <div className="border-t-2 border-gray-300"></div>
            <div className="flex flex-row justify-center align-middle p-2 gap-4">
              <SignInOrSignOutMobile />
            </div>
            <div className="border-t-2 border-gray-300"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
