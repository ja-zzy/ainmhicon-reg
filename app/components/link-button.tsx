type Props = React.PropsWithChildren & {
    href: string
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

export default function LinkButton({ children, href, size = 'md' }: Props) {
    return (
        <a href={href} className={`btn ${size !== 'md' ? 'btn-' + size : ''} scale-100 transition-all duration-250 ease-in-out hover:scale-110 rounded-4xl bg-base-100 border-0`}>{children}</a>
    );
}
