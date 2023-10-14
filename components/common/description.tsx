export default function Description({
  resume,
}: {
  resume: { icon?: string; description: string | string[] };
}) {
  const listStyleType = resume.icon ? `'${resume.icon} '` : 'square';
  const style = { listStyleType };
  return (
    <>
      {typeof resume.description !== 'string' ? (
        <ul style={style}>
          {resume.description.map((info: string, i: number) => {
            return <li key={`${i}-${info}`}>{info}</li>;
          })}
        </ul>
      ) : resume.description.split(/\n+/).length > 2 ? (
        <ul style={style}>
          {resume.description.split(/\n+/).map((info: string, i: number) => {
            return <li key={`${i}-${info}`}>{info}</li>;
          })}
        </ul>
      ) : (
        <p>{resume.description}</p>
      )}
    </>
  );
}
