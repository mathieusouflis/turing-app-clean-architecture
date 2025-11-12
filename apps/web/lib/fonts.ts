// import localFont from "next/font/local";

// export const switzer = localFont({
//   src: [
//     {
//       path: "../app/fonts/SwitzerVF.woff2",
//       weight: "100 900",
//       style: "normal",
//     },
//     {
//       path: "../app/fonts/SwitzerVF-Italic.woff2",
//       weight: "100 900",
//       style: "italic",
//     },
//   ],
//   variable: "--switzer",
//   display: "swap",
// });

// export const gambeta = localFont({
//   src: [
//     {
//       path: "../app/fonts/GambettaVF.woff2",
//       weight: "100 900",
//       style: "normal",
//     },
//     {
//       path: "../app/fonts/GambettaVF-Italic.woff2",
//       weight: "100 900",
//       style: "italic",
//     },
//   ],
//   variable: "--gambeta",
//   display: "swap",
// });

// export type FontName = "sans" | "serif";

// export const fontsMap = {
//   sans: switzer,
//   serif: gambeta,
// } as const;

// export function getFontsVariables(): string {
//   return Object.values(fontsMap)
//     .map((font) => font.variable)
//     .join(" ");
// }

// export function getFontClass(fontName: FontName): string {
//   return fontsMap[fontName].className;
// }

// export function getAllFonts() {
//   return fontsMap;
// }
