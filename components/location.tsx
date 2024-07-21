"use client"

import Image from "next/image";
import { Divider, Avatar } from "@mui/material";
import { useTheme, useMediaQuery } from '@mui/material';



interface CircleImageProps {
  src: string;
  alt: string;
}

const CircleImage: React.FC<CircleImageProps> = ({ src, alt }) => {
  const theme = useTheme();
  
  const isXS = useMediaQuery(theme.breakpoints.only('xs'));
  const isSM = useMediaQuery(theme.breakpoints.only('sm'));
  const isLG = useMediaQuery(theme.breakpoints.up('lg'));

  const getSize = () => {
    if (isXS) return 200;
    if (isSM) return 300;
    if (isLG) return 350;
    return 400;
  };

  const size = getSize();

  return (
    <Avatar sx={{ width: size, height: size }}>
      <Image src={src} alt={alt} layout="fill" objectFit="cover" />
    </Avatar>
  );
};

const Location = () => {
  return (
    <div className="flex flex-col bg-white text-center text-black">
      <div className="p-4">
        <span className="text-5xl">Lokasi Latihan</span>
      </div>
      <Divider />
      <div className="flex flex-col lg:flex-row justify-evenly items-center p-4 gap-8">
        <div className="flex flex-col items-center">
          <CircleImage src="/court-1.png" alt="image" />
          <a
            href="https://maps.app.goo.gl/qAicKmJao7NDQ5UZ9"
            target="_blank"
            className="p-4 text-xl font-light underline"
          >
            GOR Oyuda
          </a>
        </div>
        <div className="flex flex-col items-center">
        <CircleImage src="/court-3.png" alt="image" />
          <a
            href="https://maps.app.goo.gl/6r7ekeYk4gMSR7qt7"
            target="_blank"
            className="p-4 text-xl font-light underline"
          >
            GOR Plara
          </a>
        </div>
        <div className="flex flex-col items-center">
        <CircleImage src="/court-4.png" alt="image" />
          <a
            href="https://maps.app.goo.gl/UpoeqM2ET6axPvKT8"
            target="_blank"
            className="p-4 text-xl font-light underline"
          >
            GOR Rengganis
          </a>
        </div>
      </div>
    </div>
  );
};

export default Location;
