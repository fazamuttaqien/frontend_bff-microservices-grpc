type PlaceholderPageProps = {
  title: string
}

export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <section>
      <h1>{title}</h1>
      <p>This page is a routing placeholder.</p>
    </section>
  )
}
