import Reveal from './Reveal.jsx';
import { ArrowIcon } from './icons.jsx';

function Post({ cls, gradient, cat, title, excerpt }) {
  return (
    <a href="#footer" className={cls}>
      <div className="p-art" style={{ background: gradient }}></div>
      <div className="p-shade"></div>
      <div className="post-content">
        <span className="p-cat">{cat}</span>
        <h3>{title}</h3>
        {excerpt && <p className="excerpt">{excerpt}</p>}
        <span className="p-read">Read Article <ArrowIcon size={13} strokeWidth="2.6" /></span>
      </div>
    </a>
  );
}

export default function Blog() {
  return (
    <section className="blog" id="blog">
      <div className="wrap">
        <Reveal className="sec-head">
          <div>
            <p className="eyebrow">From The ScrapVenture Journal</p>
            <h2 className="title">Insights &amp; stories<br />from the circular economy.</h2>
          </div>
          <p className="desc">Recycling tips, market updates and stories from the circular economy.</p>
        </Reveal>

        <Reveal className="blog-grid">
          <Post cls="post feature" gradient="linear-gradient(145deg,#269C26,#156A15 80%)" cat="Market Update"
            title="Scrap metal prices are climbing this quarter — here's why"
            excerpt="A look at the copper and aluminum demand shift and what it means for your next pickup." />
          <div className="blog-side">
            <Post cls="post" gradient="linear-gradient(145deg,#2DB82D,#1E831E 80%)" cat="Recycling Tips"
              title="5 ways to sort your household scrap in under 10 minutes" />
            <Post cls="post" gradient="linear-gradient(145deg,#1F2937,#111827 80%)" cat="Stories"
              title="Inside a ScrapVenture pickup route in Dhaka" />
          </div>
        </Reveal>

        <Reveal className="blog-footer">
          <a href="#footer" className="btn btn-ghost-dark">View All Articles{' '}
            <ArrowIcon />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
