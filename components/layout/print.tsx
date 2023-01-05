import Image from 'next/image';
import names from 'classnames';
import printButton from '@public/images/print_button.svg';
import style from '@styles/layout.module.css';

export default function PrintButton({ visible }: { visible: boolean; }) {
    const { print } = style;
    return (
        <div className={names(print,)} style={{ display: visible ? "block" : "none" }}>
            <button className={names(print,)} onClick={() => window.print()}>
                <Image className={names(print,)} alt={'print'} src={printButton} />
            </button>
        </div>
    );
}
