interface IIconProps {
  name: string;
  size?: number;
  className?: string;
}

export default function Icon({
  name,
  size = 24,
  className = "",
}: IIconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      fill="none"
    >
      <use href={`#icon-${name}`} />
    </svg>
  );
}
