import type { Metadata } from "next";
import "./globals.css";
import Provider from "@/app/provider";
import { ToastProvider } from "./components/Toast";
import StoreProvider from "./redux/StoreProvider";
import InitUser from "./InitUser";
import "leaflet/dist/leaflet.css";


export const metadata: Metadata = {
  title: "Delivery App",
  description: "Order items to fast delivery",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="bg-linear-to-b from-green-50 to-white w-full min-h-screen"
      >
        <Provider>
          <ToastProvider>
            <StoreProvider>
              <InitUser />
              {children}
            </StoreProvider>
          </ToastProvider>
        </Provider>
      </body>
    </html>
  );
}
