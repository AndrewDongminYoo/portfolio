import { stacks } from '@/src/lib/constants';

export default function StackList() {
  return (
    <section className='border-t-0.1 mt-2 border-solid border-t-black pt-1'>
      <div className='mx-0 mt-0 mb-0.5 block px-0 py-0 text-sm leading-normal font-medium'>
        <span>주요 기술</span>
        <span className='ml-1 text-xs leading-normal text-slate-600'>
          {stacks.primaryTags.length}개
        </span>
      </div>
      <ul className='mt-1 mb-4 list-none px-0 py-0'>
        {stacks.primaryTags.map((stack, i) => {
          return (
            <li className='inline-block' key={`${i}-${stack}`}>
              <div className='my-0 mr-1 ml-0 max-w-[14rem] overflow-hidden rounded border-0 bg-slate-800 px-1 py-0.5 text-xs font-normal text-ellipsis whitespace-nowrap text-gray-50 transition-all duration-75 ease-in-out'>
                {stack}
              </div>
            </li>
          );
        })}
      </ul>
      <div className='mx-0 mt-0 mb-0.5 block px-0 py-0 text-sm leading-normal font-medium'>
        <span>기술 태그</span>
      </div>
      <ul className='mt-1 mb-4 list-none px-0 py-0'>
        {stacks.technicalTags.map((stack, i) => {
          return (
            <li className='inline-block' key={`${i}`}>
              <div className='text-foreground my-0 mr-1 ml-0 max-w-[14rem] overflow-hidden rounded border-0 bg-slate-200 px-1 py-0.5 text-xs font-normal text-ellipsis whitespace-nowrap transition-all duration-75 ease-in-out'>
                {stack}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
