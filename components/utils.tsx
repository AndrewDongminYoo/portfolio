import { parseISO, format } from 'date-fns'

export function Date({ dateString }: { dateString: string }) {
    try {
        const date = parseISO(dateString)
        return <time dateTime={dateString}>{format(date, 'yy-MM-dd')}</time>
    } catch (e) {
        return <p>{dateString}</p>
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
                    </ul> : <p>{resume.icon} {resume.description}</p>
            }
        </div>
    )
}