// import Image from 'next/image';

// import {assetsSlug, description} from '../';
import {Badge} from './Badge';

export function Logo() {
  return (
    <div className="bf-logo">
      {/* <Image */}
      {/*   src={`${assetsSlug}logo.png`} */}
      {/*   alt="{description}" */}
      {/*   width={40} */}
      {/*   height={30} */}
      {/* /> */}
      <span className="bf-logo__text">
        BITFIBER
        <Badge
          size={12}
          offset={0}
          type={'danger'}
        >
          Angular
        </Badge>
      </span>
    </div>
  );
}
