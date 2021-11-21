import { ContainerReflection, DeclarationReflection, Reflection, ReflectionKind } from "../../../../models";
import { JSX, partition } from "../../../../utils";
import type { PageEvent } from "../../../events";
import { classNames, wbr } from "../../lib";
import type { DefaultThemeRenderContext } from "../DefaultThemeRenderContext";

export function navigation(context: DefaultThemeRenderContext, props: PageEvent<Reflection>) {
    return (
        <>
            {primaryNavigation(context, props)}
            {secondaryNavigation(context, props)}
        </>
    );
}

const folderIcon = () => {
    return (
        <svg style="width:0.9em;height:0.9em;margin:0.125em 0 -0.125em 0" viewBox="0 0 24 24">
            <path fill="currentColor" d="M6.1,10L4,18V8H21A2,2 0 0,0 19,6H12L10,4H4A2,2 0 0,0 2,6V18A2,2 0 0,0 4,20H19C19.9,20 20.7,19.4 20.9,18.5L23.2,10H6.1M19,18H6L7.6,12H20.6L19,18Z" />
        </svg>
    )
}

type TreeItemDir = {
    type: "dir",
    dirname: string
    children: TreeItem[]
}

type TreeItemModule = {
    type: "module",
    filename: string
    module: DeclarationReflection
}

type TreeItem = TreeItemDir | TreeItemModule;

const makeTree = (modules: DeclarationReflection[]): TreeItem[] => {
    const tree: TreeItem[] = [];
    for(const module of modules) {
        const dirnames = module.name.split("/");
        const filename = dirnames.pop()!;
        let current = tree;
        for(const dirname of dirnames) {
            let entry = current.find(item => item.type === "dir" && item.dirname === dirname) as TreeItemDir | undefined;
            if(entry == null) {
                entry = { type: "dir", dirname, children: [] }
                current.push(entry);
            }
            current = entry.children;
        }
        current.push({
            type: "module",
            filename,
            module
        })
    }

    return tree;
}

function primaryNavigation(context: DefaultThemeRenderContext, props: PageEvent<Reflection>) {
    // Create the navigation for the current page:
    // If there are modules marked as "external" then put them in their own group.

    const modules = props.model.project.getChildrenByKind(ReflectionKind.SomeModule);
    const projectLinkName = modules.some((m) => m.kindOf(ReflectionKind.Module)) ? "Modules" : "Exports";

    const [ext, int] = partition(modules, (m) => m.flags.isExternal);

    const intTree = makeTree(int);

    if (ext.length === 0) {
        return (
            <nav class="tsd-navigation primary">
                <ul>
                    <li class={classNames({ current: props.model.isProject() })}>
                        <a href={context.urlTo(props.model.project)}>{projectLinkName}</a>
                    </li>
                    {intTree.map(linkTree)}
                </ul>
            </nav>
        );
    }

    return (
        <nav class="tsd-navigation primary">
            <ul>
                <li class={classNames({ current: props.model.isProject() })}>
                    <a href={context.urlTo(props.model.project)}>{projectLinkName}</a>
                </li>
                <li class="label tsd-is-external">
                    <span>Internals</span>
                </li>
                {intTree.map(linkTree)}
                <li class="label tsd-is-external">
                    <span>Externals</span>
                </li>
                {ext.map(link)}
            </ul>
        </nav>
    );

    function link(mod: DeclarationReflection) {
        const current = inPath(mod, props.model);
        let childNav: JSX.Element | undefined;
        if (current) {
            const childModules = mod.children?.filter((m) => m.kindOf(ReflectionKind.SomeModule));
            if (childModules?.length) {
                childNav = <ul>{childModules.map(link)}</ul>;
            }
        }

        return (
            <li class={classNames({ current }) + " " + mod.cssClasses}>
                <a href={context.urlTo(mod)}>· {wbr(mod.name)}</a>
                {childNav}
            </li>
        );
    }

    function linkTree(item: TreeItem) {
        if(item.type === "module") {
            const mod = item.module;
            const current = inPath(mod, props.model);
            let childNav: JSX.Element | undefined;
            if(current) {
                const childModules = mod.children?.filter((m) => m.kindOf(ReflectionKind.SomeModule));
                if(childModules?.length) {
                    childNav = <ul>{childModules.map(link)}</ul>
                }
            }

            return (
                <li class={classNames({ current }) + " " + mod.cssClasses}>
                    <a href={context.urlTo(mod)}>· {wbr(item.filename)}</a>
                    {childNav}
                </li>
            )
        } else {
            const current = inPathTree(item, props.model);
            return (
                <li class={classNames({ current }) + " tsd-kind-module"}>
                    <a style="text-decoration: none !important; cursor: unset !important">{folderIcon()} {wbr(item.dirname)}</a>
                    <ul>
                        {item.children.map(linkTree)}
                    </ul>
                </li>
            )
        }
    }
}

function secondaryNavigation(context: DefaultThemeRenderContext, props: PageEvent<Reflection>) {
    const children = props.model instanceof ContainerReflection ? props.model.children || [] : [];

    // Multiple entry points, and on main project page.
    if (props.model.isProject() && props.model.getChildrenByKind(ReflectionKind.Module).length) {
        return;
    }

    // TODO: TypeDoc 0.21 did special things here. If there were more than 40
    // children of this page's parent, it only displayed this page's children.
    // Otherwise, it displayed *everything*. For now, only display page children.
    // It seems weird to do this according to a random hardcoded number. At the very
    // least this should be added as a configurable flag, but maybe even the whole
    // behavior should be configurable globally...

    const pageNavigation = (
        <ul>
            {children
                .filter((child) => !child.kindOf(ReflectionKind.SomeModule))
                .map((child) => {
                    return (
                        <li class={child.cssClasses}>
                            <a href={context.urlTo(child)} class="tsd-kind-icon">
                                {wbr(child.name)}
                            </a>
                        </li>
                    );
                })}
        </ul>
    );

    if (props.model.kindOf(ReflectionKind.SomeModule | ReflectionKind.Project)) {
        return <nav class="tsd-navigation secondary menu-sticky">{pageNavigation}</nav>;
    }

    return (
        <nav class="tsd-navigation secondary menu-sticky">
            <ul>
                <li class={"current " + props.model.cssClasses}>
                    <a href={context.urlTo(props.model)} class="tsd-kind-icon">
                        {wbr(props.model.name)}
                    </a>
                    {pageNavigation}
                </li>
            </ul>
        </nav>
    );
}

function inPath(thisPage: Reflection, toCheck: Reflection | undefined): boolean {
    while (toCheck) {
        if (toCheck.isProject()) return false;

        if (thisPage === toCheck) return true;

        toCheck = toCheck.parent;
    }

    return false;
}


function inPathTree(item: TreeItem, toCheck: Reflection | undefined): boolean {
    if(item.type === "dir") {
        return item.children.some(item => inPathTree(item, toCheck));
    } else {
        return inPath(item.module, toCheck);
    } 
}