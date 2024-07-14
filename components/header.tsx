import Image from "next/image"
import Link from 'next/link';

const Header = () => {
    return (
        <div className="flex justify-between sticky top-0 bg-black text-white">
            <div className="brand">
                <Link href="/" className="brand flex items-center">
                    <span >
                        <Image src='/pingpox-logo.png' alt="Pingpox Home" width={80} height={80} className="p-2" />
                    </span>
                    <span className="align-middle font-semibold">
                        pingpox.com
                    </span>
                </Link>
            </div>
            <div className="place-self-center p-2 m-2 font-light">
                <Link href='/coaches'>
                    <span className="m-4 p-2 hover:border-b-4 hover:border-pink-500">
                        Pelatih
                    </span>
                </Link>
                <Link href="/classes">
                    <span className="m-4 p-2 hover:border-b-4 hover:border-pink-500">
                        Kelas Latihan
                    </span>
                </Link>
                <Link href="/locations">
                    <span className="m-4 p-2 hover:border-b-4 hover:border-pink-500">
                        Lokasi Latihan
                    </span>
                </Link>
                <Link href="/tournaments">
                    <span className="m-4 p-2 hover:border-b-4 hover:border-pink-500">
                        Turnamen
                    </span>
                </Link>
                <Link href="/abouts">
                    <span className="m-4 p-2 hover:border-b-4 hover:border-pink-500">
                        Tentang Kami
                    </span>
                </Link>
                <Link href="/authentications">
                    <span className="m-4 p-2 hover:border-b-4 hover:border-pink-500">
                        Daftar | Login
                    </span>
                </Link>
            </div>
        </div>
    )
}

export default Header