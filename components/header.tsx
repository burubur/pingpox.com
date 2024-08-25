"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button, Divider, Box, menuItemClasses } from "@mui/material";
import { useSession, signIn, signOut } from "next-auth/react";
import {
  Typography,
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
  PersonAdd,
  Settings,
  Logout,
} from "@mui/icons-material";
import { usePathname } from "next/navigation";

const ProfileMenu: React.FC<{ signOut: () => void }> = ({ signOut }) => {
  return (
    <Paper sx={{ width: 180, maxWidth: "100%" }}>
      <MenuList>
        <MenuItem>
          <ListItemIcon>
            <AccountCircleRounded fontSize="small" />
          </ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem>
          <ListItemIcon>
            <LogoutRounded fontSize="small" />
          </ListItemIcon>
          <ListItemText onClick={signOut}>Keluar</ListItemText>
        </MenuItem>
      </MenuList>
    </Paper>
  );
};

const SignInOrSignOut = () => {
  const { data: session } = useSession();
  const avatarImageURL = session?.user?.image || "";
  const open = false;
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
      <Tooltip title="Akun">
        <IconButton
          size="small"
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <Avatar src={avatarImageURL} alt="user" />
        </IconButton>
      </Tooltip>
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
      <ProfileMenu signOut={signOut} />
    </div>
  );
};

export default Header;
