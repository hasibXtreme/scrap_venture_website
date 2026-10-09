import SiteLayout from '../components/SiteLayout.jsx';
import Reveal from '../components/Reveal.jsx';
import team from '../data/team.js';
import {
  FacebookIcon,
  TwitterIcon,
  LinkedInIcon,
  GithubIcon,
  GlobeIcon,
} from '../components/icons.jsx';

function TeamSocialDock({ socials = {}, side = 'right' }) {
  const items = [
    { key: 'facebook', label: 'Facebook', Icon: FacebookIcon, cls: 'team-social-btn--fb' },
    { key: 'twitter', label: 'Twitter', Icon: TwitterIcon, cls: 'team-social-btn--tw' },
    { key: 'linkedin', label: 'LinkedIn', Icon: LinkedInIcon, cls: 'team-social-btn--li' },
    { key: 'github', label: 'GitHub', Icon: GithubIcon, cls: 'team-social-btn--gh' },
    { key: 'portfolio', label: 'Portfolio', Icon: GlobeIcon, cls: 'team-social-btn--web' },
  ];

  return (
    <div
      className={`team-social-dock team-social-dock--${side}`}
      role="group"
      aria-label="Social & Portfolio links"
    >
      {items.map(({ key, label, Icon, cls }) => {
        const url = socials[key] || '#';
        return (
          <a
            key={key}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={`team-social-btn ${cls}`}
            data-label={label}
            aria-label={label}
            title={label}
            onClick={(e) => {
              if (url === '#') e.preventDefault();
            }}
          >
            <Icon size={15} />
          </a>
        );
      })}
    </div>
  );
}

export default function Team() {
  return (
    <SiteLayout variant="team" main>
      {/* Ambient Eco Decorative Elements in Background */}
      <div className="team-bg-deco" aria-hidden="true">
        <img
          src="/assets/images/recycle.png"
          alt=""
          className="team-bg-watermark team-watermark-tl"
          loading="lazy"
        />
        <img
          src="/assets/images/recycle.png"
          alt=""
          className="team-bg-watermark team-watermark-tr"
          loading="lazy"
        />
        <img
          src="/assets/images/recycle.png"
          alt=""
          className="team-bg-watermark team-watermark-bl"
          loading="lazy"
        />
        <img
          src="/assets/images/recycle.png"
          alt=""
          className="team-bg-watermark team-watermark-br"
          loading="lazy"
        />
        <div className="team-glow-orb team-glow-orb--1"></div>
        <div className="team-glow-orb team-glow-orb--2"></div>
      </div>

      {/* Team Page Hero Header */}
      <section className="team-page-hero">
        <Reveal className="wrap team-page-hero__inner">
          <h1 className="page-title">
            The Passionate Minds Behind <span className="team-title-accent">ScrapVenture</span>
          </h1>
          <p className="page-subtitle">
            Meet the leaders, innovators, and advisors behind ScrapVenture — pioneering smart, tech-driven waste supply chains for a cleaner, circular green Bangladesh.
          </p>
        </Reveal>
      </section>

      {/* Main Team Roster Grid */}
      <section className="team-content-section">
        <div className="wrap">
          <div className="team-roster-grid">
            {team.map((member) => (
              <Reveal as="article" className="team-card" key={member.id}>
                {/* Photo on Top with Glaze Sheen & Animated Pop-Out Social Dock */}
                <div className="team-card__media">
                  <img
                    src={member.image}
                    alt={`${member.name} - ${member.rank}`}
                    loading="lazy"
                    className="team-card__img"
                  />

                  {/* Animated Social Links Dock (Slides out from Left or Right on Hover) */}
                  <TeamSocialDock
                    socials={member.socials}
                    side={member.socialSide || 'right'}
                  />
                </div>

                {/* Name, Rank & Bio */}
                <div className="team-card__body">
                  <h3 className="team-card__name">{member.name}</h3>
                  <p className="team-card__rank">{member.rank}</p>
                  <p className="team-card__desc">{member.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
