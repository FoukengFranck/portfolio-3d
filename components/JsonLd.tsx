import { SITE } from "@/lib/site";


export default function JsonLd() {
  const websiteId = `${SITE.url}/#website`;
  const personId = `${SITE.url}/#person`;

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: SITE.url,
        name: SITE.name,
        alternateName: [SITE.fullName, "FKBF Portfolio"],
        inLanguage: "fr",
        publisher: { "@id": personId },
      },
      {
        "@type": "Person",
        "@id": personId,
        name: SITE.fullName,
        alternateName: SITE.alternateNames,
        url: SITE.url,
        mainEntityOfPage: SITE.url,
        image: `${SITE.url}/images/profil.jpeg`,
        jobTitle: SITE.jobTitle,
        description: SITE.description,
        address: {
          "@type": "PostalAddress",
          addressLocality: SITE.city,
          addressCountry: SITE.country,
        },
        alumniOf: {
          "@type": "CollegeOrUniversity",
          name: "Institut Universitaire de la Côte (IUC)",
        },
        knowsAbout: [
          "Laravel",
          "PHP",
          "React",
          "Next.js",
          "Tailwind CSS",
          "UI/UX Design",
          "MySQL",
        ],
        sameAs: [SITE.github, SITE.linkedin],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
