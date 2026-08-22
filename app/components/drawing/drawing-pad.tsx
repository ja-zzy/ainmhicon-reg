'use client';

import { useRef, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { getStroke } from 'perfect-freehand';
import { BackgroundColor, backgroundColors, Drawing, Leaf, leafShapes, Stroke, StrokeColor, strokeColors } from './types';
import { Eraser, PaintBucket, Palette, Pen, Redo, Save, Trash, Undo, X } from 'lucide-react';

const MIN_POINT_DISTANCE = 1.5;

function getObjectSizeKB(obj: unknown) {
    const json = JSON.stringify(obj);

    const bytes = new TextEncoder().encode(json).length;

    return Number((bytes / 1024).toFixed(2));
}

function randomKey(o: Object) {
    const keys = Object.keys(o)
    return keys[Math.floor(Math.random() * keys.length)]
}
interface Props {
    drawing?: Drawing;
    onSave: (saved: Drawing) => void;
}

export function DrawingPad({ drawing, onSave }: Props) {
    const svgRef = useRef<SVGSVGElement | null>(null);
    const [strokeColor, setStrokeColor] = useState<StrokeColor>(randomKey(strokeColors) as StrokeColor);
    const [backgroundColor, setBackgroundColor] = useState<BackgroundColor>(drawing ? drawing.background_color : randomKey(backgroundColors) as BackgroundColor);
    const [strokeWidth, setStrokeWidth] = useState(10);
    const [tool, setTool] = useState<'draw' | 'erase'>('draw');
    const [selectedLeaf, setSelectedLeaf] = useState<Leaf>(drawing ? drawing.leaf_template : randomKey(leafShapes) as Leaf);
    const [strokes, setStrokes] = useState<Stroke[]>(drawing ? drawing.strokes : []);
    const [currentStroke, setCurrentStroke] = useState<number[][]>([]);
    const [undoStack, setUndoStack] = useState<Stroke[][]>([]);
    const [redoStack, setRedoStack] = useState<Stroke[][]>([]);
    const [showSizeError, setShowSizeError] = useState(false)

    function commitHistory() {
        setUndoStack(prev => [...prev, strokes]);
        setRedoStack([]);
    }
    function getSvgPoint(e: React.PointerEvent) {
        if (!svgRef.current) {
            return;
        }

        const svg = svgRef.current;
        const point = svg.createSVGPoint();

        point.x = e.clientX;
        point.y = e.clientY;

        const ctm = svg.getScreenCTM();

        if (!ctm) {
            return;
        }

        const transformed = point.matrixTransform(ctm.inverse());

        return [transformed.x, transformed.y];
    }

    function pointerDown(e: React.PointerEvent) {
        const point = getSvgPoint(e);
        if (!point) { return }

        commitHistory();
        svgRef.current?.setPointerCapture(e.pointerId);
        setCurrentStroke([point]);
    }
    function pointerMove(e: React.PointerEvent) {
        if (e.buttons !== 1) { return }
        e.preventDefault();
        const point = getSvgPoint(e);

        if (!point)
            return;

        if (!currentStroke.length)
            return;

        setCurrentStroke(prev => {
            const last = prev[prev.length - 1];

            if (
                Math.hypot(
                    point[0] - last[0],
                    point[1] - last[1]
                ) < MIN_POINT_DISTANCE
            ) {
                return prev;
            }

            return [...prev, point];
        });
    }

    function pointerUp() {
        if (!currentStroke.length)
            return;

        const newStroke: Stroke =
            tool === 'erase'
                ? {
                      type: 'eraser',
                      points: currentStroke,
                      size: strokeWidth
                  }
                : {
                      type: 'stroke',
                      points: currentStroke,
                      color: strokeColor,
                      size: strokeWidth
                  };

        setStrokes(prev => [...prev, newStroke]);

        setCurrentStroke([]);
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

    function getStrokeFill(stroke: Stroke) {
        if (stroke.type === 'eraser') {
            return backgroundColors[backgroundColor];
        }

        return strokeColors[stroke.color];
    }

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
            strokes
        }
        const objSize = getObjectSizeKB(compressed)
        console.log(`${objSize}kb`)
        if (objSize > 1024) {
            setShowSizeError(true)
        } else {
            onSave(compressed)
        }

    }

    useHotkeys("ctrl+z", undo, { preventDefault: true })
    useHotkeys("meta+z", undo, { preventDefault: true })

    useHotkeys("shift+ctrl+z", redo, { preventDefault: true })
    useHotkeys("shift+meta+z", redo, { preventDefault: true })
    useHotkeys("ctrl+y", redo, { preventDefault: true })
    useHotkeys("meta+y", redo, { preventDefault: true })


    return (
        <>
            <div className="flex h-screen flex-col gap-4">
                <a href='/' className='absolute top-28 right-2'><UIIcon title='Close'><X className="m-auto" /></UIIcon></a>
                <div className={`flex flex-col gap-4 h-full bg-base-200 rounded-2xl`}>
                    <div className='flex flex-wrap gap-4 items-center'>
                        <div className="flex gap-4 md:gap-8 w-full justify-between flex-col md:flex-row">
                            <div className="flex flex-wrap justify-between gap-y-4 md:gap-y-8">
                                <UIIcon title='Draw' onClick={() => setTool("draw")} activeTool={tool === 'draw'} noHover={tool === 'draw'}>
                                    <Pen className="m-auto" />
                                </UIIcon>
                                <UIIcon onClick={() => setTool("erase")} title='Erase' activeTool={tool === 'erase'} noHover={tool === 'erase'}>
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
                                    <UIIcon title='Leaf shape'>
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
                        className="relative flex-1 overflow-hidden rounded-xl border bg-neutral"
                    >
                        <svg
                            ref={svgRef}
                            className="absolute inset-0 w-full h-full m-auto"
                            viewBox="0 0 500 600"
                            preserveAspectRatio="xMidYMid meet"
                            style={{
                                touchAction: "none"
                            }}
                            onPointerDown={pointerDown}
                            onPointerMove={pointerMove}
                            onPointerUp={pointerUp}
                            onPointerCancel={pointerUp}
                        >
                            <defs>
                                <clipPath id="leafClip">
                                    <path d={leafShapes[selectedLeaf]} />
                                </clipPath>
                            </defs>

                            <path
                                d={leafShapes[selectedLeaf]}
                                fill={backgroundColors[backgroundColor]}
                            />

                            <g clipPath="url(#leafClip)">
                                {strokes.map((stroke, i) =>
                                        <path
                                            key={i}
                                            d={makePath(stroke)}
                                            fill={getStrokeFill(stroke)}
                                        />
                                )}

                                {currentStroke.length > 0 && (
                                    <path
                                        d={makePath(
                                            tool === 'erase'
                                                ? {
                                                      type: 'eraser',
                                                      points: currentStroke,
                                                      size: strokeWidth
                                                  }
                                                : {
                                                      type: 'stroke',
                                                      points: currentStroke,
                                                      color: strokeColor,
                                                      size: strokeWidth
                                                  }
                                        )}
                                        fill={tool === 'erase' ? backgroundColors[backgroundColor] : strokeColors[strokeColor]}
                                    />
                                )}
                            </g>

                            {/* Leaf outline */}
                            <path
                                d={leafShapes[selectedLeaf]}
                                fill="none"
                                stroke="#999"
                                strokeWidth="3"
                                strokeDasharray="8 8"
                                pointerEvents="none"
                            />
                        </svg>
                    </div>
                </div>
            </div>
            <div role={showSizeError ? "alert" : 'presentation'} className={`alert alert-error alert-vertical sm:alert-horizontal fixed bottom-4 left-1/2 transform -translate-x-1/2 transition-all duration-500 ease-in-out text-[#fff] ${showSizeError ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current h-6 w-6 shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div>
                    <h3 className="font-bold">Too Complicated!</h3>
                    <div className="text-xs">Sorry, your leaf is a bit complicated. Try erasing some stuff and saving again</div>
                </div>
                <button className="btn btn-sm btn-secondary bg-white text-error border-0 rounded-3xl" onClick={() => setShowSizeError(false)}>Okay</button>
            </div>
        </>
    );
}

function UIIcon({ title, onClick, destructive, activeTool, noHover, bgColor, children }: { title: string, destructive?: boolean, activeTool?: boolean, noHover?: boolean, bgColor?: string, onClick?: () => void } & React.PropsWithChildren) {
    return (
        <button tabIndex={0} className={`rounded-xl h-10 w-10 bg-base-200 text-base-100 ${destructive && 'bg-primary text-primary-content'} ${activeTool && 'bg-secondary text-secondary-content'} transition-all duration-150 ${!noHover && 'cursor-pointer hover:brightness-125'}`} title={title} onClick={onClick}
            style={{ backgroundColor: bgColor }}>
            {children}
        </button>
    );
}

function PaletteDropdown({ swatches, currentColor, icon, onSwatchClick }: { swatches: typeof backgroundColors | typeof strokeColors, currentColor: string, icon?: 'brush' | 'fill', onSwatchClick: (color: string) => void }) {
    return (

        <div className="dropdown">
            <UIIcon title='Brush color' bgColor={swatches[currentColor as keyof typeof swatches]}>
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