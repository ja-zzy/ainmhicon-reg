const minimumConventionAge = Number(process.env.NEXT_PUBLIC_CON_MIN_AGE)
const conventionDate = Number(process.env.NEXT_PUBLIC_CON_DATE)

export function verifyAge(date: Date) {
    if (!minimumConventionAge) { return true }

    const ageDifference = conventionDate - date.getTime();
    const ageAtEvent = Math.abs(new Date(ageDifference).getUTCFullYear() - 1970);
    return ageAtEvent >= minimumConventionAge
}