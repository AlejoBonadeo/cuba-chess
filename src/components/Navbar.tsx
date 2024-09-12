// components/Navbar.js

import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo Section */}
        <div className="text-white text-xl font-bold">
          <Link href="/">Ajedrez Cuba</Link>
        </div>

        {/* Links Section */}
        <div className="flex space-x-4 gap-10">
          <Link className="text-white text-xl" href="/">
            Lista
          </Link>
          <Link className="text-white text-xl" href="/match">
            Match
          </Link>
          <Link className="text-white text-xl" href="/match/all">
            Historial
          </Link>
          <Link className="text-white text-xl" href="/player">
            Agregar
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
