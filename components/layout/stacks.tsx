import { stacks } from '@constants';

export default function StackList() {
    return (
        <section className="pt-1 mt-2 border-t-0.1 border-t-black border-solid">
            <div className="block p-0 mb-0.5 mx-0 mt-0 text-sm font-medium leading-normal">
                <span>주요 기술</span>
                <span className="ml-1 text-xs leading-normal text-slate-600">4개</span>
            </div>
            <ul className="p-0 mt-1 mb-4 list-none">
                {stacks.primaryTags.map((stack, i) => {
                    return (
                        <li className="inline-block" key={i}>
                            <div className="duration-75 ease-in-out pl-1 pr-1 mt-0 mb-0 ml-0 mr-1 overflow-hidden text-xs font-normal whitespace-nowrap transition-all border-0 rounded py-0.5 max-w-xxs text-ellipsis text-gray-50 bg-slate-800">{stack}</div>
                        </li>
                    );
                })}
            </ul>
            <div className="block p-0 mb-0.5 mx-0 mt-0 text-sm font-medium leading-normal">
                <span>기술 태그</span>
            </div>
            <ul className="p-0 mt-1 mb-4 list-none">
                {stacks.technicalTags.map((stack, i) => {
                    return (
                        <li className="inline-block" key={i}>
                            <div className="duration-75 ease-in-out pl-1 pr-1 mt-0 mb-0 ml-0 mr-1 overflow-hidden text-xs font-normal text-slate-800 whitespace-nowrap transition-all bg-slate-200 border-0 rounded py-0.5 max-w-xxs text-ellipsis">{stack}</div>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}
