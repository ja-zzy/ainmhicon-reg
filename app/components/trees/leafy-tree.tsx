"use client";

import { useEffect, useRef, useState } from "react";
import { LeafArtwork } from "../drawing/leaf-svg";

type Props = {
    count?: number;
}

type LeafPosition = {
    left: number;
    top: number;
    rotation: number;
    scale: number;
}

function randomLeafType(): "oak" | "elm" | "alder" | "willow" {
  const leaves = ["oak", "elm", "alder", "willow"];

  return leaves[Math.floor(Math.random()*leaves.length)] as "oak" | "elm" | "alder" | "willow";
}

export function LeafyTree({ count = 50 }: Readonly<Props>) {
    const svgRef = useRef<SVGSVGElement | null>(null);
    const pathRef = useRef<SVGPathElement | null>(null);
    const [leaves, setLeaves] = useState<LeafPosition[]>([]);

    useEffect(() => {
        const svg = svgRef.current;
        const path = pathRef.current;
        if (!svg || !path) return;

        const pathLength = path.getTotalLength();
        const rect = svg.getBoundingClientRect();
        const screenCTM = svg.getScreenCTM();
        if (!screenCTM) return;

        const includeTopPercent = 70;
        const leafPositionList: LeafPosition[] = [];

        while (leafPositionList.length < count) {
            const len = Math.random() * pathLength;
            const pt = path.getPointAtLength(len);

            const svgPoint = svg.createSVGPoint();
            svgPoint.x = pt.x; svgPoint.y = pt.y;
            const screenPoint = svgPoint.matrixTransform(screenCTM);

            const left = ((screenPoint.x - rect.left) / rect.width) * 100;
            const top = ((screenPoint.y - rect.top) / rect.height) * 100;

            const rotation = (left * 2.2) - (225 * Math.random());
            const leafScale = 0.3 + Math.random() * 0.3;

            if (top > includeTopPercent) {
                continue;
            }

            const leafToPlace = {
                left: Math.max(0, Math.min(100, left)),
                top: Math.max(0, Math.min(100, top)),
                rotation: rotation,
                scale: leafScale,
            };

            const minDistance = 2.5 + leafToPlace.scale * 8;
            const leavesOverlap = leafPositionList.some((leaf) => {
                const dx = leaf.left - leafToPlace.left;
                const dy = leaf.top - leafToPlace.top;
                return Math.hypot(dx, dy) < minDistance;
            });

            if (!leavesOverlap) {
                leafPositionList.push(leafToPlace);
            }
        }

        setLeaves(leafPositionList);
    }, [count]);

    return (
        <div className="relative">
            <svg ref={svgRef}
                width="163.55569mm"
                height="165.52312mm"
                viewBox="0 0 618.16327 625.59919"
                version="1.1"
                id="svg1"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="#614e20"
                strokeWidth="3.40157"
                strokeLinecap="round"
                strokeMiterlimit="3.5"
                strokeOpacity="1">
                <path ref={pathRef}
                    d="m 171.69372,623.46403 
                c 28.77923,-2.49103 47.63627,-3.2119 86.16636,-47.14409 8.48398,17.87111 28.40179,30.02531 52.1869,40.24586 -11.78967,-20.93998 -2.06493,-23.43902 3.11905,-29.83016 56.74993,15.73514 118.27655,38.36996 153.05497,22.36847 -68.07878,-79.51566 -173.05714,-58.82388 -125.547,-236.54076 61.53387,-64.8275 98.33452,-27.21763 124.84683,30.53034 25.13545,21.90357 46.0612,47.31524 85.69958,57.13304 36.18117,1.50974 47.24631,-10.93388 61.21398,-21.76497 -20.8581,3.18169 -41.71619,13.4131 -62.57429,0
                l 28.56652,-14.96341
                c -0.48797,-21.74006 -55.6764,15.57969 -77.53772,-5.44125 -23.62205,-29.73713 0.56562,-31.79496 24.4856,-34.00776
                l 32.64746,-6.80156
                c -34.78858,-5.85442 -82.36008,-6.59567 -93.86144,-21.76497 -51.26249,-52.15864 30.23469,-34.94383 64.03127,-39.84744 36.75909,-11.94481 71.75033,-28.53022 88.32353,-93.463 -25.26851,33.06011 -48.75344,68.7956 -93.86145,72.09646 33.43658,-25.74726 40.16247,-54.83336 32.64747,-85.69957 -5.07004,62.02402 -54.76237,79.42147 -100.19621,78.56795 23.54263,-16.79521 40.9718,-41.93751 49.46628,-66.25679 -23.38241,41.10377 -69.27592,56.61693 -112.50736,67.94717 28.40793,-54.55602 44.14805,-108.50881 19.04435,-160.51666 
                l 19.04435,-21.76498 
                C 487.39001,98.976465 546.84582,94.365035 589.30911,67.096935 608.32188,46.285715 612.37794,23.812635 608.35346,0.44171234 595.75854,47.273575 572.37814,56.356285 549.8601,68.457245
                l 25.8459,-50.3315
                c -29.14174,28.30375 -50.57466,63.67392 -108.82486,65.29492
                l 9.52217,-43.52995
                c -23.16206,29.35387 -47.01885,56.44986 -80.25833,53.05212
                l 4.91301,-67.63582
                c -16.993,44.07877 -23.11187,17.57236 -45.15887,-6.57777 23.7147,58.18597 14.6593,92.977595 17.12058,120.464165 -0.24061,44.99559 -18.10836,46.60129 -51.69181,9.52218
                C 316.45966,82.540435 227.09408,47.979005 207.0618,61.655695
                c 53.16584,19.63957 56.20618,26.74777 70.73615,36.72838 5.36247,25.001075 17.85831,56.116455 -28.56652,36.728405 -36.30927,-19.84681 -66.70418,-42.059375 -77.53771,-72.096475
                v 29.92683
                C 182.47527,109.8063 197.03666,128.2897 190.73807,137.8331 152.00614,125.23701 112.89669,113.06565 94.156002,77.979415 74.592152,109.56279 131.43662,135.68841 181.21589,162.3187
                c 93.64525,27.2217 141.18945,16.00731 152.3548,29.92683 39.00462,28.49588 7.65208,49.58575 2.72062,73.45678
                l -78.89802,80.25833 -10.88248,-8.16187
                c -7.02077,-22.02472 -42.24821,-26.42027 -68.01554,-36.72839 -44.38674,-14.18044 -66.4031,-36.96488 -77.53772,-63.9346 -6.536418,13.47757 -2.411718,34.06255 21.76499,68.01554
                C 64.411032,299.93988 26.663782,277.32791 1.6548725,243.93734 12.145262,288.16578 59.631592,309.27176 110.47974,328.2766
                c 60.50645,0.0388 81.57521,34.25701 104.74392,66.65522 -21.48183,28.14455 -12.84968,36.54986 -11.25259,67.25873 40.79514,35.67448 16.00567,115.91263 5.81135,127.26571 z
                " />
            </svg>
            {leaves.map((p, i) => (
                <LeafArtwork
                    key={i}
                    drawing={{ leaf_template: randomLeafType(), background_color: 'olive', strokes: [] }}
                    x={p.left}
                    y={p.top}
                    rotation={p.rotation}
                    scale={p.scale}
                />
            ))}
        </div>
    )
}