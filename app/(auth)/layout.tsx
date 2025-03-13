import { Inter } from "next/font/google";
import "@/app/globals.css";
import Image from "next/image";
import authBg from "@/public/auth-bg.png";
import { ToastContainer } from "react-toastify";

const inter = Inter({
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-purple-100 flex justify-center items-center h-screen max-sm:px-8`}
      >
        <main className="bg-white rounded-lg shadow-xl flex xl:w-1/2 md:w-3/4 max-md:w-1/2 max-sm:w-full">
          <div className="max-w-5/12 bg-purple-500 rounded-tl-lg rounded-bl-lg flex items-center max-md:hidden">
            <Image src={authBg} alt="auth bg" className="w-xl h-[60vh]" />
          </div>
          <div className="flex-1">{children}</div>
        </main>
        <ToastContainer />
      </body>
    </html>
  );
}
