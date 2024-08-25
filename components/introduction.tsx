import Image from "next/image";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import Button from "@mui/material/Button";
import { Divider } from "@mui/material";
import Location from "../components/location";

const Introduction = () => {
  return (
    <div className="flex-grow flex justify-center">
      <div className="w-full md:w-4/5 flex flex-col p-4">
        <div className="flex flex-col space-y-4 h-full">
          <div className="p-4 flex flex-col lg:flex-row-reverse items-center gap-4">
            <Image
              className="rounded-md w-full md:w-auto"
              width={800}
              height={400}
              alt="image"
              src="/teaching-1.png"
            ></Image>
            <div className="p-4 flex flex-col group border border-transparent rounded-lg hover:border-pink-300 space-y-4">
              <h1 className="text-3xl text-center md:text-left">
                Butuh pelatih yang berpengalaman?
              </h1>
              <p className="text-center md:text-left">
                Tingkatkan potensimu dengan pelatih tenis meja kami yang ahli
                dan berpengalaman.
                <br />
                Baik kamu pemula atau profesional, pelatih kami siap mengasah
                kemampuanmu.
                <br />
                Bergabunglah sekarang dan rasakan pelatihan berkualitas yang
                menjamin peningkatan dan kesenangan!
              </p>
              <Button
                className="self-center md:self-start"
                variant="outlined"
                color="secondary"
              >
                Booking Pelatih
              </Button>
            </div>
          </div>
          <div className="p-4 flex flex-col lg:flex-row items-center gap-4">
            <Image
              className="rounded-md w-full md:w-auto"
              width={800}
              height={400}
              alt="image"
              src="/sparing-2.png"
            ></Image>
            <div className="p-4 flex flex-col group border border-transparent rounded-lg hover:border-pink-300">
              <h1 className="text-3xl text-center md:text-left mb-4">
                Butuh lawan yang lebih jago untuk sparing?
              </h1>
              <p className="text-center md:text-left">
                Tingkatkan permainanmu dengan bertanding bersama rekan tenis
                meja kami yang sangat terampil dan berpengalaman.
                <br />
                Cocok untuk semua level, rekan-rekan kami siap memberikan
                tantangan dan dukungan yang kamu butuhkan untuk berkembang.
                <br />
                Bergabunglah sekarang dan pesan sesi sparing untuk mengasah
                keterampilanmu ke tingkat yang lebih tinggi!
              </p>
              <Button
                className="self-center md:self-end"
                variant="outlined"
                color="secondary"
              >
                Booking Teman Sparing
              </Button>
            </div>
          </div>
          <div className="p-4 flex flex-col lg:flex-row-reverse items-center gap-4">
          <Image
              className="rounded-md w-full lg:w-auto"
              width={800}
              height={400}
              alt="image"
              src="/court-5.png"
            ></Image>
            <div className="p-4 flex flex-col group border border-transparent rounded-lg hover:border-pink-300 space-y-4">
              <h1 className="text-2xl text-center md:text-left">
                Bagaimana platform pingpox bekerja?
              </h1>
              <p className="text-center md:text-left">
                Temukan kemudahan sistem otomatis kami yang memungkinkan Anda
                dengan mudah
                <br />
                memesan pelatih, mencari rekan sparring, dan bahkan memesan
                lapangan/meja.
                <br />
                Hanya dengan beberapa klik, PingPox memastikan Anda
                <br />
                memiliki segala yang dibutuhkan untuk pengalaman tenis meja yang
                efektif.
                <br />
                Bergabung sekarang dan tingkatkan permainan Anda dengan
                kemudahan dan efisiensi platform kami!
                <br />
                Dan jangan lupa, kami juga secara berkala menyelenggarakan
                turnamen dan event menarik lainnya!
                <br />
              </p>
              <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-4">
                <Button
                  className="self-center md:self-start"
                  variant="outlined"
                  color="secondary"
                >
                  Explore Lebih Lanjut
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Introduction;
