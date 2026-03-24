const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_SUPPORT_EMAIL

export default function ErrorMessage({ error }: { error?: string | null }) {
    if (error) {

        return <p className='text-error font-bold mt-2 bg-(--color-error-content) sticky bottom-6 py-3 px-5 rounded-md text-center shadow-md'>{error}<br /><br />For support contact <a href={`mailto:${SUPPORT_EMAIL}`} className='underline'>{SUPPORT_EMAIL}</a></p>
    }
}