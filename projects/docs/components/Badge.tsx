import {ReactElement, ReactNode} from 'react';

type BadgeType = 'type' | 'interface' | 'class' | 'property' | 'method' | 'function' | 'const'
  | 'modifier' | 'info' | 'success' | 'warning' | 'danger';
type BadgeSize = 8 | 12 | 16 | 20 | 24;
type BadgeOffset = 0 | 4 | 8 | 12 | 16;

const sizes = new Map<BadgeSize, string>([
  [8, '0.5rem'],
  [12, '0.75rem'],
  [16, '1rem'],
  [20, '1.25rem'],
  [24, '1.5rem'],
]);

const offsets = new Map<BadgeOffset, string>([
  [0, '0'],
  [4, '-0.25rem'],
  [8, '-0.5rem'],
  [12, '-0.75rem'],
  [16, '-1rem'],
]);

const colors = new Map<BadgeType, string>([
  ['type', '#b1a900'],
  ['interface', '#6caa00'],
  ['class', '#008dff'],
  ['property', '#b200fa'],
  ['method', '#e67d00'],
  ['function', '#e67d00'],
  ['const', '#b200fa'],
  ['modifier', '#d64b00'],
  ['info', '#008dff'],
  ['success', '#6caa00'],
  ['warning', '#e67d00'],
  ['danger', '#dd3400'],
]);

type BadgeProps = {
  children: ReactNode;
  type?: BadgeType;
  size?: BadgeSize;
  offset?: BadgeOffset;
};

export function Badge({children, type, size, offset}: BadgeProps): ReactElement {
  return (
    <span
      className="bf-badge"
      style={{
        top: offsets.get(typeof offset === 'number' ? offset : 4),
        fontSize: sizes.get(typeof size === 'number' ? size : 16),
        backgroundColor: colors.get(type || 'info'),
      }}
    >
      {children}
    </span>
  );
}
