import type { Metadata } from "next";
import type { MDXContent } from "mdx/types";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { diagrams } from "@/content/work/diagrams";
import { ArchitectureDiagram } from "@/components/diagram/diagram";
import { CaseStudyFacts } from "@/components/work/case-study-facts";
import { CaseStudyHeader } from "@/components/work/case-study-header";
import { Pager } from "@/components/work/pager";
import { resume } from "@/lib/resume-data";
import { getProject } from "@/lib/work";
import { frame } from "@/components/site/frame";
import { JsonLd } from "@/components/site/json-ld";
import { articleJsonLd, pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

// Every case study is built at build time; any other slug is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return resume.projects.map((p) => ({ slug: p.slug }));
}

// Its own title, description, canonical URL and share block; the card is ./opengraph-image.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};
  return pageMetadata({ title: project.headline, description: project.summary, path: `/work/${project.slug}`, type: "article" });
}

/**
 * A case study: header and facts from resume-data, narrative from MDX. Below
 * xl it is one 768px column so the diagram renders near 1:1; from xl the
 * facts sit in a sticky panel beside the reading column.
 */
export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const { default: Body } = (await import(`@/content/work/${slug}.mdx`)) as { default: MDXContent };
  const diagram = diagrams[slug];

  return (
    <article className={`${frame} pt-10 pb-24`}>
      <JsonLd data={articleJsonLd(project)} />
      <Link href="/#work" className="group inline-flex items-center gap-1.5 py-1 text-sm text-ink-3 transition-colors hover:text-ink">
        <ArrowLeft aria-hidden="true" className="size-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" strokeWidth={2} />
        All work
      </Link>
      <div className="mt-10 grid gap-x-14 gap-y-12 xl:grid-cols-12">
        <CaseStudyHeader project={project} className="max-w-3xl xl:col-span-8 xl:max-w-none" />
        <CaseStudyFacts project={project} className="max-w-3xl xl:col-span-4 xl:row-span-2 xl:max-w-none" />
        <div className="max-w-3xl xl:col-span-8 xl:max-w-none">
          <Body components={{ Diagram: () => <ArchitectureDiagram id={slug} diagram={diagram} /> }} />
        </div>
      </div>
      <Pager slug={slug} />
    </article>
  );
}
