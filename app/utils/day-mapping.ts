export const days = {
    friday: 1,
    saturday: 2,
    sunday: 3
}

export function getDayValue(day: string) {
    if(day in days) {
        return days[day as keyof typeof days]
    }
    return -1
}