"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Divider } from "@mui/material";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="bg-black text-white sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image
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
          <Link
            href="/coaches"
            className="hover:border-b-4 hover:border-pink-500 p-2"
          >
            Pelatih
          </Link>
          <Link
            href="/classes"
            className="hover:border-b-4 hover:border-pink-500 p-2"
          >
            Kelas Latihan
          </Link>
          <Link
            href="/locations"
            className="hover:border-b-4 hover:border-pink-500 p-2"
          >
            Lokasi Latihan
          </Link>
          <Link
            href="/tournaments"
            className="hover:border-b-4 hover:border-pink-500 p-2"
          >
            Turnamen
          </Link>
          <Link
            href="/abouts"
            className="hover:border-b-4 hover:border-pink-500 p-2"
          >
            Tentang Kami
          </Link>
          <Link
            href="/authentications"
            className="hover:border-b-4 hover:border-pink-500 p-2"
          >
            Daftar | Login
          </Link>
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
          <div className="lg:hidden flex flex-col items-center space-y-4">
            <Link
              href="/coaches"
              className="block p-2 border-red-500 hover:border-b-4 hover:border-pink-500 text-center"
            >
              Pelatih
            </Link>
            <Link
              href="/classes"
              className="block p-2 hover:border-b-4 hover:border-pink-500 text-center"
            >
              Kelas Latihan
            </Link>
            <Link
              href="/locations"
              className="block p-2 hover:border-b-4 hover:border-pink-500 text-center"
            >
              Lokasi Latihan
            </Link>
            <Link
              href="/tournaments"
              className="block p-2 hover:border-b-4 hover:border-pink-500 text-center"
            >
              Turnamen
            </Link>
            <Link
              href="/abouts"
              className="block p-2 hover:border-b-4 hover:border-pink-500 text-center"
            >
              Tentang Kami
            </Link>
          </div>
          <div className="border-t-2 border-gray-300"></div>
          <Link
            href="/authentications"
            className="block p-2 hover:border-b-4 hover:border-pink-500 text-center py-4"
          >
            Daftar | Login
          </Link>
          <div className="border-t-2 border-gray-300"></div>
        </div>
      )}
    </header>
  );
};

export default Header;
