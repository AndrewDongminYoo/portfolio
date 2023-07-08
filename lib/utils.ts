import { type ClassValue, clsx as classnames } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 이 함수는 클래스 값의 배열을 가져와서 clsx 함수를 사용하여 병합한 다음 twMerge 함수를 사용하여 결과를 병합
 * @param {ClassValue[]} inputs `inputs` 매개변수는 `ClassValue[]` 유형의 여러 인수를 전달할 수 있는 나머지 매개변수입니다.
 * @returns {string} `clsx` 함수를 사용하여 인수로 전달된 클래스 이름을 병합한 다음 `twMerge` 함수를 사용하여 결과를 Tailwind CSS 클래스와 병합한 결과
 */
export function names(...inputs: ClassValue[]) {
    /**
     * `clsx`: 클래스명 문자열을 조건부로 구성하기 위한 작은(228B) 유틸리티 패키지. `classnames` 모듈을 대체하는 더 빠르고 작은 드롭인 역할도 합니다.
     * @see https://github.com/lukeed/clsx#readme
     * `tailwind-merge`: 스타일 충돌 없이 JS에서 Tailwind CSS 클래스를 효율적으로 병합하는 유틸리티 함수입니다.
     * @see https://github.com/dcastil/tailwind-merge
     */
    return twMerge(classnames(inputs));
}
