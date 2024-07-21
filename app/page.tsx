import Image from "next/image"
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Button from '@mui/material/Button';
import { Divider } from '@mui/material';
import Location from "../components/location"
import Introduction from "../components/introduction"

const Home = () => {
  return (
    <main className="flex flex-col min-w-screen bg-black text-white">
      <Introduction />
      <Location />
    </main >
  );
}

export default Home;