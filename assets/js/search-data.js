// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "about",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-news",
          title: "news",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/news/";
          },
        },{id: "nav-blog",
          title: "blog",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/blog/";
          },
        },{id: "nav-publications",
          title: "publications",
          description: "Publications by categories in reversed chronological order.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "nav-projects",
          title: "projects",
          description: "A collection of the things I&#39;ve shipped. 🚀",
          section: "Navigation",
          handler: () => {
            window.location.href = "/projects/";
          },
        },{id: "books-the-godfather",
          title: 'The Godfather',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/the_godfather/";
            },},{id: "news-was-awarded-my-ph-d-in-medicine-from-king-s-college-london-uk",
          title: 'Was awarded my Ph.D. in Medicine from King’s College London, UK. 🍾',
          description: "",
          section: "News",},{id: "news-i-worked-alongside-soldiers-to-develop-ai-to-make-soldiers-more-operationally-efficient",
          title: 'I worked alongside soldiers to develop AI to make soldiers more operationally efficient....',
          description: "",
          section: "News",},{id: "news-built-a-novel-real-time-slip-and-fall-detection-model-that-was-light-years-ahead-of-the-field",
          title: 'Built a novel real-time slip and fall detection model that was light-years ahead...',
          description: "",
          section: "News",},{id: "news-flew-to-️-and-worked-like-hell-to-close-a-1m-tcv-deal-as-a-pre-sales-solution-architect",
          title: 'Flew to ⛩️ and worked like hell to close a $1M TCV deal...',
          description: "",
          section: "News",},{id: "news-co-founded-bynd-bio-to-help-cro-s-do-science-faster-for-others",
          title: 'Co-founded bynd.bio to help CRO’s do science faster for others. 🧫🧑‍🔬🧪',
          description: "",
          section: "News",},{id: "news-decided-to-10x-my-full-stack-ai-engineering-skills-by-joining-fractal-bootcamp",
          title: 'Decided to 10x my full-stack AI engineering skills by joining Fractal Bootcamp. 🚀...',
          description: "",
          section: "News",},{id: "projects-project-1",
          title: 'project 1',
          description: "with background image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/1_project/";
            },},{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/ajay-bhargava", "_blank");
        },
      },{
        id: 'social-linkedin',
        title: 'LinkedIn',
        section: 'Socials',
        handler: () => {
          window.open("https://www.linkedin.com/in/ajaybhargava", "_blank");
        },
      },{
        id: 'social-scholar',
        title: 'Google Scholar',
        section: 'Socials',
        handler: () => {
          window.open("https://scholar.google.com/citations?user=Cr4HEHYAAAAJ", "_blank");
        },
      },{
        id: 'social-x',
        title: 'X',
        section: 'Socials',
        handler: () => {
          window.open("https://twitter.com/129515", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
