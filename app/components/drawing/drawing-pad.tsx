"use client";

import { useEffect, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { getStroke } from "perfect-freehand";
import { BackgroundColor, backgroundColors, Drawing, Leaf, leafShapes, Stroke, StrokeColor, strokeColors } from "./types";
import { Eraser, PaintBucket, Palette, Pen, Redo, Save, Trash, Undo, X } from "lucide-react";
import simplify from "simplify-js";

const compressStrokes = (strokes: Stroke[]) => {
    return strokes.map(s => ({
        ...s, points:
            simplify(
                s.points.map(([x, y]) => ({
                    x: Number((Math.round(x * 100) / 100).toFixed(2)),//Math.round(x),
                    y: Number((Math.round(y * 100) / 100).toFixed(2)),//Math.round(y)
                })),
                0.1,
                true
            ).map(({ x, y }) => [x, y])
    }))

}
function getObjectSizeKB(obj: unknown) {
    const json = JSON.stringify(obj);

    const bytes = new TextEncoder().encode(json).length;

    return (bytes / 1024).toFixed(2);
}

function randomKey(o: Object) {
    const keys = Object.keys(o)
    return keys[Math.floor(Math.random() * keys.length)]
}
export function DrawingPad({ drawing = { strokes: [], background_color: randomKey(backgroundColors) as BackgroundColor, leaf_template: randomKey(leafShapes) as Leaf }, onSave }: { drawing?: Drawing, onSave: (saved: Drawing) => void }) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [strokeColor, setStrokeColor] = useState<StrokeColor>(randomKey(strokeColors) as StrokeColor);
    const [backgroundColor, setBackgroundColor] = useState<BackgroundColor>(drawing.background_color);
    const [strokeWidth, setStrokeWidth] = useState(10);
    const [tool, setTool] = useState<"draw" | "erase">("draw");
    const [selectedLeaf, setSelectedLeaf] = useState<Leaf>(drawing.leaf_template);
    const [strokes, setStrokes] = useState<Stroke[]>(drawing.strokes);
    const [currentStroke, setCurrentStroke] = useState<number[][]>([]);
    const [undoStack, setUndoStack] = useState<Stroke[][]>([]);
    const [redoStack, setRedoStack] = useState<Stroke[][]>([]);

    function commitHistory() {
        setUndoStack(prev => [...prev, strokes]);
        setRedoStack([]);
    }
    function getCanvasPoint(e: React.PointerEvent) {
        if (!canvasRef.current) { return }
        const rect = canvasRef.current.getBoundingClientRect();

        return [
            (e.clientX - rect.left) * (500 / rect.width),
            (e.clientY - rect.top) * (600 / rect.height)
        ];
    }

    function pointerDown(e: React.PointerEvent) {
        const point = getCanvasPoint(e);
        if (!point) { return }
        if (tool === "erase") {
            erase(point);
            return;
        }

        commitHistory();
        canvasRef.current?.setPointerCapture(e.pointerId);
        setCurrentStroke([point]);
    }

    function pointerMove(e: React.PointerEvent) {
        if (!currentStroke.length || tool === "erase")
            return;

        const point = getCanvasPoint(e)
        if (!point)
            return;

        setCurrentStroke(prev => [...prev, point]);
    }

    function pointerUp() {
        if (!currentStroke.length)
            return;

        setStrokes(prev => [
            ...prev,
            {
                points: currentStroke,
                color: strokeColor,
                size: strokeWidth
            }
        ]);

        setCurrentStroke([]);
    }

    function erase(point: number[]) {
        commitHistory();
        setStrokes(prev =>
            prev.filter(stroke => {
                return !stroke.points.some(p =>
                    Math.hypot(
                        p[0] - point[0],
                        p[1] - point[1]
                    ) < stroke.size * 3
                );
            })
        );
    }

    function makePath(stroke: Stroke) {
        const outline =
            getStroke(
                stroke.points,
                {
                    size: stroke.size,
                    smoothing: 0.7,
                    thinning: 0.7
                }
            );

        return outline
            .map(
                ([x, y], i) =>
                    `${i ? "L" : "M"}${x},${y}`
            )
            .join(" ");
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas)
            return;

        const ctx = canvas.getContext("2d");

        if (!ctx)
            return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.clip(new Path2D(leafShapes[selectedLeaf]));

        function drawStroke(stroke: Stroke) {
            if (!ctx) { return }
            ctx.fillStyle = strokeColors[stroke.color];
            ctx.fill(new Path2D(makePath(stroke)));
        }
        strokes.forEach(drawStroke);

        if (currentStroke.length) {
            drawStroke({
                points: currentStroke,
                color: strokeColor,
                size: strokeWidth
            });
        }
        ctx.restore();
    }, [
        strokes,
        currentStroke,
        selectedLeaf,
        strokeColor,
        strokeWidth
    ]);

    function undo() {
        const previous = undoStack.at(-1);

        if (!previous)
            return;

        setRedoStack(prev => [...prev, strokes]);
        setStrokes(previous);
        setUndoStack(prev => prev.slice(0, -1));
    }

    function redo() {
        const next = redoStack.at(-1);

        if (!next)
            return;

        setUndoStack(prev => [...prev, strokes]);
        setStrokes(next);

        setRedoStack(prev => prev.slice(0, -1));
    }

    function clear() {
        commitHistory();
        setStrokes([]);
    }

    function exportSvg() {
        const compressed: Drawing = {
            background_color: backgroundColor,
            leaf_template: selectedLeaf,
            strokes: compressStrokes(strokes)
        }

        const base: Drawing = {
            background_color: backgroundColor,
            leaf_template: selectedLeaf,
            strokes: (strokes)
        }
        console.log(`base ${getObjectSizeKB(base)}kb`)
        console.log(`compressed ${getObjectSizeKB(compressed)}kb`)
        onSave(compressed)

    }

    useHotkeys("ctrl+z", undo, { preventDefault: true })
    useHotkeys("meta+z", undo, { preventDefault: true })

    useHotkeys("shift+ctrl+z", redo, { preventDefault: true })
    useHotkeys("shift+meta+z", redo, { preventDefault: true })
    useHotkeys("ctrl+y", redo, { preventDefault: true })
    useHotkeys("meta+y", redo, { preventDefault: true })


    return (
        <div className="flex h-screen flex-col gap-4">
            <a href='/' className='absolute top-28 right-2'><UIIcon onClick={() => { }} title='Close'><X className="m-auto" /></UIIcon></a>
            <div className={`flex flex-col gap-4 h-full`}>
                <div className='flex flex-wrap gap-4 items-center'>
                    <div className="flex gap-4 md:gap-8 w-full justify-between flex-col md:flex-row">
                        <div className="flex flex-wrap justify-evenly gap-y-4 md:gap-y-8">
                            <UIIcon title='Draw' onClick={() => setTool("draw")} inactive={tool === 'erase'} noHover={tool === 'draw'}>
                                <Pen className="m-auto" />
                            </UIIcon>
                            <UIIcon onClick={() => setTool("erase")} title='Erase' inactive={tool === 'draw'} noHover={tool === 'erase'}>
                                <Eraser className="m-auto" />
                            </UIIcon>
                            <UIIcon title='Undo' onClick={undo}>
                                <Undo className="m-auto" />
                            </UIIcon>
                            <UIIcon title='Redo' onClick={redo}>
                                <Redo className="m-auto" />
                            </UIIcon>
                            <PaletteDropdown swatches={strokeColors} currentColor={strokeColor} icon='brush' onSwatchClick={(name) => {
                                setStrokeColor(name as StrokeColor);
                                setTool("draw");
                            }}
                            />
                            <PaletteDropdown swatches={backgroundColors} currentColor={backgroundColor} icon='fill' onSwatchClick={(name) => {
                                setBackgroundColor(name as BackgroundColor);
                            }}
                            />
                            <div className="dropdown">
                                <UIIcon title='Leaf shape' onClick={() => { }}>
                                    <svg width="32" viewBox="0 0 500 600" className="m-auto">
                                        <path d={leafShapes[selectedLeaf]} fill='currentcolor' />
                                    </svg>
                                </UIIcon>
                                <ul
                                    tabIndex={-1}
                                    className={`menu menu-lg dropdown-content bg-base-200 rounded-box z-1 mt-3 p-4 gap-4 shadow-lg right-0 md:left-0 top-8`}
                                >
                                    {Object.entries(leafShapes).map(([name, shape]) =>
                                        <button key={name} className='flex flex-row gap-4 items-center text-lg'
                                            onClick={() =>
                                                setSelectedLeaf(name as Leaf)
                                            }
                                        >
                                            <svg width="24" viewBox="0 0 500 600">
                                                <path d={shape} fill='currentcolor' />
                                            </svg>
                                            <span className="capitalize">
                                                {name}
                                            </span>
                                        </button>
                                    )}
                                </ul>
                            </div>
                            <div className="flex gap-2 ml-4 items-center text-nowrap">
                                Brush size
                                <input
                                    type="range"
                                    min="4"
                                    max="40"
                                    step="4"
                                    value={strokeWidth}
                                    onChange={e => setStrokeWidth(Number(e.target.value))}
                                    className="range range-neutral"
                                />
                            </div>

                        </div>

                        <div className="flex gap-2 ml-auto">

                            <UIIcon title='Save' onClick={exportSvg}>
                                <Save className="m-auto" />
                            </UIIcon>
                            <UIIcon title='Clear' onClick={clear} destructive>
                                <Trash className="m-auto" />
                            </UIIcon>
                        </div>
                    </div>
                </div>
                <div
                    className="relative flex-1 overflow-hidden rounded-xl border"
                    style={{ backgroundColor }}
                >
                    <svg
                        className="absolute inset-0 w-full m-auto"
                        viewBox="0 0 500 600"
                        preserveAspectRatio="none"
                    >
                        <path
                            d={leafShapes[selectedLeaf]}
                            fill={backgroundColors[backgroundColor]}
                            id='leafClip'
                        />
                        <foreignObject
                            x="0"
                            y="0"
                            width="500"
                            height="600"
                            clipPath="url(#leafClip)"
                        >
                            <div
                                style={{ width: "100%", height: "100%" }}
                            >
                                <canvas
                                    ref={canvasRef}
                                    width={500}
                                    height={600}

                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        touchAction: "none"
                                    }}

                                    onPointerDown={pointerDown}
                                    onPointerMove={pointerMove}
                                    onPointerUp={pointerUp}

                                />
                            </div>
                        </foreignObject>

                        {/* Leaf outline */}
                        <path
                            d={leafShapes[selectedLeaf]}
                            fill="none"
                            stroke="#999"
                            strokeWidth="3"
                            strokeDasharray="8 8"
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
}

