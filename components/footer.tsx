import Link from "next/link";
import Image from "next/image";
import { PiYoutubeLogo, PiInstagramLogo, PiTiktokLogo } from "react-icons/pi";

const Footer = () => {
  return (
    <div
      id="footer"
      className="flex flex-col md:flex-row gap-4 p-4 bottom-0 left-0 right-0 bg-black text-white"
    >
      <div
        id="footer-l"
        className="basis-full md:basis-1/3 p-5 transition-colors group border border-transparent rounded-lg hover:border-pink-300 hover:dark:bg-neutral-800/10 hover:text-pink-300 text-center md:text-left"
      >
        <div className="flex justify-center md:justify-start">
          <Image
            src="/pingpox-logo.png"
            alt="Pingpox Home"
            width={60}
            height={60}
          />
        </div>
        <div className="pt-4 pb-2">
          <pre>pingpox.com</pre>
        </div>
        <p className="font-thin text-xs">
          Adalah platform olahraga tenis meja berbasis teknologi dan beroperasi
          24/7, mulai dari penyewaan meja, janjian dengan pelatih dan juga
          berlangganan kelas latihan dan penyelenggaraan pertandigan/turnamen
          terotomasi
        </p>
        <p className="font-thin text-xs pt-4">v0.5.0</p>
      </div>
      <div
        id="footer-c"
        className="basis-full md:basis-1/3 p-5 transition-colors border border-transparent rounded-lg hover:border-pink-300 hover:dark:bg-neutral-800/10 hover:text-pink-300 text-center md:text-left"
      >
        <div className="flex flex-col space-y-2">
          <span className="mb-4 font-semibold">Link Terkait</span>
          <Link href="/events">
            <span className="hover:text-pink-500">Events</span>
          </Link>
          <Link href="/members">
            <span className="hover:text-pink-500">Membership</span>
          </Link>
          <Link href="/tournaments">
            <span className="hover:text-pink-500">
              Penyelenggaraan Turnamen
            </span>
          </Link>
          <Link href="/franchises">
            <span className="hover:text-pink-500">Kerjasama Franchise</span>
          </Link>
          <Link href="/inquiries">
            <span className="hover:text-pink-500">Narahubung</span>
          </Link>
          <Link
            target="_blank"
            href="https://github.com/users/burubur/projects/6"
          >
            <span className="hover:text-pink-500">Project Pingpox</span>
          </Link>
        </div>
      </div>
      <div
        id="footer-r"
        className="basis-full md:basis-1/3 p-5 transition-colors border border-transparent rounded-lg hover:border-pink-300 hover:dark:bg-neutral-800/10 hover:text-pink-300 text-center md:text-left"
      >
        <div className="flex flex-col space-y-2">
          <span className="mb-4 font-semibold  justify-center md:justify-start">
            Media Sosial Kami
          </span>
          <div className="flex space-x-4  justify-center md:justify-start">
            <a href="#" className="hover:text-pink-500">
              <PiYoutubeLogo title="Youtube" size="36px" />
            </a>
            <a href="#" className="hover:text-pink-500">
              <PiInstagramLogo title="Youtube" size="36px" />
            </a>
            <a href="#" className="hover:text-pink-500">
              <PiTiktokLogo title="Youtube" size="36px" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
