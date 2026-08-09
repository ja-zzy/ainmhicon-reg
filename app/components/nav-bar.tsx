"use client"
import LinkButton from './link-button'

interface NavBarProps {
    loggedIn?: boolean
    logout: () => void
}

export default function NavBar({loggedIn, logout}: NavBarProps) {
    const linkRoot = process.env.NEXT_PUBLIC_MARKETING_DOMAIN

    const home = linkRoot || '/'
    const faq = `${linkRoot}/faq`
    const pricing = `${linkRoot}/pricing`
    const coc = `${linkRoot}/code-of-conduct`
    const dealers = `${linkRoot}/dealers-den`
    const contact = `${linkRoot}/contact`
    return (
        <nav className='navbar w-full h-25 flex flex-row px-2 bg-base-200 justify-between shadow-sm lg:px-10'>

            <div className="navbar-start h-full w-auto">
                <a href={home} className='mr-auto shrink-0  h-full' >
                    <img src='/logo.webp' className='h-full' alt="Ainmhícon"/>
                </a></div>

            <div className="navbar-end w-auto">
                <div className='flex-row self-center gap-2 hidden md:flex w-auto'>
                    <LinkButton href={home}>Home</LinkButton>
                    <LinkButton href={faq}>FAQ</LinkButton>
                    <LinkButton href={pricing}>Pricing</LinkButton>
                    <LinkButton href={coc}>Code of Conduct</LinkButton>
                    <LinkButton href={dealers}>Dealer's Den</LinkButton>
                    <LinkButton href={contact}>Contact</LinkButton>
                    {!loggedIn && <LinkButton href='/'>Login</LinkButton>}
                    {loggedIn && <button className={`btn scale-100 transition-all duration-250 ease-in-out hover:scale-110 rounded-4xl`} onClick={logout}>Logout</button>}
                </div>

                <div className="dropdown visible md:hidden">
                    <div tabIndex={0} role="button" className="btn btn-ghost md:hidden"  aria-label='Navigation Menu Dropdown'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                    </div>
                    <ul
                        tabIndex={-1}
                        className="menu menu-lg dropdown-content rounded-box z-1 mt-3 w-auto p-2 shadow-lg right-3 bg-neutral text-neutral-content">
                        <li><a className='whitespace-nowrap' href={home}>Home</a></li>
                        <li><a className='whitespace-nowrap' href={faq}>FAQ</a></li>
                        <li><a className='whitespace-nowrap' href={pricing}>Pricing</a></li>
                        <li><a className='whitespace-nowrap' href={coc}>Code of Conduct</a></li>
                        <li><a className='whitespace-nowrap' href={contact}>Contact</a></li>
                        {!loggedIn && <li><a className='whitespace-nowrap' href='/'>Login</a></li>}
                        {loggedIn && <li><a className='whitespace-nowrap' onClick={logout}>Logout</a></li>}
                    </ul>
                </div>
            </div>

        </nav >
    );
}