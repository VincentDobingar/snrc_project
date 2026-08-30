import Container from "../ui/Container";

export default function PageBanner({
  title,
  subtitle,
  badge = "SNRC",
  light = false,
  backgroundImage = "/images/sections/snrc.jpg",
}) {
  return (
    <section
      className={`relative isolate overflow-hidden ${
        light ? "bg-snrc-light" : "bg-white"
      }`}
    >
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-snrc-blue/8 via-transparent to-snrc-gold/10" />
      </div>

      <Container className="relative py-16 sm:py-20 lg:py-24">
        <div className="max-w-3xl">
          <span className="inline-flex rounded-full bg-snrc-blue/10 px-3 py-1 text-sm font-semibold text-snrc-blue">
            {badge}
          </span>

          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-snrc-blue sm:text-5xl lg:text-6xl">
            {title}
          </h1>

          {subtitle ? (
            <p className="mt-5 text-base leading-8 text-snrc-blue/85 sm:text-lg">
              {subtitle}
            </p>
          ) : null}
        </div>
      </Container>
    </section>
  );
}