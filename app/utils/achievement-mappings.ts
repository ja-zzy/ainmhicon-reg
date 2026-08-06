import { Achievement } from "./types"

export const achievementThumbnails: Map<Achievement, string> = new Map(
    [
        ['2026_attendee', '/cheevos/2026_attendee.webp'],
        ['2027_attendee', '/cheevos/2027_attendee.webp']
    ]
)

export const achievementImages: Map<Achievement, string> = new Map(
    [
        ['2026_attendee', '/cheevos/hr/2026_attendee.png'],
        ['2027_attendee', '/cheevos/hr/2027_attendee.jpeg']
    ]
)

export const achievementTitles: Map<Achievement, string> = new Map(
    [
        ['2026_attendee', '2026 Attendee!'],
        ['2027_attendee', '2027 Attendee!'],
    ]
)

export const conventionIdToAttendeeAchievement: Map<number, Achievement> = new Map(
    [
        [1, '2026_attendee'],
        [2, '2027_attendee'],
    ]
)