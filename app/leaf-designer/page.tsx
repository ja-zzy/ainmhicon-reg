"use client"

import { useEffect, useState } from "react"
import { DrawingPad } from "../components/drawing/drawing-pad"
import { Drawing } from "../components/drawing/types"
import { useAuth } from "../context/authContext"
import ErrorMessage from "../components/errorMessage"

export default function LeafDesigner() {
    const authState = useAuth()
    const [savedDrawing, setSavedDrawing] = useState<Drawing | undefined>()
    const [fetched, setFetched] = useState(false)
    const [started, setStarted] = useState(false)
    const [showSaved, setShowSaved] = useState(false)
    const [error, setError] = useState<string | undefined>()
    useEffect(() => { authState.fetchUsersDrawing().then(d => setSavedDrawing(d)).finally(() => setFetched(true)) }, [authState])
    return (
        <div className="w-full md:w-[80%] m-auto mt-16 p-12 bg-base-200 rounded-3xl">
            <div className={`flex flex-col gap-4 ${started && 'hidden'}`}>
                <h1 className="font-[family-name:var(--font-sora)] text-xl">Design a Leaf!</h1>
                <p>
                    Help us spread our roots and grow! As a thank you for registering and showing your support we'd like to invite you to
                    design your very own leaf which will appear in various places around the convention.
                    <br /><br />
                    Please <b>keep it SFW!</b> Leaves are associated with your account and will be removed if innappropriate. Craic & Ceòl are watching!
                </p>
                <button className='btn btn-secondary w-[50%] m-auto mt-8 rounded-lg' onClick={() => setStarted(true)}>Get started</button>
            </div>
            {started && fetched && <DrawingPad drawing={savedDrawing} onSave={(d) => authState.updateLeaf(d).then(() => {
                setShowSaved(true)
                setTimeout(() => setShowSaved(false), 3_000)
            }).catch(e => setError("Sorry, something went wrong when we tried to save your drawing."))} />}
            {error && <ErrorMessage error={error} />}
            {showSaved && <div role={showSaved ? "alert" : 'presentation'} className={`alert alert-info alert-vertical sm:alert-horizontal fixed bottom-4 left-1/2 transform -translate-x-1/2 transition-all duration-500 ease-in-out text-[#fff] ${showSaved ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
                <h3 className="font-bold">Drawing saved!</h3>
            </div>}
        </div>
    )
}
