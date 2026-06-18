// Корневой макет Next.js App Router — оборачивает все страницы приложения.
// Определяет HTML-структуру, метаданные и подключает пиксельный шрифт.

import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import "./globals.css";

// Подключаем шрифт Press Start 2P — стилизованный пиксельный шрифт для ретро-эстетики.
// variable задаёт CSS-переменную --font-pixel, используемую в Tailwind и inline-стилях.
const pressStart = Press_Start_2P({
  variable: "--font-pixel",
  subsets: ["latin"],
  weight: "400", // единственный доступный начертание для этого шрифта
});

// Метаданные страницы: отображаются в заголовке вкладки браузера и превью ссылок.
export const metadata: Metadata = {
  title: "Matter of Principle",
  description: "A browser-based economic racing team simulation. One season to turn it around.",
};

// Корневой серверный компонент — рендерит <html> и <body> вокруг дочерних страниц.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode; // дочерние страницы, вставляемые Next.js автоматически через App Router
}>) {
  return (
    // lang="en" задаёт язык документа для скринридеров и поисковых систем
    // className подключает CSS-переменную шрифта и растягивает html на всю высоту экрана
    <html
      lang="en"
      className={`${pressStart.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
