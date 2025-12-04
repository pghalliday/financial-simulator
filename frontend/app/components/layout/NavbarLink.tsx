import cx from 'clsx'
import {NavLink} from "@mantine/core";
import {NavLink as RRNavLink} from 'react-router'

export interface NavbarLinkTree {
    navbarLinkHref: string,
    navbarLinkLabel: string,
    navbarLinkChildren?: NavbarLinkTree[]
}

export interface Props {
    tree: NavbarLinkTree,
    onClick: () => void,
}

export function NavbarLink({tree, onClick}: Props) {
    return <NavLink
        label={tree.navbarLinkLabel}
        variant="filled"
        onClick={onClick}
        renderRoot={({className, ...others}) => (
            <RRNavLink
                to={tree.navbarLinkHref}
                className={({isActive}: { isActive: boolean }) =>
                    cx(className, {'active-class': isActive})
                }
                {...others}
            />
        )}
    >
        {tree.navbarLinkChildren?.map(tree => (<NavbarLink key={tree.navbarLinkHref} tree={tree} onClick={onClick}/>))}
    </NavLink>
}