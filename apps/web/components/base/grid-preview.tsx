"use client";

import { useEffect, useState } from "react";

export default function GridPreview() {
  const [gridConfig, setGridConfig] = useState({
    cols: 3,
    margin: 16,
    glutter: 8,
  });

  useEffect(() => {
    const updateGridConfig = () => {
      const width = window.innerWidth;

      if (width >= 1024) {
        setGridConfig({
          cols: 12,
          margin: 16,
          glutter: 8,
        });
      } else if (width >= 768) {
        setGridConfig({
          cols: 12,
          margin: 16,
          glutter: 8,
        });
      } else {
        setGridConfig({
          cols: 3,
          margin: 16,
          glutter: 8,
        });
      }
    };

    updateGridConfig();

    window.addEventListener("resize", updateGridConfig);

    return () => window.removeEventListener("resize", updateGridConfig);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen z-50 pointer-events-none"
      style={{
        paddingInline: `${gridConfig.margin}px`,
        display: "grid",
        gridTemplateColumns: `repeat(${gridConfig.cols}, minmax(0, 1fr))`,
        gap: `${gridConfig.glutter}px`,
      }}
    >
      {Array.from({ length: gridConfig.cols }).map((_, index) => (
        <div
          key={index}
          className="w-full h-full bg-blue-500/10 border-x border-blue-500/30"
        ></div>
      ))}
    </div>
  );
}
