export const strokeColors = {
    // Earth & Soil
    clay: "#A0522D",
    stone: "#708090",
    sand: "#E6D7C3",

    // Trees & Bark
    oak: "#4B382A",
    willow: "#8A9A5B",
    birch: "#DCDCDC",

    // Plants & Foliage
    fern: "#4F7942",
    sage: "#9CAF88",
    moss: "#355E3B",

    // Flowers & Blooms
    rose: "#E09090",
    marigold: "#F59E0B",
    lavendar: "#E6E6FA"
} as const;


export type StrokeColor = keyof typeof strokeColors

export const backgroundColors = {
    olive: "#708238",
    eucalyptus: "#9CB1A1",
    autumn: "#9C6863",
    bark: "#6E5F52",
    ochre: "#D6C595",
};
export type BackgroundColor = keyof typeof backgroundColors


export type Stroke = {
    points: number[][];
    color: StrokeColor;
    size: number;
};

export type Drawing = {
    leaf_template: Leaf;
    background_color: BackgroundColor;
    strokes: Stroke[];
};
export type Leaf = keyof typeof leafShapes

export const leafShapes = {
  oak: `
M250 30
C220 75 175 75 145 120
C175 145 115 205 55 220
C125 260 95 330 45 375
C120 390 155 465 130 520
C190 510 225 550 250 570
C275 550 310 510 370 520
C345 465 380 390 455 375
C405 330 375 260 445 220
C385 205 325 145 355 120
C325 75 280 75 250 30
Z
`,

  rowan: `
M250 40
C205 95 185 170 170 255
C120 235 70 250 35 290
C80 315 120 340 170 360
C120 390 85 435 70 520
C145 495 205 455 250 415
C295 455 355 495 430 520
C415 435 380 390 330 360
C380 340 420 315 465 290
C430 250 380 235 330 255
C315 170 295 95 250 40
Z
`,

  hazel: `
M250 30
C145 45 55 145 65 285
C75 425 155 520 250 570
C345 520 425 425 435 285
C445 145 355 45 250 30
Z
`,

  birch: `
M250 30
C190 90 165 180 170 285
C175 395 205 495 250 570
C295 495 325 395 330 285
C335 180 310 90 250 30
Z
`,
}
