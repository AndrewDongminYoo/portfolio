import React, { SVGAttributes } from 'react';
import type Icon from '@typings/slug-icon';
import type { IconType } from '@icons-pack/react-simple-icons';
import { iconMap } from '@typings/icon-map';

type IconProps = SVGAttributes<SVGElement> & {
    icon: Icon;
    color?: string;
    size?: string | number;
    className?: string;
};

export default function SlugIcon(props: IconProps) {
    const iconOf: { slug: IconType } = { slug: iconMap[props.icon] };
    return <iconOf.slug {...props}></iconOf.slug>;
}
