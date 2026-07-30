export default function Loading({className = ''}: {className?: string}) {
    return (
        <div className={`w-full flex justify-center grow$ ${className}`}><span className="loading loading-ring loading-lg"></span></div>
    )
}
