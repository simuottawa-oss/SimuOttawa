'use client'

import { useEffect, useState } from 'react'

const links = {
  discord: 'https://discord.gg/PYRASrnQ2x',
  instagram: 'https://www.instagram.com/sim_uottawa/',
  linkedin: 'https://www.linkedin.com/company/simuottawa/?viewAsMember=true',
}

const navItems = ['Home', 'About', 'Projects', 'Documentation', 'FAQ', 'Contact']

const clubFaqs = [
  ['How do I join SimuOttawa?', 'Join our Discord server and introduce yourself. It is the quickest way to meet the team, see current opportunities, and hear about the next meeting.'],
  ['What roles are available?', 'The club brings together software development, physics and mathematics, 3D visualization, product design, project management, marketing, and community outreach.'],
  ['How are roles assigned?', 'We match members with work that fits their interests and current skills, while leaving room to learn something new alongside more experienced teammates.'],
  ['Can I switch roles later?', 'Yes. Projects evolve, and members are encouraged to explore different parts of the team as their interests and experience grow.'],
  ['Do I need to be in a specific program?', 'No. SimuOttawa is built for curious students across disciplines. An interest in simulation, technology, design, or team building is enough to start.'],
  ['Do I need previous experience?', 'No. Beginners are welcome. What matters most is curiosity, consistency, and a willingness to learn with the team.'],
]

const projectFaqs = [
  ['What is SimuO?', 'SimuO is the club’s open-source 3D physics simulation engine—the shared project where members turn physical concepts into interactive software.'],
  ['Is the project open source?', 'Yes. SimuO is developed as an open-source project so members can learn from the code, contribute improvements, and build on one another’s work.'],
  ['What programming languages do you use?', 'The team works with both high- and low-level programming, including Python and C++, depending on the problem being solved.'],
  ['What kinds of projects does the club work on?', 'Work spans engine systems, simulation models, visualization, developer tools, documentation, user experience, and club communications.'],
  ['Does SimuO support real-time simulation?', 'Real-time, interactive simulation is one of the team’s core goals as the engine grows in accuracy, performance, and usability.'],
  ['What is the goal of the engine?', 'The goal is to make complex physical ideas easier to build, see, test, and understand—and to give students meaningful experience doing it.'],
]

const FUN_FACTS = [
  "Ever wanted to see pigs fly?",
  "You're a cool cat.",
  "The first computer mouse was made of wood.",
  "We all start from somewhere, glad you're starting here : ) .",
  ":) :O :O :O :).",
  "Twister was the first movie released on DVD"];

function ArrowIcon() {
  return <span aria-hidden="true">↗</span>
}

