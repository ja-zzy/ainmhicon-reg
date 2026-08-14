import { getStroke } from "perfect-freehand";
import { backgroundColors, Drawing, leafShapes, strokeColors } from "./types";

type Props = {
  drawing: Drawing;
  x?: number;
  y?: number;
  rotation?: number;
  scale?: number;
  className?: string;
};

export function LeafArtwork({
  drawing,
  x,
  y,
  rotation = 0,
  scale = 1,
  className = "",
}: Readonly<Props>) {
  const leafPath = leafShapes[drawing.leaf_template];
  const left = x !== undefined ? `${x}%` : undefined;
  const top = y !== undefined ? `${y}%` : undefined;
  const transform = `translate(-50%,-100%) rotate(${rotation}deg) scale(${scale})`;

  return (
    <svg
      viewBox="0 0 500 600"
      preserveAspectRatio="xMidYMid meet"
      className={`w-48 transition-[width] duration-150 absolute z-10 left-0`}
      style={{
        left,
        top,
        transform,
        transformOrigin: "bottom center",
      }}
    >
      <defs>
        <clipPath id="leafClip">
          <path d={leafPath} />
        </clipPath>
      </defs>

      {/* Background */}
      <path
        d={leafPath}
        fill={backgroundColors[drawing.background_color]}
      />

      {/* Artwork */}
      <g clipPath="url(#leafClip)">
        {drawing.strokes.map((stroke, i) => {
          const outline = getStroke(stroke.points, {
            size: stroke.size,
            smoothing: 0.6,
            streamline: 0.35,
          });

          const d = outline
            .map(([x, y], i) =>
              `${i === 0 ? "M" : "L"} ${x} ${y}`
            )
            .join(" ");

          return (
            <path
              key={i}
              d={d}
              fill={strokeColors[stroke.color]}
            />
          );
        })}
      </g>

      {/* Outline */}
      <path
        d={leafPath}
        fill="none"
        stroke="#000"
        strokeWidth={3}
      />
    </svg>
  );
}