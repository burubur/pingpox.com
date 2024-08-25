"use client";

import Image from "next/image";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { Divider } from "@mui/material";
import Location from "../components/location";
import Introduction from "../components/introduction";
import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { User, getServerSession } from "next-auth";
import { Button, Typography } from "@mui/material";
import { useSession, signIn, signOut } from "next-auth/react";

const Home = ({ Component, pageProps }: AppProps) => {
  const { data: session } = useSession();
  console.log("fetching session data");
  console.log(session);

  return (
    <SessionProvider>
      <div>
        <Introduction />
        <Location />
      </div>
    </SessionProvider>
  );
};

export default Home;