function routeFromHash() {
  const route = window.location.hash.replace(/^#\/?/, '').split('?')[0].toLowerCase()
  return route === 'media' ? 'contact' : route || 'home'
}

function Header({ route }: { route: string }) {
  const [open, setOpen] = useState(false)

  return (
    <header className="site-header">
      <a className="brand" href="#/" aria-label="SimuOttawa home">
        <img src="/assets/simu-logo.svg" alt="" />
        <span>Simu<em>Ottawa</em></span>
      </a>
      <button
        className="menu-button"
        type="button"
        aria-expanded={open}
        aria-controls="primary-nav"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="sr-only">Toggle navigation</span>
        <i />
        <i />
      </button>
      <nav id="primary-nav" className={open ? 'nav-links is-open' : 'nav-links'} aria-label="Primary navigation">
        {navItems.map((item) => {
          const itemRoute = item.toLowerCase()
          const href = item === 'Home' ? '#/' : `#/${itemRoute}`
          return <a key={item} onClick={() => setOpen(false)} className={route === itemRoute ? 'active' : ''} aria-current={route === itemRoute ? 'page' : undefined} href={href}>{item}</a>
        })}
        <a className="button button-light nav-cta" href={links.discord} target="_blank" rel="noreferrer">
          Join the team <ArrowIcon />
        </a>
      </nav>
    </header>
  )
}

function PageIntro({ index, eyebrow, title, lede }: { index: string; eyebrow: string; title: string; lede: string }) {
  return (
    <section className="page-intro section-shell">
      <p className="section-index">{index} / {eyebrow}</p>
      <h1>{title}</h1>
      <p className="page-lede">{lede}</p>
    </section>
  )
}

function HomePage() {
  const [funFact] = useState(() => FUN_FACTS[Math.floor(Math.random() * FUN_FACTS.length)]);

  return (
    <main>
      <section className="hero-section section-shell">
        <div className="hero-copy">
          <h1>You <span className="accent-word">Build.</span></h1>
          <h1>We <span className="accent-word">Simulate.</span></h1>
          <p className="hero-lede">{funFact}</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#/projects">Explore our work <ArrowIcon /></a>
            <a className="text-link" href="#/about">How the club works <span aria-hidden="true">→</span></a>
          </div>
          <dl className="hero-stats">
            <div><dt>50+</dt><dd>Members</dd></div>
            <div><dt>∞</dt><dd>Coffees Drunk</dd></div>
            <div><dt>100%</dt><dd>Beginner Friendly</dd></div>
          </dl>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <img src="/assets/simulation-orb.svg" alt="" />
          <span className="visual-label label-a">REAL-TIME</span>
          <span className="visual-label label-b">3D PHYSICS</span>
        </div>
      </section>

      <section className="marquee" aria-label="Club disciplines">
        <div>BUILD <span>✦</span> SIMULATE <span>✦</span> VISUALIZE <span>✦</span> UNDERSTAND <span>✦</span></div>
      </section>

      <section className="intro-section section-shell">
        <p className="section-index">01 / ABOUT</p>
        <div className="intro-copy">
          <h2>Infinite Possibilities.</h2>
          <p>SimuOttawa works toward simplifying the process of building models and creating accurate 3D physics simulations to allow for as much creativity as possible.</p>
          <a className="text-link" href="#/about">Discover the club <span aria-hidden="true">→</span></a>
        </div>
      </section>

      <section className="home-project section-shell">
        <div className="home-project-art"><img src="/assets/simulation-orb.svg" alt="Abstract 3D simulation rendered by SimuOttawa" /></div>
        <div className="home-project-copy">
          <p className="section-index">02 / THE ENGINE</p>
          <h2>One shared project.<br />Many ways in.</h2>
          <p>From collision systems to visual tools and documentation, SimuO gives every member a real piece of a growing technical project.</p>
          <a className="button button-outline" href="#/projects">See project areas <ArrowIcon /></a>
        </div>
      </section>
    </main>
  )
}

function AboutPage() {
  const pillars = [
    ['01', 'Build together', 'Contribute to a real, evolving engine instead of working through isolated exercises.'],
    ['02', 'Learn by doing', 'Apply programming, physics, mathematics, design, and project skills to tangible problems.'],
    ['03', 'Grow in public', 'Create portfolio-ready work, explain your thinking, and learn how collaborative software gets made.'],
    ['04', 'Make room', 'Welcome different disciplines and experience levels into one ambitious, student-led team.'],
  ]
  return (
    <main>
      <PageIntro index="01" eyebrow="About" title="Built by students who ask “what if?”" lede="SimuOttawa is a University of Ottawa club developing SimuO, an open-source 3D engine for accurate, understandable physical simulation." />
      <section className="statement section-shell">
        <p className="section-index">OUR MISSION</p>
        <p className="statement-text">Bridge the space between equations and experience—while giving students the confidence to build serious technical work together.</p>
      </section>
      <section className="pillar-grid section-shell">
        {pillars.map(([number, title, text]) => (
          <article className="pillar-card" key={number}>
            <span>{number}</span><h2>{title}</h2><p>{text}</p>
          </article>
        ))}
      </section>
      <section className="split-story section-shell">
        <div><p className="section-index">FOR STUDENTS</p><h2>Skills that move with you.</h2></div>
        <div>
          <p>Members work across Python, C++, 3D mathematics, simulation design, product thinking, communication, and team leadership.</p>
          <p>The result is more than a line on a résumé: it is the experience of making decisions, solving unfamiliar problems, and shipping alongside other people.</p>
        </div>
      </section>
    </main>
  )
}

function ProjectsPage() {
  const projects = [
    ['01', 'Core physics', 'ENGINE', 'Build the systems that describe motion, forces, collisions, and physical behaviour.'],
    ['02', '3D visualization', 'EXPERIENCE', 'Turn complex engine output into clear, responsive, and useful visual feedback.'],
    ['03', 'Developer tools', 'WORKFLOW', 'Improve the interfaces, utilities, testing, and documentation that make SimuO easier to use.'],
    ['04', 'Research & outreach', 'COMMUNITY', 'Explore new simulation ideas and share the team’s progress with students and partners.'],
  ]
  return (
    <main>
      <PageIntro index="02" eyebrow="Projects" title="A physics engine is never just one project." lede="SimuO grows through connected systems. Members can contribute where code, science, design, or communication best matches their curiosity." />
      <section className="project-list section-shell">
        {projects.map(([number, title, type, text]) => (
          <article className="project-row" key={number}>
            <span className="project-number">{number}</span>
            <div className="project-title"><small>{type}</small><h2>{title}</h2></div>
            <p>{text}</p>
            <span className="project-arrow" aria-hidden="true">↗</span>
          </article>
        ))}
      </section>
      <section className="process-section section-shell">
        <p className="section-index">HOW WE WORK</p>
        <div className="process-grid">
          {['Choose a problem', 'Prototype together', 'Test the physics', 'Share the result'].map((step, index) => <div key={step}><span>0{index + 1}</span><h3>{step}</h3></div>)}
        </div>
      </section>
    </main>
  )
}

function DocumentationPage() {
  const resources = [
    ['SimuO source code', 'Browse the engine, review open issues, and contribute to development.', 'https://github.com/simuottawa-oss/Python-version'],
    ['Project discussions', 'Meet the team and find out how to get involved in current work.', 'https://discord.gg/VREs6zwRsq'],
  ]

  return (
    <main>
      <PageIntro index="03" eyebrow="Documentation" title="Explore the project." lede="SimuOttawa does not host documents on this website. Find project materials and connect with the team through these external resources." />
      <section className="resource-list section-shell">
        {resources.map(([title, description, url], index) => (
          <a className="resource-row" href={url} target="_blank" rel="noreferrer" key={title}>
            <span className="project-number">0{index + 1}</span>
            <div><h2>{title}</h2><p>{description}</p></div>
            <ArrowIcon />
          </a>
        ))}
      </section>
    </main>
  )
}
function FaqGroup({ title, items }: { title: string; items: string[][] }) {
  return (
    <section className="faq-group">
      <h2>{title}</h2>
      <div>
        {items.map(([question, answer]) => (
          <details key={question}>
            <summary><span>{question}</span><i aria-hidden="true">+</i></summary>
            <p>{answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

function FaqPage() {
  return (
    <main>
      <PageIntro index="04" eyebrow="FAQ" title="Questions, meet answers." lede="Start here for the essentials about joining the club and contributing to SimuO." />
      <div className="faq-layout section-shell">
        <FaqGroup title="The club" items={clubFaqs} />
        <FaqGroup title="The project" items={projectFaqs} />
      </div>
      <section className="faq-contact section-shell"><p>Still wondering about something?</p><a className="text-link" href="#/contact">Talk to the team <span aria-hidden="true">→</span></a></section>
    </main>
  )
}

function ContactPage() {
  const contacts = [
    ['Discord', 'Join the team, meet members, or ask the development crew a question.', links.discord, 'D'],
    ['Instagram', 'Send us a quick message or keep up with life around the club.', links.instagram, 'IG'],
    ['LinkedIn', 'Follow announcements, milestones, and professional opportunities.', links.linkedin, 'IN'],
  ]
  return (
    <main>
      <PageIntro index="05" eyebrow="Contact" title="Let’s build something that moves." lede="Whether you want to contribute, collaborate, or simply learn more, choose the channel that fits your message." />
      <section className="contact-grid section-shell">
        {contacts.map(([name, text, url, monogram]) => (
          <a className="contact-card" href={url} target="_blank" rel="noreferrer" key={name}>
            <span className="social-monogram" aria-hidden="true">{monogram}</span><div><h2>{name}</h2><p>{text}</p></div><ArrowIcon />
          </a>
        ))}
      </section>
    </main>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="section-shell footer-main">
        <div className="footer-brand-block">
          <a className="brand" href="#/" aria-label="SimuOttawa home"><img src="/assets/simu-logo.svg" alt="" /><span>Simu<em>Ottawa</em></span></a>
          <p>Physics, rendered by students. Glad to have you!</p>
          <div className="footer-focus"><p className="footer-kicker">Curious about the club?</p><a className="button" href="#/contact">Find your way in <ArrowIcon /></a></div>
        </div>
        <nav className="footer-nav" aria-label="Footer navigation"><p>Explore SimuOttawa</p>{navItems.slice(1).map((item) => <a key={item} href={`#/${item.toLowerCase()}`}>{item}</a>)}</nav>
      </div>
      <div className="section-shell footer-bottom"><span>© {new Date().getFullYear()} SimuOttawa</span><span>University of Ottawa student club</span></div>
    </footer>
  )
}

function App() {
  const [route, setRoute] = useState(routeFromHash)

  useEffect(() => {
    const onRouteChange = () => setRoute(routeFromHash())
    window.addEventListener('hashchange', onRouteChange)
    return () => window.removeEventListener('hashchange', onRouteChange)
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
    const title = route === 'home' ? 'SimuOttawa — Physics in motion' : `${route.charAt(0).toUpperCase() + route.slice(1)} — SimuOttawa`
    document.title = title
  }, [route])

  const pages: Record<string, React.ReactNode> = {
    home: <HomePage />, about: <AboutPage />, projects: <ProjectsPage />, documentation: <DocumentationPage />, faq: <FaqPage />, contact: <ContactPage />,
  }

  return <div className="site-frame"><Header route={pages[route] ? route : 'home'} />{pages[route] ?? <HomePage />}<Footer /></div>
}

export default App
