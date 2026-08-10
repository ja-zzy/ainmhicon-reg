import { getStroke } from "perfect-freehand";
import { backgroundColors, Drawing, leafShapes, strokeColors } from "./types";

type Props = {
  drawing: Drawing;
};

export function LeafArtwork({
  drawing,
}: Props) {
  const leafPath = leafShapes[drawing.leaf_template];
  const randomX = 10 + (Math.random() * 80);
  return (
    <svg
      viewBox="0 0 500 600"
      preserveAspectRatio="xMidYMid meet"
      className='w-48 transition-[width] duration-150 absolute z-10 left-0'
      style={{
        left: `${randomX}%`
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