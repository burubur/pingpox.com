import Image from "next/image"
import { Divider } from "@mui/material";

interface CircleImageProps {
    src: string;
    alt: string;
    size: string;
  }
  
  const CircleImage: React.FC<CircleImageProps> = ({ src, alt, size }) => {
    return (
      <div className={`relative overflow-hidden rounded-full w-64 h-64 md:w-96 md:h-96`} style={{ width: size, height: size }}>
        <Image src={src} alt={alt} layout="fill" className="object-cover" />
      </div>
    );
  };

  const Location = () => {
    return (
      <div className="flex flex-col bg-white text-center text-black">
        <div className="m-4">
          <span className="text-5xl">Lokasi Latihan</span>
        </div>
        <Divider />
        <div className="flex flex-col md:flex-row justify-evenly items-center p-4 gap-8">
          <div className="flex flex-col items-center">
            <CircleImage src="/court-5.png" alt="Circle Image"  />
            <br />
            <a
              href="https://maps.app.goo.gl/qAicKmJao7NDQ5UZ9"
              target="_blank"
              className="p-4 text-xl font-light underline"
            >
              GOR Oyuda
            </a>
          </div>
          <div className="flex flex-col items-center">
            <CircleImage src="/court-3.png" alt="Circle Image" />
            <br />
            <a
              href="https://maps.app.goo.gl/6r7ekeYk4gMSR7qt7"
              target="_blank"
              className="p-4 text-xl font-light underline"
            >
              GOR Plara
            </a>
          </div>
          <div className="flex flex-col items-center">
            <CircleImage src="/court-4.png" alt="Circle Image" />
            <br />
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
  }
  

export default Location;