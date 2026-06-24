import { highlightJson, loadSchemaJsonBySlug } from '@/lib/schema-content';

interface SchemaJsonProps {
  schemaLocation: string;
}

export default async function SchemaJson({ schemaLocation }: SchemaJsonProps) {
  try {
    const formattedJson = await loadSchemaJsonBySlug(schemaLocation);
    const schemaHtml = await highlightJson(formattedJson);

    return (
      <div
        className="nextra-code [&_pre]:!my-0 [&_pre]:!p-4 [&_pre]:overflow-x-auto"
        dangerouslySetInnerHTML={{ __html: schemaHtml }}
      />
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return (
      <p className="text-sm text-red-500">
        Failed to load schema from <code>{schemaLocation}</code>: {message}
      </p>
    );
  }
}
