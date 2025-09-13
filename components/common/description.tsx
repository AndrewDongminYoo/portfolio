export default function Description({ resume }: { resume: { description: string | string[] } }) {
  return (
    <>
      {typeof resume.description !== 'string' ? (
        <ul className='list-square'>
          {resume.description.map((info: string, i: number) => {
            return <li key={`${i}-${info}`}>{info}</li>;
          })}
        </ul>
      ) : resume.description.split(/\n+/).length > 2 ? (
        <ul className='list-square'>
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
