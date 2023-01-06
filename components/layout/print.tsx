import Image from 'next/image';
import names from 'classnames';
import printButton from '@public/images/print_button.svg';

export default function PrintButton() {
    return (
        <div className="print:hidden fixed top-10 right-10 z-50">
            <button
                className={names(
                    'rounded-full h-12 w-12',
                    'shadow-fab bg-gradient-to-b from-hintOfGreen to-solitude'
                )}
                onClick={() => window.print()}
            >
                <Image className="h-6 w-6" alt="print icon" src={printButton} />
            </button>
        </div>
    );
}
