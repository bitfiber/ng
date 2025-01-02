import {ReactElement} from 'react';

export function Footer(): ReactElement {
  return (
    <div className="bf-footer">
      <span>
        Created by Oleksandr Zmanovskyi © 2023-{new Date().getFullYear()}.
      </span>

      <span>
        Code licensed under an <a
          className="bf-link"
          href="https://github.com/bitfiber/ng/blob/main/LICENSE.txt"
        >
          Apache 2.0 License
        </a>.
      </span>

      <span>
        Documentation licensed under <a
          className="bf-link"
          href="http://creativecommons.org/licenses/by/4.0/"
        >
          CC BY 4.0
        </a>.
      </span>
    </div>
  );
}
