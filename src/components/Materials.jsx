import React from 'react';
import { Link } from 'react-router-dom';
import Reveal from './Reveal.jsx';
import { ArrowRightIcon } from './pickup/pickupIcons.jsx';

const MATERIALS = [
  {
    name: 'Paper',
    items: 'Newspapers, Office Paper, Magazines & Books',
    img: 'mat-paper.jpg',
    alt: 'Recycled paper materials',
    badge: 'High Demand',
    lg: true,
  },
  {
    name: 'Metal',
    items: 'Copper, Aluminum, Iron & Steel',
    img: 'mat-metal.jpg',
    alt: 'Scrap metal materials',
    badge: 'Top Rate',
  },
  {
    name: 'Plastic',
    items: 'PET Bottles, Containers & Cans',
    img: 'mat-plastic.jpg',
    alt: 'Plastic bottle materials',
    badge: 'Recyclable',
  },
  {
    name: 'E-Waste',
    items: 'Circuit Boards, Broken Devices, Cables & Laptops',
    img: 'mat-ewaste.jpg',
    alt: 'Electronic waste materials',
    badge: 'Special Care',
  },
  {
    name: 'Cardboard',
    items: 'Boxes, Packaging & Cartons',
    img: 'mat-cardboard.jpg',
    alt: 'Cardboard materials',
    badge: 'Bulk Pickup',
  },
  {
    name: 'RMG',
    items: 'Fabric Scraps, Clothes, Denim Pants & Garment Discards',
    img: 'mat-rmg.jpg',
    alt: 'RMG and textile garment recycling',
    badge: 'High Demand',
    lg: true,
  },
];

export default function Materials() {
  return (
    <section className="materials" id="materials">
      {/* Background Recycle Watermarks with increased opacity on Top-Left & Bottom-Right */}
      <div className="mat-bg-deco" aria-hidden="true">
        {/* Top-Left Authentic 3-Arrow Recycling Watermark */}
        <img
          src="assets/images/recycle.png"
          alt=""
          className="mat-bg-watermark mat-watermark-recycle-tl"
          loading="lazy"
        />

        {/* Bottom-Right Authentic 3-Arrow Recycling Watermark */}
        <img
          src="assets/images/recycle.png"
          alt=""
          className="mat-bg-watermark mat-watermark-recycle-br"
          loading="lazy"
        />
      </div>

      <div className="wrap mat-container">
        {/* Centered Modern Section Header */}
        <Reveal className="mat-sec-header">
          <p className="eyebrow">What We Collect</p>

          <h2 className="mat-title">
            Different scrap. <span className="mat-title-accent">One purpose.</span>
          </h2>

          <p className="mat-subtitle-lead">
            From household recyclables to commercial discards, we collect, sort, and channel materials into verified eco-friendly recycling streams.
          </p>
        </Reveal>

        {/* Mosaic Grid with bottom-left material names & items list */}
        <Reveal className="mosaic">
          {MATERIALS.map((m) => (
            <Link
              to="/book-pickup"
              className={'mat-card' + (m.lg ? ' lg' : '') + (m.name === 'RMG' ? ' mat-card-rmg' : '')}
              key={m.name}
              aria-label={`Schedule pickup for ${m.name}`}
            >
              <img src={`assets/images/${m.img}`} alt={m.alt} loading="lazy" />
              <div className="mat-card-overlay" />

              {/* Top Tag Badge */}
              {m.badge && (
                <div className="mat-card-top-badge">
                  <span>{m.badge}</span>
                </div>
              )}

              {/* Bottom Left Content */}
              <div className="mat-card-content">
                <div className="m-name">{m.name}</div>
                <p className="m-items">{m.items}</p>
              </div>

              {/* Bottom Right Arrow Icon */}
              <div className="mat-card-arrow" aria-hidden="true">
                <ArrowRightIcon size={14} color="#ffffff" />
              </div>
            </Link>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
