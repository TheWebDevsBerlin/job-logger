const searchByLocation = (location,title) => `
query {
  city(input: {slug: "${location}"}) {
    name
    jobs(where: {slug_contains: "${title}"}) {
      title
      slug
      commitment{
        title
      }
      description
      applyUrl
      company{
        name
        websiteUrl
        jobs{title}
        logoUrl
        slug
        jobs{slug}
      }
      locationNames
      remotes{name}
      cities{
        name
        country {name}
        type
        slug
        jobs {
          id
          title
        }
      }
      postedAt
    }
  }
}
`;

const searchByID = (company, title) => `
query {
  job(input:{
    jobSlug:"${title}"
    companySlug:"${company}"
  }) {
  title
  commitment {
    title
    slug
  }
  cities {
    name
    slug
    type
  }
  countries {
    name
    slug
    type
    isoCode
  }
  remotes {
    name
    slug
    type
  }
  applyUrl
  company {
    name
    slug
    websiteUrl
    logoUrl
    twitter
    emailed
  }
  tags {
    name
    slug
  }
  isPublished
  userEmail
  postedAt
  createdAt
  updatedAt
  description
  locationNames
}
}
`;

const allJobs = (slug) => `
query {
  cities {
    name
    jobs(where: {slug_contains: "${slug}"}){
      title
      slug
      commitment{
        title
      }
      description
      applyUrl
      company{
        name
        websiteUrl
        jobs{title}
        logoUrl
        slug
        jobs{slug}
      }
      locationNames
      remotes{name}
      cities{
        name
        country {name}
        type
        slug
        jobs {
          id
          title
        }
      }
      postedAt
    }
  }
}
`;

module.exports = {
  searchByLocation,
  searchByID,
  allJobs
};
