import { parseISO, format } from 'date-fns'

export function Date({ dateTime, fmt }: { dateTime: string, fmt?: string }) {
    try {
        const date = parseISO(dateTime)
        return <time dateTime={dateTime} >{format(date, fmt ?? 'yy-MM')}</time>
    } catch (e) {
        return <span>{dateTime}</span>
    }
}

export const getIcon = (resume: { icon?: string; }) => {
    const icon = resume.icon ? `"${resume.icon} "` : 'square'
    return { listStyleType: icon }
}

export default function Description({ resume }: { resume: { icon?: string; description: string | string[]; } }) {
    return (
        <div>
            {typeof resume.description !== 'string'
                ? <ul style={getIcon(resume)}>
                    {resume.description.map((info: string, i: number) => {
                        return <li key={i}>{info}</li>
                    })}
                </ul>
                : resume.description.split(/\n+/).length > 2 ?
                    <ul style={getIcon(resume)}>
                        {resume.description.split(/\n+/).map((info: string, i: number) => {
                            return <li key={i}>{info}</li>
                        })}
                    </ul> : <p>{resume.description}</p>
            }
        </div>
    )
}