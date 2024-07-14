import Image from "next/image"
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Button from '@mui/material/Button';
import { Divider } from '@mui/material';

interface CircleImageProps {
  src: string;
  alt: string;
  size: string;
}

const CircleImage: React.FC<CircleImageProps> = ({ src, alt, size }) => {
  return (
    <div className={`relative overflow-hidden rounded-full`} style={{ width: size, height: size }}>
      <Image src={src} alt={alt} layout="fill" className="object-cover" />
    </div>
  );
};


export default function Home() {
  return (
    <main className="flex flex-col min-w-screen min-h-screen bg-black text-white">
      <div className="flex-grow flex justify-center">
        <div className="w-4/5 flex flex-col p-4">
          <div className="flex flex-col space-y-4 h-full">
            <div className="p-4 flex flex-row-reverse items-center gap-4">
              <div className="p-4 flex flex-col group border border-transparent rounded-lg hover:border-pink-300 space-y-4">
                <h1 className="text-3xl items-center">Butuh pelatih yang berpengalaman?</h1>
                <p>
                  Tingkatkan potensimu dengan pelatih tenis meja kami yang ahli dan berpengalaman.<br />
                  Baik kamu pemula atau profesional, pelatih kami siap mengasah kemampuanmu.<br />
                  Bergabunglah sekarang dan rasakan pelatihan berkualitas yang menjamin peningkatan dan kesenangan!
                </p>
                <Button className="self-start" variant="outlined" color="secondary">Booking Pelatih</Button>
              </div>
              <Image className="rounded-md" width={800} height={400} alt="image" src="/teaching-1.png"></Image>
            </div>
            <div className="p-4 flex flex-row items-center gap-4">
              <div className="p-4 flex flex-col group border border-transparent rounded-lg hover:border-pink-300">
                <h1 className="text-3xl items-center mb-4">Butuh lawan yang lebih jago untuk sparing?</h1>
                <p>
                  Tingkatkan permainanmu dengan bertanding bersama rekan tenis meja kami yang sangat terampil dan berpengalaman.<br />
                  Cocok untuk semua level, rekan-rekan kami siap memberikan tantangan dan dukungan yang kamu butuhkan untuk berkembang.<br />
                  Bergabunglah sekarang dan pesan sesi sparing untuk mengasah keterampilanmu ke tingkat yang lebih tinggi!
                </p>
                <Button className="self-end" variant="outlined" color="secondary">Booking Teman Sparing</Button>
              </div>
              <Image className="rounded-md" width={800} height={400} alt="image" src="/sparing-2.png"></Image>
            </div>
            <div className="p-4 flex flex-row-reverse items-center gap-4">
              <div className="p-4 flex flex-col group border border-transparent rounded-lg hover:border-pink-300 space-y-4">
                <h1 className="text-2xl items-center">Bagaimana platform pingpox bekerja?</h1>
                <p>
                  Temukan kemudahan sistem otomatis kami yang memungkinkan Anda dengan mudah<br />
                  memesan pelatih, mencari rekan sparring, dan bahkan memesan lapangan/meja.<br />
                  Hanya dengan beberapa klik, PingPox memastikan Anda<br />
                  memiliki segala yang dibutuhkan untuk pengalaman tenis meja yang efektif.<br />
                  Bergabung sekarang dan tingkatkan permainan Anda dengan kemudahan dan efisiensi platform kami!<br />
                  Dan jangan lupa, kami juga secara berkala menyelenggarakan turnamen dan event menarik lainnya!<br />
                </p>
                <div className="flex flex-row items-center justify-center gap-4">
                  <Button className="self-start" variant="outlined" color="secondary">Explore Lebih Lanjut</Button>
                  atau
                  <Button className="self-start" variant="outlined" color="secondary">Pantau Project Pingpox</Button>
                </div>
              </div>
              <Image className="rounded-md" width={800} height={400} alt="image" src="/court-5.png"></Image>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col bg-white text-center text-black">
        <div className="m-4">
          <span className="text-5xl">Lokasi Latihan</span>
        </div>
        <Divider />
        <div className="flex flex-row justify-evenly items-center p-4">
          <div>
            <CircleImage src="/court-5.png" alt="Circle Image" size="400px" />
            <br />
            <a href="https://maps.app.goo.gl/qAicKmJao7NDQ5UZ9" target="_blank" className="p-4 text-xl font-light underline">GOR Oyuda</a>
          </div>
          <div>
            <CircleImage src="/court-3.png" alt="Circle Image" size="400px" />
            <br />
            <a href="https://maps.app.goo.gl/6r7ekeYk4gMSR7qt7" target="_blank" className="p-4 text-xl font-light underline">GOR Plara</a>
          </div>
          <div>
            <CircleImage src="/court-4.png" alt="Circle Image" size="400px" />
            <br />
            <a href="https://maps.app.goo.gl/UpoeqM2ET6axPvKT8" target="_blank" className="p-4 text-xl font-light underline">GOR Rengganis</a>
          </div>
        </div>
      </div>
    </main >
  );
}
