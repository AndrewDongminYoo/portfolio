import Image from 'next/image';
import printButton from '@public/images/print_button.svg';
import style from '@styles/layout.module.css';

export default function PrintButton() {
    const { print } = style;
    return (
        <div className={print} >
            <button
                className={print}
                onClick={() => window.print()}
            >
                <Image
                    className={print}
                    alt={"print"}
                    src={printButton}
                />
            </button>
        </div>
    );
}
