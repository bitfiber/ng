import {ReactElement, ReactNode} from 'react';

type RefCardsProps = {
  children: ReactNode;
};

export function RefCards({children}: RefCardsProps): ReactElement {
  return (
    <div className="bf-ref-cards">
      {children}
    </div>
  );
}