function UIIcon({ title, onClick, destructive, inactive, noHover, bgColor, children }: { title: string, destructive?: boolean, inactive?: boolean, noHover?: boolean, bgColor?: string, onClick: () => void } & React.PropsWithChildren) {
    return (
        <button className={`rounded-xl h-10 w-10 bg-base-200 text-base-100 ${destructive && 'bg-primary text-primary-content'} ${inactive && 'grayscale-75'} transition-all duration-150 ${!noHover && 'cursor-pointer hover:brightness-125'}`} title={title} onClick={onClick}
            style={{ backgroundColor: bgColor }}>
            {children}
        </button>
    )
}

function PaletteDropdown({ swatches, currentColor, icon, onSwatchClick }: { swatches: typeof backgroundColors | typeof strokeColors, currentColor: string, icon?: 'brush' | 'fill', onSwatchClick: (color: string) => void }) {
    return (

        <div className="dropdown">
            <UIIcon title='Brush color' onClick={() => { }} bgColor={swatches[currentColor as keyof typeof swatches]}>
                {icon === 'brush' ? (<Palette className="m-auto invert mix-blend-difference" />) : <PaintBucket className="m-auto invert mix-blend-difference" />}
            </UIIcon>
            <ul
                tabIndex={-1}
                className={`menu menu-lg dropdown-content bg-base-200 rounded-box z-1 mt-3 p-2 shadow-lg grid grid-cols-3 w-55 right-0 md:left-0 top-8`}
                style={{
                    height: `${70 * Math.ceil(Object.keys(swatches).length / 3)}px`
                }}>
                {Object.entries(swatches).map(([name, color]) =>
                    <div
                        key={color}
                        className="flex flex-col items-center"
                    >
                        <button
                            onClick={() => onSwatchClick(name)}
                            className={`h-8 w-8 rounded-full transition-all duration-150 outline-black outline ${currentColor !== name && 'cursor-pointer hover:brightness-125'}`}
                            style={{
                                backgroundColor: color,
                                outlineWidth: currentColor === name ? "3px" : "0"
                            }}
                        />

                        <span className="capitalize">
                            {name}
                        </span>
                    </div>
                )
                }
            </ul>
        </div>
    )
}