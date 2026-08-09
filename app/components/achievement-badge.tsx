import { achievementImages, achievementThumbnails, achievementTitles } from "../utils/achievement-mappings"
import { Achievement as AchievementType } from "../utils/types"

interface Props {
    achievementName: AchievementType
}

export default function Achievement({ achievementName }: Props) {
    return (
        <div className="flex flex-col items-center gap-1">
            <div className='shadow-2xl border-1 border-black outline-2 outline-offset-[-3px] outline-white rounded-full w-18 transition-transform scale-100 hover:scale-205 hover:shadow-4xl delay-0 hover:delay-250 hover:z-1 overflow-hidden' title={achievementTitles.get(achievementName)}>
                <a href={achievementImages.get(achievementName)}>
                    <img src={achievementThumbnails.get(achievementName)} />
                </a>
            </div>
            <label className='pointer-fine:hidden'>{achievementTitles.get(achievementName)}</label>
        </div>
    )
}
