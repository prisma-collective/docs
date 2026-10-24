import { notFound } from 'next/navigation';
import { generateStaticParamsFor, importPage } from 'nextra/pages';
import { useMDXComponents as getMDXComponents } from '@/mdx-components.js';

export const generateStaticParams = generateStaticParamsFor('mdxPath');

const Wrapper = getMDXComponents().wrapper;

export default async function Page(props) {
  const isApiOnlyPrivateRuntime = process.env.PRIVATE_DOCS_API_ONLY === 'true';
  if (isApiOnlyPrivateRuntime) {
    notFound();
  }

  const params = await props.params;
  const result = await importPage(params.mdxPath);
  const { default: MDXContent, toc, metadata } = result;
  return (
    <Wrapper toc={toc} metadata={metadata}>
      <div className="w-full">
        <div className="max-w-[850px] w-full mx-auto">
          <MDXContent {...props} params={params} />
        </div>
      </div>
    </Wrapper>
  );
}
