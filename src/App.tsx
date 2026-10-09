'use client'

import { useEffect, useState } from 'react'
import heroArt from './assets/hero.png'

const links = {
  discord: 'https://discord.gg/PYRASrnQ2x',
  instagram: 'https://www.instagram.com/sim_uottawa/',
  linkedin: 'https://www.linkedin.com/company/simuottawa/?viewAsMember=true',
}

const navItems = ['Home', 'About', 'Projects', 'FAQ', 'Contact']

type Faq = [question: string, answer: string, href?: string, linkLabel?: string]

type Team = {
  number: string
  slug: string
  name: string
  label: string
  summary: string
  role: string
  focus: string[]
  connection: string
}

const teams: Team[] = [
  {
    number: '01', slug: 'backend', name: 'Backend', label: 'ENGINE SYSTEMS',
    summary: 'Build the systems that make simulations run and keep the engine organized as it grows.',
    role: 'The backend team works on the logic beneath a simulation, from data flow to the systems that support physical behaviour.',
    focus: ['Simulation architecture', 'Physics and data systems', 'Performance and reliability'],
    connection: 'Backend work gives the visual teams the data they need and gives the frontend a dependable engine to work with.',
  },
  {
    number: '02', slug: 'part-rendering', name: 'Part rendering', label: '3D VISUALS',
    summary: 'Turn simulated parts and their properties into clear, useful 3D visuals.',
    role: 'The part rendering team focuses on how objects appear in the scene so members can inspect what a simulation is doing.',
    focus: ['Part appearance', 'Scene clarity', 'Visual feedback'],
    connection: 'Part rendering translates engine output into visible objects that people can explore through the frontend.',
  },
  {
    number: '03', slug: 'raytracing', name: 'Raytracing', label: 'LIGHT AND IMAGE',
    summary: 'Explore how light, surfaces, and camera views shape the final image.',
    role: 'The raytracing team studies rendering techniques that can make simulated scenes easier to read and more compelling to look at.',
    focus: ['Light and materials', 'Camera and image quality', 'Rendering experiments'],
    connection: 'Raytracing builds on scene information from part rendering and helps bring the engine’s output to life.',
  },
  {
    number: '04', slug: 'frontend', name: 'Frontend', label: 'USER EXPERIENCE',
    summary: 'Make the engine approachable through the controls and views people use every day.',
    role: 'The frontend team shapes the experience of setting up, viewing, and understanding a simulation.',
    focus: ['Interface design', 'Interaction and controls', 'Accessible workflows'],
    connection: 'Frontend connects the engine and visual systems to the people using SimuO.',
  },
  {
    number: '05', slug: 'media', name: 'Media', label: 'STORY AND COMMUNITY',
    summary: 'Share the work, document the journey, and help new members find their place.',
    role: 'The media team tells the story of what the club is building and makes its progress easier to discover.',
    focus: ['Project stories', 'Visual communication', 'Community updates'],
    connection: 'Media helps the work of every team reach students, collaborators, and future members.',
  },
]

const clubFaqs: Faq[] = [
  ['How do I join SimuOttawa?', 'Join our Discord server and introduce yourself. You can meet members and ask which teams are looking for help.', links.discord, 'Join Discord'],
  ['Where can I find meeting details?', 'Check the Discord server for current meeting times and locations.', links.discord, 'Check Discord'],
  ['What roles are available?', 'Our five teams are backend, part rendering, raytracing, frontend, and media. Visit Projects to learn about each one.', '#/projects', 'Explore the teams'],
  ['How do I start contributing?', 'Explore the teams on the Projects page, then introduce yourself on Discord and ask about current work that fits your interests.', '#/projects', 'Browse teams'],
  ['Can I switch roles later?', 'Yes. Projects evolve, and members are encouraged to explore different parts of the team as their interests and experience grow.'],
  ['Do I need a specific program or previous experience?', 'No. Students from different disciplines and experience levels are welcome. Curiosity and a willingness to learn are enough to start.'],
]

const projectFaqs: Faq[] = [
  ['What is SimuO?', 'SimuO is the club’s open-source 3D physics simulation engine. It is the shared project where members turn physical concepts into interactive software.'],
  ['Where can I see the code?', 'The SimuO code is available in its public repository.', 'https://github.com/simuottawa-oss/Python-version', 'View source code'],
  ['What programming languages do you use?', 'Work includes Python and C++. The tools can vary by team and by task.'],
  ['How do the teams work together?', 'Backend develops engine systems, rendering teams make the output visible, frontend shapes the controls, and media shares the work.', '#/projects', 'Explore the teams'],
  ['Is real-time simulation available?', 'Interactive, real-time simulation is a goal for SimuO. Check the public repository for the current implementation.', 'https://github.com/simuottawa-oss/Python-version', 'View source code'],
]

function ArrowIcon() {
  return <span aria-hidden="true">↗</span>
}

