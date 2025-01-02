import {ReactElement, ReactNode} from 'react';

import {rxHost} from '../';

type RxLinkProps = {
  children: ReactNode;
  href?: string;
};

export function RxLink({children, href}: RxLinkProps): ReactElement {
  return (
    <a
      className="bf-link"
      href={`${rxHost}${href}`}
    >
      {children}
    </a>
  );
}
