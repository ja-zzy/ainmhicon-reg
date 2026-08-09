"use client"

import { useEffect, useState } from "react"
import { DrawingPad } from "../components/drawing/drawing-pad"
import { Drawing } from "../components/drawing/types"
import { useAuth } from "../context/authContext"

export default function LeafDesigner() {
    const authState = useAuth()
    const [savedDrawing, setSavedDrawing] = useState<Drawing | undefined>()
    const [fetched, setFetched] = useState(false)
    const [started, setStarted] = useState(false)
    useEffect(() => {authState.fetchUsersDrawing().then(d => setSavedDrawing(d)).finally(() => setFetched(true))}, [authState])
    return (
        <div className="w-full md:w-[80%] m-auto mt-16 p-12 bg-base-200 rounded-3xl">
            <div className={`flex flex-col gap-4 ${started && 'hidden'}`}>
                <h1 className="font-[family-name:var(--font-sora)] text-xl">Design a Leaf!</h1>
                <p>Help us spread our roots and grow! As a thank you for registering and showing your support we'd like to invite you to
                    design your very own leaf which will appear on the website and in various places around the convention.
                    <br /><br />
                    Please <b>keep it SFW!</b> Leaves are associated with your account and will be removed if innappropriate.</p>
                <button className='btn btn-secondary w-[50%] m-auto mt-8 rounded-lg' onClick={() => setStarted(true)}>Get started</button>
            </div>
           {started && fetched && <DrawingPad drawing={savedDrawing} onSave={(d) => authState.updateLeaf(d)}/>}
       </div>
    )
}
