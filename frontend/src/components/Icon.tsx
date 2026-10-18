type Props = {
  name: string;
  fill?: boolean;
  className?: string;
};

/** Material Symbols glyph. Add new names to the icon_names list in index.html. */
export function Icon({ name, fill, className }: Props) {
  const classes = ["icon", fill && "icon--fill", className].filter(Boolean).join(" ");
  return (
    <span className={classes} aria-hidden="true">
      {name}
    </span>
  );
}
