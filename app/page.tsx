"use client";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { SessionProvider } from "next-auth/react";
import { useSession } from "next-auth/react";

import Location from "../components/location";
import Introduction from "../components/introduction";

const Home = () => {
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
