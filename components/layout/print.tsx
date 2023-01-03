import Image from 'next/image';
import React from 'react';
import printButton from '@public/images/print_button.svg';
import style from '@styles/layout.module.css';

export default function PrintButton({ visible }: { visible: boolean; }) {
    const { print } = style;
    return (
        <div className={print} style={{ display: visible ? "block" : "none" }}>
            <button className={print} onClick={() => window.print()}>
                <Image className={print} alt={'print'} src={printButton} />
            </button>
        </div>
    );
}