function routeFromHash() {
  const route = window.location.hash.replace(/^#\/?/, '').split('?')[0].toLowerCase()
  if (route === 'media') return 'contact'
  if (route === 'documentation') return 'projects'
  return route || 'home'
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
  return (
    <main>
      <section className="hero-section section-shell">
        <div className="hero-copy">
          <h1><span className="hero-line">You <span className="accent-word">Build.</span></span><span className="hero-line">We <span className="accent-word">Simulate.</span></span></h1>
          <p className="hero-lede">Students across code, physics, design, and media work together on SimuO, an open-source 3D physics engine.</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#/projects">Explore the teams <ArrowIcon /></a>
            <a className="text-link" href="#/about">About the club <span aria-hidden="true">→</span></a>
          </div>
          <dl className="hero-stats">
            <div><dt>5</dt><dd>Teams</dd></div>
            <div><dt>1</dt><dd>Shared engine</dd></div>
            <div><dt>All</dt><dd>Experience levels</dd></div>
          </dl>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <img src="/assets/simulation-orb.svg" alt="" />
          <span className="visual-label label-a">OPEN SOURCE</span>
          <span className="visual-label label-b">3D PHYSICS</span>
        </div>
      </section>

      <section className="marquee" aria-label="Club disciplines">
        <div>BUILD <span>✦</span> SIMULATE <span>✦</span> VISUALIZE <span>✦</span> UNDERSTAND <span>✦</span></div>
      </section>

      <section className="intro-section section-shell">
        <p className="section-index">01 / ABOUT</p>
        <div className="intro-copy">
          <h2>A club built around making.</h2>
          <p>SimuOttawa brings students from different disciplines together to build, explain, and learn from one shared engine.</p>
          <a className="text-link" href="#/about">Discover the club <span aria-hidden="true">→</span></a>
        </div>
      </section>

      <section className="home-project section-shell">
        <div className="home-project-art"><img src={heroArt} alt="Layered geometric illustration" /></div>
        <div className="home-project-copy">
          <p className="section-index">02 / THE ENGINE</p>
          <h2>One shared project.<br />Many ways in.</h2>
          <p>Explore the five teams building SimuO, from backend and rendering to frontend and media.</p>
          <a className="button button-outline" href="#/projects">Meet the teams <ArrowIcon /></a>
        </div>
      </section>
    </main>
  )
}

function AboutPage() {
  return (
    <main className="about-page">
      <section className="about-hero section-shell">
        <div className="about-hero-copy">
          <p className="section-index">01 / ABOUT SIMUOTTAWA</p>
          <h1>Curiosity looks better in motion.</h1>
          <p>We are a University of Ottawa student club building SimuO, an open-source 3D physics engine. Members learn by making one ambitious project together.</p>
          <div className="about-actions">
            <a className="button button-primary" href="#/projects">Explore the teams <ArrowIcon /></a>
          </div>
        </div>
        <div className="about-system" aria-label="Five teams contribute to the SimuO engine">
          <div className="about-system-top"><span>SIMUO / SHARED ENGINE</span><span>01 / 05</span></div>
          <div className="about-system-visual"><span className="about-system-ring" /><img src="/assets/simulation-orb.svg" alt="" /><strong>One project.<br />Five teams.</strong></div>
          <div className="about-system-tags">{teams.map((team) => <a href={`#/projects/${team.slug}`} key={team.slug}>{team.name} <span aria-hidden="true">↗</span></a>)}</div>
        </div>
      </section>
      <section className="about-purpose section-shell">
        <div><p className="section-index">WHAT WE DO</p><h2>Build, test, see, repeat.</h2></div>
        <div><p>Simulations make abstract ideas tangible. SimuO brings engine systems, visual rendering, interface design, and communication into one place so students can solve real problems with people from other disciplines.</p><p>Experience helps, but it is not a requirement. There is room to ask questions, try a new skill, and contribute to work the whole club can use.</p></div>
      </section>
      <section className="about-join section-shell">
        <div className="about-join-heading"><p className="section-index">HOW TO START</p><h2>What joining looks like.</h2><p>Find your place in the club one step at a time.</p></div>
        <ol className="about-join-steps">
          <li><span className="join-step-number">01</span><div><h3>Explore the teams</h3><p>See how the five teams contribute to SimuO and find the work that interests you.</p><a href="#/projects">Browse teams <ArrowIcon /></a></div></li>
          <li><span className="join-step-number">02</span><div><h3>Introduce yourself</h3><p>Join the Discord server, meet members, and tell us what you would like to learn.</p><a href={links.discord} target="_blank" rel="noreferrer">Join Discord <ArrowIcon /></a></div></li>
          <li><span className="join-step-number">03</span><div><h3>Find a first contribution</h3><p>Ask about current work and choose a starting point that fits your interests and experience.</p></div></li>
        </ol>
      </section>
      <section className="about-invite section-shell"><div><p className="section-index">GET INVOLVED</p><h2>Your first step can be a conversation.</h2></div><a className="button button-light" href={links.discord} target="_blank" rel="noreferrer">Meet us on Discord <ArrowIcon /></a></section>
    </main>
  )
}

function ProjectsPage() {
  return (
    <main className="projects-page">
      <PageIntro index="02" eyebrow="Projects" title="Five teams. One shared engine." lede="Explore the work behind SimuO and find the team that matches what you want to learn or build." />
      <section className="project-list section-shell">
        {teams.map((team) => (
          <a className="project-row" href={`#/projects/${team.slug}`} key={team.slug}>
            <span className="project-number">{team.number}</span>
            <div className="project-title"><small>{team.label}</small><h2>{team.name}</h2></div>
            <p>{team.summary}</p>
            <span className="project-arrow" aria-hidden="true">↗</span>
          </a>
        ))}
      </section>
      <section className="project-source section-shell">
        <div><p className="section-index">OPEN SOURCE</p><h2>See the engine behind the teams.</h2><p>Browse the public SimuO repository to explore the code and follow its development.</p></div>
        <a className="button button-outline" href="https://github.com/simuottawa-oss/Python-version" target="_blank" rel="noreferrer">Explore source code <ArrowIcon /></a>
      </section>
    </main>
  )
}

function TeamPage({ team }: { team: Team }) {
  return <main className="team-page">
    <section className="team-hero section-shell">
      <a className="team-back" href="#/projects"><span aria-hidden="true">←</span> All teams</a>
      <div className="team-hero-grid"><div><p className="section-index">02 / PROJECTS / {team.number}</p><p className="team-label">{team.label}</p><h1>{team.name}</h1><p className="team-lede">{team.summary}</p></div><div className="team-hero-art" aria-hidden="true"><span>{team.number}</span><img src="/assets/simulation-orb.svg" alt="" /></div></div>
    </section>
    <section className="team-content section-shell"><div className="team-role"><p className="section-index">THE ROLE</p><h2>What this team works on</h2><p>{team.role}</p></div><div className="team-focus"><p className="section-index">AREAS TO EXPLORE</p><ul>{team.focus.map((item, index) => <li key={item}><span>0{index + 1}</span>{item}</li>)}</ul></div></section>
    <section className="team-connection section-shell"><p className="section-index">HOW IT CONNECTS</p><p>{team.connection}</p></section>
    <section className="team-next section-shell"><div><p className="section-index">KEEP EXPLORING</p><h2>See the work. Meet the people.</h2></div><div><a className="button button-outline" href="https://github.com/simuottawa-oss/Python-version" target="_blank" rel="noreferrer">Explore source code <ArrowIcon /></a><a className="button button-primary" href={links.discord} target="_blank" rel="noreferrer">Talk to the team <ArrowIcon /></a></div></section>
  </main>
}

function FaqGroup({ title, items }: { title: string; items: Faq[] }) {
  return (
    <section className="faq-group">
      <h2>{title}</h2>
      <div>
        {items.map(([question, answer, href, linkLabel]) => (
          <details key={question}>
            <summary><span>{question}</span><i aria-hidden="true">+</i></summary>
            <p>{answer}</p>
            {href && <a className="faq-answer-link" href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noreferrer' : undefined}>{linkLabel} <ArrowIcon /></a>}
          </details>
        ))}
      </div>
    </section>
  )
}

function FaqPage() {
  return (
    <main className="faq-page">
      <PageIntro index="03" eyebrow="FAQ" title="Good questions deserve clear answers." lede="Find out how to join, choose a team, and explore SimuO." />
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
    ['Join or ask', 'Discord', 'Meet members, ask about current work, and find meeting details.', links.discord, 'D'],
    ['Follow updates', 'Instagram', 'Keep up with club news and what members are sharing.', links.instagram, 'IG'],
    ['Connect with us', 'LinkedIn', 'Follow milestones and connect with the club professionally.', links.linkedin, 'IN'],
  ]
  return (
    <main className="contact-page">
      <PageIntro index="04" eyebrow="Contact" title="Choose a channel." lede="Start with what you want to do. Each link takes you to a place where you can connect with SimuOttawa." />
      <section className="contact-grid section-shell">
        {contacts.map(([purpose, channel, description, url, monogram]) => (
          <a className="contact-card" href={url} target="_blank" rel="noreferrer" key={channel}>
            <span className="social-monogram" aria-hidden="true">{monogram}</span><div><small>{channel}</small><h2>{purpose}</h2><p>{description}</p></div><ArrowIcon />
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
  const selectedTeam = teams.find((team) => route === `projects/${team.slug}`)

  useEffect(() => {
    const onRouteChange = () => setRoute(routeFromHash())
    window.addEventListener('hashchange', onRouteChange)
    return () => window.removeEventListener('hashchange', onRouteChange)
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
    const team = teams.find((item) => route === `projects/${item.slug}`)
    const title = route === 'home' ? 'SimuOttawa | Physics in motion' : `${team?.name ?? route.charAt(0).toUpperCase() + route.slice(1)} | SimuOttawa`
    document.title = title
  }, [route])

  const pages: Record<string, React.ReactNode> = {
    home: <HomePage />, about: <AboutPage />, projects: <ProjectsPage />, faq: <FaqPage />, contact: <ContactPage />,
  }

  return <div className="site-frame"><Header route={selectedTeam ? 'projects' : pages[route] ? route : 'home'} />{selectedTeam ? <TeamPage team={selectedTeam} /> : pages[route] ?? <HomePage />}<Footer /></div>
}

export default App
