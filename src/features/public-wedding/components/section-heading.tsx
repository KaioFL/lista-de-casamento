interface SectionHeadingProps {
  numeral?: string;
  eyebrow?: string;
  title: string;
}

/** Cabeçalho de seção em estilo editorial: eyebrow e título serifado. */
export function SectionHeading({ numeral, eyebrow, title }: SectionHeadingProps) {
  return (
    <div className="flex flex-col items-center text-center">
      {numeral && (
        <>
          <span className="font-heading text-base italic [color:var(--wine)]">
            {numeral}
          </span>
          <span className="my-3 h-8 w-px bg-[color:var(--wine)] opacity-25" />
        </>
      )}
      {eyebrow && (
        <span className="label-caps text-[0.65rem] [color:var(--wine)] opacity-90">
          {eyebrow}
        </span>
      )}
      <h2 className="font-heading mt-2.5 text-3xl leading-[1.05] font-medium tracking-tight text-balance sm:text-4xl">
        {title}
      </h2>
    </div>
  );
}
