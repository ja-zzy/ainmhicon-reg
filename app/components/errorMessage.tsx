const SUPPORT_EMAIL = 'supply_support_email_before_launch'

export default function ErrorMessage({ error }: { error?: string | null }) {
    if (error) {

        return <p className='text-error font-bold mt-2'>Sorry something went wrong: {error}<br />Try again soon or <a href={`mailto:${SUPPORT_EMAIL}`}>contact us</a></p>
    }
}