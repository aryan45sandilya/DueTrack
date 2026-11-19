import { createRootRoute, HeadContent, Scripts } from '@tanstack/react-router'
import css from '../styles.css?url'
export const Route = createRootRoute({ head: () => ({ meta: [{ charSet:'utf-8' }, { name:'viewport', content:'width=device-width, initial-scale=1' }, { title:'Dueform — Credit overview' }], links:[{rel:'icon',type:'image/svg+xml',href:'/favicon.svg'},{rel:'stylesheet',href:css}] }), component: Root })
function Root(){ return <html lang="en"><head><HeadContent /></head><body><RouteOutlet /><Scripts /></body></html> }
import { Outlet as RouteOutlet } from '@tanstack/react-router'
