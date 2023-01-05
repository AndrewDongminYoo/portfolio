import Image from 'next/image';
import names from 'classnames';
import printButton from '@public/images/print_button.svg';

export default function PrintButton() {
    return (
        <div className={names("sm:block hidden top-10 right-10 fixed")}>
            <button className={names("cursor-pointer w-12 h-12 rounded-full shadow-fab bg-gradient-to-b from-hintOfGreen to-solitude")} onClick={() => window.print()}>
                <Image className={names("w-6 h-6 inline-block align-middle")} alt={'print'} src={printButton} />
            </button>
        </div>
    );
}
