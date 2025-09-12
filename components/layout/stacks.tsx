import { stacks } from '@/constants/';

export default function StackList() {
  return (
    <section className='border-t-0.1 mt-2 border-solid border-t-black pt-1'>
      <div className='mx-0 mb-0.5 mt-0 block px-0 py-0 text-sm font-medium leading-normal'>
        <span>주요 기술</span>
        <span className='ml-1 text-xs leading-normal text-slate-600'>
          {stacks.primaryTags.length}개
        </span>
      </div>
      <ul className='mb-4 mt-1 list-none px-0 py-0'>
        {stacks.primaryTags.map((stack, i) => {
          return (
            <li className='inline-block' key={`${i}-${stack}`}>
              <div className='my-0 ml-0 mr-1 max-w-[14rem] overflow-hidden text-ellipsis whitespace-nowrap rounded border-0 bg-slate-800 px-1 py-0.5 text-xs font-normal text-gray-50 transition-all duration-75 ease-in-out'>
                {stack}
              </div>
            </li>
          );
        })}
      </ul>
      <div className='mx-0 mb-0.5 mt-0 block px-0 py-0 text-sm font-medium leading-normal'>
        <span>기술 태그</span>
      </div>
      <ul className='mb-4 mt-1 list-none px-0 py-0'>
        {stacks.technicalTags.map((stack, i) => {
          return (
            <li className='inline-block' key={`${i}`}>
              <div className='my-0 ml-0 mr-1 max-w-[14rem] overflow-hidden text-ellipsis whitespace-nowrap rounded border-0 bg-slate-200 px-1 py-0.5 text-xs font-normal text-foreground transition-all duration-75 ease-in-out'>
                {stack}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
