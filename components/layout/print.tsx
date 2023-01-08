import Image from 'next/image';
import names from 'classnames';
import printButton from '@public/images/print_button.svg';

export default function PrintButton() {
    return (
        <div className="fixed z-50 print:hidden top-10 right-10">
            <button
                className={names(
                    'rounded-full h-12 w-12',
                    'shadow-fab bg-gradient-to-b from-green-100 to-blue-100'
                )}
                onClick={() => window.print()}
            >
                <Image className="w-6 h-6" alt="print icon" src={printButton} />
            </button>
        </div>
    );
}
