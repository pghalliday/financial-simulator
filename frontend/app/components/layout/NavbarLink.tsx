import cx from 'clsx'
import {NavLink} from "@mantine/core";
import {NavLink as RRNavLink} from 'react-router'

export interface Props {
    label: string,
    href: string,
    onClick: () => void,
}

export function NavbarLink({label, href, onClick}: Props) {
    return <NavLink
        label={label}
        variant="filled"
        onClick={onClick}
        renderRoot={({className, ...others}) => (
            <RRNavLink
                to={href}
                className={({isActive}: { isActive: boolean }) =>
                    cx(className, {'active-class': isActive})
                }
                {...others}
            />
        )}
    />
}
