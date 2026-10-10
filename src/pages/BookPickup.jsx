import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SiteLayout from '../components/SiteLayout.jsx';
import {
  UserIcon,
  PhoneIcon,
  MailIcon,
  MapPinIcon,
  CompassIcon,
  CalendarIcon,
  ClockIcon,
  FileTextIcon,
  CheckCircleIcon,
  TruckIcon,
  ScaleIcon,
  WalletIcon,
  ShieldCheckIcon,
  RecycleIcon,
  RealisticRecycleBlackIcon,
  PlasticBottleIcon,
  PaperStackIcon,
  CardboardBoxIcon,
  MetalIcon,
  EwasteIcon,
  TextileIcon,
  GlassBottleIcon,
  TrashIcon,
  SearchIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from '../components/pickup/pickupIcons.jsx';

// 8 Available Recyclable Waste Types with Rates and Realistic SVG Icons
const WASTE_TYPES = [
  {
    id: 'plastic',
    name: 'Plastic',
    iconComponent: PlasticBottleIcon,
    defaultPrice: 35,
    unit: 'kg',
    popularDefaultKg: 10,
    desc: 'PET bottles, HDPE containers, hard plastics',
    badgeColor: '#0284c7',
  },
  {
    id: 'paper',
    name: 'Paper',
    iconComponent: PaperStackIcon,
    defaultPrice: 18,
    unit: 'kg',
    popularDefaultKg: 10,
    desc: 'Old newspapers, office papers, magazines, books',
    badgeColor: '#059669',
  },
  {
    id: 'cardboard',
    name: 'Cardboard',
    iconComponent: CardboardBoxIcon,
    defaultPrice: 15,
    unit: 'kg',
    popularDefaultKg: 10,
    desc: 'Corrugated cartons, packaging boxes, carton sheets',
    badgeColor: '#d97706',
  },
  {
    id: 'metal',
    name: 'Metal',
    iconComponent: MetalIcon,
    defaultPrice: 80,
    unit: 'kg',
    popularDefaultKg: 5,
    desc: 'Iron rods, aluminum cans, copper wires, brass scrap',
    badgeColor: '#475569',
  },
  {
    id: 'ewaste',
    name: 'E-Waste',
    iconComponent: EwasteIcon,
    defaultPrice: 120,
    unit: 'kg',
    popularDefaultKg: 5,
    desc: 'Old phones, PCBs, laptop batteries, wires, chargers',
    badgeColor: '#7c3aed',
  },
  {
    id: 'textile',
    name: 'Textile / RMG Waste',
    iconComponent: TextileIcon,
    defaultPrice: 25,
    unit: 'kg',
    popularDefaultKg: 15,
    desc: 'Garment fabric scraps, cotton cuts, rejected clothes',
    badgeColor: '#db2777',
  },
  {
    id: 'glass',
    name: 'Glass',
    iconComponent: GlassBottleIcon,
    defaultPrice: 12,
    unit: 'kg',
    popularDefaultKg: 10,
    desc: 'Glass bottles, broken clean glassware, jars',
    badgeColor: '#0891b2',
  },
  {
    id: 'other',
    name: 'Other Recyclables',
    iconComponent: RealisticRecycleBlackIcon,
    defaultPrice: 20,
    unit: 'kg',
    popularDefaultKg: 10,
    desc: 'Mixed recyclables, rubber, tyres, bulk scrap',
    badgeColor: '#16a34a',
  },
];

// Popular Areas in Bangladesh for quick 1-click map positioning
const POPULAR_LOCATIONS = [
  { name: 'Mirpur, Dhaka', lat: 23.8041, lng: 90.3667 },
  { name: 'Dhanmondi, Dhaka', lat: 23.7461, lng: 90.3742 },
  { name: 'Gulshan 2, Dhaka', lat: 23.7925, lng: 90.4178 },
  { name: 'Uttara, Dhaka', lat: 23.8759, lng: 90.3795 },
  { name: 'Banani, Dhaka', lat: 23.7937, lng: 90.4043 },
  { name: 'GEC, Chittagong', lat: 22.3592, lng: 91.8214 },
];

// 5 Core Business Stages of Pickup Lifecycle
const TRACKING_STAGES = [
  { id: 'requested', name: 'Requested', iconComponent: FileTextIcon, desc: 'Request submitted to dispatch' },
  { id: 'confirmed', name: 'Confirmed', iconComponent: CheckCircleIcon, desc: 'Dispatch confirmed pickup' },
  { id: 'assigned', name: 'Collector Assigned', iconComponent: UserIcon, desc: 'Collector assigned' },
  { id: 'collected', name: 'Collected', iconComponent: CardboardBoxIcon, desc: 'Scrap collected from doorstep' },
  { id: 'paid', name: 'Payment Completed', iconComponent: WalletIcon, desc: 'Payment completed' },
];

const getStageIndex = (status) => {
  switch (status) {
    case 'requested': return 0;
    case 'confirmed': return 1;
    case 'assigned': return 2;
    case 'collected': return 3;
    case 'paid': return 4;
    default: return 0;
  }
};

export default function BookPickup() {
  const location = useLocation();

  // Top-level View: 'book' or 'track'
  const [activeTab, setActiveTab] = useState('book');

  // Wizard Step State: 1 = Customer Info, 2 = Materials, 3 = Location, 4 = Schedule & Instructions, 5 = Review & Booking Summary
  const [currentStep, setCurrentStep] = useState(1);

  // Section 1: Customer Information
  const [customer, setCustomer] = useState({
    fullName: '',
    phone: '',
    email: '',
    altPhone: '',
  });

  // Section 2: Selected Waste Items (Starts clean, user selects)
  const [selectedWaste, setSelectedWaste] = useState({});

  // Section 3: Pickup Location
  const [coords, setCoords] = useState({ lat: 23.8041, lng: 90.3667 });
  const [manualAddress, setManualAddress] = useState({
    house: '',
    road: '',
    area: '',
    city: 'Dhaka',
    district: 'Dhaka',
    postalCode: '',
    details: '',
  });
  const [mapSearchQuery, setMapSearchQuery] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const mapRef = useRef(null);
  const leafletInstance = useRef(null);
  const markerInstance = useRef(null);

  // Section 4: Preferred Pickup Schedule
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const [pickupDate, setPickupDate] = useState(tomorrowStr);
  const [pickupTime, setPickupTime] = useState('09:00 AM - 12:00 PM');

  // Section 5: Special Instructions
  const [instructions, setInstructions] = useState('');

  // Validation errors
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookedSuccess, setBookedSuccess] = useState(null);

  // Tracking state
  const [trackedBooking, setTrackedBooking] = useState(null);
  const [searchTrackingId, setSearchTrackingId] = useState('');

  // Check query params on mount & purge dummy test bookings from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('scrapventure_bookings');
      if (raw) {
        const stored = JSON.parse(raw);
        if (Array.isArray(stored)) {
          // Remove dummy test orders like SB-31238 or SV-31238
          const filtered = stored.filter(
            (b) => !b.id?.includes('31238') && !b.id?.toUpperCase().includes('SB-')
          );
          if (filtered.length !== stored.length) {
            localStorage.setItem('scrapventure_bookings', JSON.stringify(filtered));
          }
        }
      }
    } catch {
      // ignore
    }

    const params = new URLSearchParams(location.search);
    const trackId = params.get('track');
    if (trackId || location.hash === '#track') {
      setActiveTab('track');
      if (trackId) {
        setSearchTrackingId(trackId);
        loadBookingById(trackId);
      }
    }
  }, [location]);

  // Leaflet Map Initialization (Step 3)
  useEffect(() => {
    if (activeTab !== 'book' || currentStep !== 3) return;

    const timer = setTimeout(() => {
      if (window.L && mapRef.current) {
        if (!leafletInstance.current) {
          const map = window.L.map(mapRef.current, {
            center: [coords.lat, coords.lng],
            zoom: 14,
            zoomControl: true,
          });

          window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19,
          }).addTo(map);

          // Sleek Emerald Green Map Marker
          const greenIcon = window.L.divIcon({
            className: 'custom-map-pin',
            html: `
              <div style="
                background: #188746;
                width: 32px;
                height: 32px;
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                border: 2.5px solid #ffffff;
              ">
                <span style="transform: rotate(45deg); font-size: 13px; color: white;">📍</span>
              </div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32],
          });

          const marker = window.L.marker([coords.lat, coords.lng], {
            draggable: true,
            icon: greenIcon,
          }).addTo(map);

          marker.bindPopup('<b>Selected Pickup Location</b><br/>Drag to adjust exact location.').openPopup();

          marker.on('dragend', (e) => {
            const pos = e.target.getLatLng();
            setCoords({
              lat: parseFloat(pos.lat.toFixed(4)),
              lng: parseFloat(pos.lng.toFixed(4)),
            });
          });

          map.on('click', (e) => {
            marker.setLatLng(e.latlng);
            setCoords({
              lat: parseFloat(e.latlng.lat.toFixed(4)),
              lng: parseFloat(e.latlng.lng.toFixed(4)),
            });
          });

          leafletInstance.current = map;
          markerInstance.current = marker;
        } else {
          leafletInstance.current.invalidateSize();
          leafletInstance.current.setView([coords.lat, coords.lng], 14);
          if (markerInstance.current) {
            markerInstance.current.setLatLng([coords.lat, coords.lng]);
          }
        }
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [activeTab, currentStep, coords.lat, coords.lng]);

  // Waste selection handlers
  const toggleWasteType = (typeId) => {
    setSelectedWaste((prev) => {
      const copy = { ...prev };
      if (copy[typeId]) {
        delete copy[typeId];
      } else {
        const item = WASTE_TYPES.find((w) => w.id === typeId);
        copy[typeId] = {
          weight: item ? item.popularDefaultKg : 10,
          price: item ? item.defaultPrice : 20,
        };
      }
      return copy;
    });
    if (errors.waste) setErrors((prev) => ({ ...prev, waste: null }));
  };

  const updateWeight = (typeId, weight) => {
    const safeWeight = Math.max(1, parseFloat(weight) || 0);
    setSelectedWaste((prev) => ({
      ...prev,
      [typeId]: {
        ...prev[typeId],
        weight: safeWeight,
      },
    }));
  };

  // Calculations for total weight & value
  const wasteList = Object.entries(selectedWaste).map(([id, data]) => {
    const meta = WASTE_TYPES.find((w) => w.id === id) || {
      name: id,
      iconComponent: RecycleIcon,
      defaultPrice: data.price,
      unit: 'kg',
    };
    const subtotal = Math.round(data.weight * data.price);
    return {
      id,
      name: meta.name,
      iconComponent: meta.iconComponent,
      weight: data.weight,
      price: data.price,
      unit: meta.unit,
      subtotal,
    };
  });

  const totalEstimatedWeight = wasteList.reduce((acc, curr) => acc + curr.weight, 0);
  const totalEstimatedValue = wasteList.reduce((acc, curr) => acc + curr.subtotal, 0);

  // Full composite address string
  const fullAddressString = [
    manualAddress.house,
    manualAddress.road,
    manualAddress.area,
    manualAddress.city,
    manualAddress.district,
    manualAddress.postalCode ? `- ${manualAddress.postalCode}` : '',
  ]
    .filter(Boolean)
    .join(', ');

  // Geolocation handler (HTML5 GPS)
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const newCoords = {
          lat: parseFloat(pos.coords.latitude.toFixed(4)),
          lng: parseFloat(pos.coords.longitude.toFixed(4)),
        };
        setCoords(newCoords);
        setManualAddress((prev) => ({
          ...prev,
          area: 'Detected GPS Location',
          city: 'Dhaka',
        }));
        if (leafletInstance.current && markerInstance.current) {
          leafletInstance.current.setView([newCoords.lat, newCoords.lng], 16);
          markerInstance.current.setLatLng([newCoords.lat, newCoords.lng]);
        }
      },
      () => {
        setIsLocating(false);
        alert('Could not retrieve your location. You can select an area on the map or type your address manually.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSelectPopularArea = (loc) => {
    setCoords({ lat: loc.lat, lng: loc.lng });
    const parts = loc.name.split(', ');
    setManualAddress((prev) => ({
      ...prev,
      area: parts[0] || prev.area,
      city: parts[1] || prev.city,
    }));
    if (leafletInstance.current && markerInstance.current) {
      leafletInstance.current.setView([loc.lat, loc.lng], 15);
      markerInstance.current.setLatLng([loc.lat, loc.lng]);
    }
  };

  const handleMapSearch = (e) => {
    e.preventDefault();
    if (!mapSearchQuery.trim()) return;
    const found = POPULAR_LOCATIONS.find((loc) =>
      loc.name.toLowerCase().includes(mapSearchQuery.toLowerCase())
    );
    if (found) {
      handleSelectPopularArea(found);
    } else {
      const customLat = 23.75 + Math.random() * 0.12;
      const customLng = 90.36 + Math.random() * 0.08;
      const newCoords = {
        lat: parseFloat(customLat.toFixed(4)),
        lng: parseFloat(customLng.toFixed(4)),
      };
      setCoords(newCoords);
      setManualAddress((prev) => ({
        ...prev,
        area: mapSearchQuery,
      }));
      if (leafletInstance.current && markerInstance.current) {
        leafletInstance.current.setView([newCoords.lat, newCoords.lng], 15);
        markerInstance.current.setLatLng([newCoords.lat, newCoords.lng]);
      }
    }
  };

  // STEP NAVIGATION & VALIDATION
  const goToNextStep = () => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!customer.fullName.trim()) newErrors.fullName = 'Please enter your full name.';
      if (!customer.phone.trim()) newErrors.phone = 'Please enter your phone number.';
      if (!customer.email.trim()) newErrors.email = 'Please enter your email address.';
    } else if (currentStep === 2) {
      if (wasteList.length === 0) {
        newErrors.waste = 'Please select at least one material to sell.';
      }
    } else if (currentStep === 3) {
      if (!manualAddress.area.trim()) {
        newErrors.address = 'Please enter your area or neighborhood.';
      }
    } else if (currentStep === 4) {
      if (!pickupDate) newErrors.date = 'Please select a pickup date.';
      if (!pickupTime) newErrors.time = 'Please select a pickup time slot.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setCurrentStep((prev) => Math.min(5, prev + 1));
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  const goToPrevStep = () => {
    setErrors({});
    setCurrentStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  // Final Booking Confirmation (Section 7)
  const handleFinalBookingSubmit = () => {
    setIsSubmitting(true);

    setTimeout(() => {
      const randomNum = Math.floor(10000 + Math.random() * 90000);
      const uniqueId = `#SV-${randomNum}`;

      const bookingPayload = {
        id: uniqueId,
        createdAt: new Date().toISOString(),
        customer: { ...customer },
        items: wasteList,
        totalWeight: totalEstimatedWeight,
        totalValue: totalEstimatedValue,
        address: fullAddressString || `${manualAddress.area}, ${manualAddress.city}`,
        coords: { ...coords },
        pickupDate,
        pickupTime,
        instructions: instructions || 'No special instructions provided.',
        status: 'requested',
        collector: null,
      };

      try {
        const stored = JSON.parse(localStorage.getItem('scrapventure_bookings') || '[]');
        const updated = [bookingPayload, ...stored];
        localStorage.setItem('scrapventure_bookings', JSON.stringify(updated));
      } catch {
        // fallback
      }

      setBookedSuccess(bookingPayload);
      setTrackedBooking(bookingPayload);
      setIsSubmitting(false);
    }, 700);
  };

  // Tracking lookup
  const loadBookingById = (searchId) => {
    const cleanId = searchId.trim().toUpperCase();
    try {
      const stored = JSON.parse(localStorage.getItem('scrapventure_bookings') || '[]');
      const found = stored.find(
        (b) => b.id.toUpperCase() === cleanId || b.id.replace('#', '').toUpperCase() === cleanId
      );
      if (found) {
        setTrackedBooking(found);
      } else {
        setTrackedBooking(null);
        alert(`No pickup booking found with ID "${searchId}". Please check your Pickup ID.`);
      }
    } catch {
      // fallback
    }
  };

  const WIZARD_STEPS = [
    { num: 1, title: 'Your Details', short: 'Customer' },
    { num: 2, title: 'Materials', short: 'Materials' },
    { num: 3, title: 'Location', short: 'Location' },
    { num: 4, title: 'Schedule', short: 'Schedule' },
    { num: 5, title: 'Review & Book', short: 'Summary' },
  ];

  return (
    <SiteLayout variant="bookPickup">
      <div className="pickup-page">
        <div className="wrap">
          {/* Header & Breadcrumb */}
          <div className="pickup-hero">
            <nav className="pickup-breadcrumb" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span>/</span>
              <span style={{ color: 'var(--ink)' }}>Book a Pickup</span>
            </nav>
            <h1 className="pickup-title">Turn Your Scrap into Instant Value</h1>
            <p className="pickup-subtitle">
              Schedule an on-demand doorstep pickup. Transparent digital weighing, fair market rates, and instant spot payment.
            </p>

            {/* View Switcher: Book New Pickup vs Track Existing */}
            <div className="pickup-view-tabs" role="tablist">
              <button
                type="button"
                className={`pickup-view-tab ${activeTab === 'book' ? 'active' : ''}`}
                onClick={() => setActiveTab('book')}
              >
                <CalendarIcon size={16} />
                <span>Book New Pickup</span>
              </button>
              <button
                type="button"
                className={`pickup-view-tab ${activeTab === 'track' ? 'active' : ''}`}
                onClick={() => setActiveTab('track')}
              >
                <TruckIcon size={16} />
                <span>Track Pickup Status</span>
              </button>
            </div>


          </div>

          {/* ===================================================================
              VIEW 1: STEP-BY-STEP BOOKING WIZARD (One step at a time)
              =================================================================== */}
          {activeTab === 'book' && (
            <div className="wizard-form-box">
              {/* Top Stepper Indicator */}
              <div className="wizard-stepper-container">
                <div className="wizard-steps-list">
                  {WIZARD_STEPS.map((s, idx) => {
                    const isCompleted = s.num < currentStep;
                    const isActive = s.num === currentStep;
                    return (
                      <div key={s.num} style={{ display: 'contents' }}>
                        <button
                          type="button"
                          className={`wizard-step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                          onClick={() => {
                            if (isCompleted) setCurrentStep(s.num);
                          }}
                          disabled={!isCompleted && !isActive}
                        >
                          <div className="wizard-step-circle">
                            {isCompleted ? <CheckCircleIcon size={16} /> : s.num}
                          </div>
                          <div className="wizard-step-label">
                            <span className="wizard-step-num">Step {s.num}</span>
                            <span className="wizard-step-title">{s.title}</span>
                          </div>
                        </button>
                        {idx < WIZARD_STEPS.length - 1 && (
                          <div className={`wizard-divider ${isCompleted ? 'completed' : ''}`} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* STEP 1: CUSTOMER INFORMATION */}
              {currentStep === 1 && (
                <div className="pickup-card" id="customer-step">
                  <div className="pickup-sec-head">
                    <div>
                      <span className="pickup-sec-num">Step 1 of 5</span>
                      <h2 className="pickup-sec-title">Customer Information</h2>
                      <p className="pickup-sec-desc">
                        Please provide your contact details so our collector can coordinate with you.
                      </p>
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">
                        Full Name / আপনার নাম <span className="required">*</span>
                      </label>
                      <div className="input-wrap" style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
                        <span
                          className="input-icon"
                          style={{
                            position: 'absolute',
                            left: '14px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#94a3b8',
                            pointerEvents: 'none',
                            zIndex: 2,
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <UserIcon size={18} />
                        </span>
                        <input
                          type="text"
                          className={`form-input ${errors.fullName ? 'has-error' : ''}`}
                          style={{ paddingLeft: '44px' }}
                          placeholder="Full Name / আপনার নাম"
                          value={customer.fullName}
                          onChange={(e) => {
                            setCustomer({ ...customer, fullName: e.target.value });
                            if (errors.fullName) setErrors({ ...errors, fullName: null });
                          }}
                        />
                      </div>
                      {errors.fullName && <span className="form-error-msg">{errors.fullName}</span>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Contact Number / ফোন নম্বর <span className="required">*</span>
                      </label>
                      <div className="input-wrap" style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
                        <span
                          className="input-icon"
                          style={{
                            position: 'absolute',
                            left: '14px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#94a3b8',
                            pointerEvents: 'none',
                            zIndex: 2,
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <PhoneIcon size={18} />
                        </span>
                        <input
                          type="tel"
                          className={`form-input ${errors.phone ? 'has-error' : ''}`}
                          style={{ paddingLeft: '44px' }}
                          placeholder="01XXXXXXXXX / ফোন নম্বর"
                          value={customer.phone}
                          onChange={(e) => {
                            setCustomer({ ...customer, phone: e.target.value });
                            if (errors.phone) setErrors({ ...errors, phone: null });
                          }}
                        />
                      </div>
                      {errors.phone && <span className="form-error-msg">{errors.phone}</span>}
                    </div>
                  </div>

                  <div className="form-grid-2" style={{ marginTop: 14 }}>
                    <div className="form-group">
                      <label className="form-label">
                        Email Address / আপনার ইমেইল <span className="required">*</span>
                      </label>
                      <div className="input-wrap" style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
                        <span
                          className="input-icon"
                          style={{
                            position: 'absolute',
                            left: '14px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#94a3b8',
                            pointerEvents: 'none',
                            zIndex: 2,
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <MailIcon size={18} />
                        </span>
                        <input
                          type="email"
                          className={`form-input ${errors.email ? 'has-error' : ''}`}
                          style={{ paddingLeft: '44px' }}
                          placeholder="Email Address / আপনার ইমেইল"
                          value={customer.email}
                          onChange={(e) => {
                            setCustomer({ ...customer, email: e.target.value });
                            if (errors.email) setErrors({ ...errors, email: null });
                          }}
                        />
                      </div>
                      {errors.email && <span className="form-error-msg">{errors.email}</span>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Alternative Contact Number / বিকল্প ফোন নম্বর <span className="optional">(ঐচ্ছিক)</span>
                      </label>
                      <div className="input-wrap" style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
                        <span
                          className="input-icon"
                          style={{
                            position: 'absolute',
                            left: '14px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#94a3b8',
                            pointerEvents: 'none',
                            zIndex: 2,
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <PhoneIcon size={18} />
                        </span>
                        <input
                          type="tel"
                          className="form-input"
                          style={{ paddingLeft: '44px' }}
                          placeholder="Optional phone / বিকল্প ফোন নম্বর"
                          value={customer.altPhone}
                          onChange={(e) => setCustomer({ ...customer, altPhone: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Step Footer Navigation */}
                  <div className="step-nav-footer">
                    <button
                      type="button"
                      className="btn-step-next"
                      onClick={goToNextStep}
                    >
                      <span>Continue to Materials</span>
                      <ArrowRightIcon size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: WHAT DO YOU WANT TO SELL? (WASTE SELECTION) */}
              {currentStep === 2 && (
                <div className="pickup-card" id="waste-step">
                  <div className="pickup-sec-head">
                    <div>
                      <span className="pickup-sec-num">Step 2 of 5</span>
                      <h2 className="pickup-sec-title">What Do You Want to Sell?</h2>
                      <p className="pickup-sec-desc">
                        Select one or multiple recyclable materials and set estimated weight in kilograms (kg).
                      </p>
                    </div>
                  </div>

                  {errors.waste && (
                    <div
                      style={{
                        background: '#fee2e2',
                        color: '#b91c1c',
                        padding: '10px 14px',
                        borderRadius: 8,
                        marginBottom: 16,
                        fontSize: 13.5,
                        fontWeight: 700,
                      }}
                    >
                      {errors.waste}
                    </div>
                  )}

                  {/* Category Selection Grid with Realistic Vector Icons */}
                  <div className="waste-category-grid">
                    {WASTE_TYPES.map((type) => {
                      const isSelected = !!selectedWaste[type.id];
                      const IconComp = type.iconComponent;
                      return (
                        <button
                          key={type.id}
                          type="button"
                          className={`waste-cat-btn ${isSelected ? 'selected' : ''}`}
                          onClick={() => toggleWasteType(type.id)}
                        >
                          <div
                            style={{
                              width: 44,
                              height: 44,
                              borderRadius: 10,
                              background: isSelected ? 'var(--green-light)' : '#f1f5f9',
                              color: isSelected ? 'var(--green-dark)' : '#475569',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginBottom: 8,
                              transition: 'all 0.2s ease',
                            }}
                          >
                            <IconComp size={22} />
                          </div>
                          <span className="waste-cat-name">{type.name}</span>
                          <span className="waste-cat-rate">৳{type.defaultPrice} / {type.unit}</span>
                          {isSelected && <span className="waste-cat-check">✓</span>}
                        </button>
                      );
                    })}
                  </div>

                  {/* Itemized Cards for selected items */}
                  <div className="selected-waste-list">
                    {wasteList.length === 0 ? (
                      <div
                        style={{
                          background: '#f8fafc',
                          border: '1.5px dashed #cbd5e1',
                          borderRadius: 14,
                          padding: '32px 20px',
                          textAlign: 'center',
                          color: '#64748b',
                        }}
                      >
                        <p style={{ margin: '0 0 6px', fontWeight: 700, fontSize: 15, color: '#334155' }}>
                          No materials selected yet
                        </p>
                        <p style={{ margin: 0, fontSize: 13.5 }}>
                          Click any category above (Plastic, Paper, Metal, etc.) to specify estimated weight.
                        </p>
                      </div>
                    ) : (
                      wasteList.map((item) => {
                        const ItemIcon = item.iconComponent || RecycleIcon;
                        return (
                          <div key={item.id} className="waste-item-card">
                            <div className="waste-item-info">
                              <div className="waste-item-icon-wrap">
                                <ItemIcon size={22} color="var(--green)" />
                              </div>
                              <div>
                                <h3 className="waste-item-title">{item.name}</h3>
                                <span className="waste-item-rate-badge">Rate: ৳{item.price} / kg</span>
                              </div>
                            </div>

                            {/* Weight Stepper & Quick Presets */}
                            <div className="waste-weight-control">
                              <div className="weight-stepper">
                                <button
                                  type="button"
                                  className="stepper-btn"
                                  onClick={() => updateWeight(item.id, Math.max(1, item.weight - 1))}
                                  aria-label="Decrease weight"
                                >
                                  −
                                </button>
                                <input
                                  type="number"
                                  min="1"
                                  max="5000"
                                  className="stepper-input"
                                  value={item.weight}
                                  onChange={(e) => updateWeight(item.id, e.target.value)}
                                />
                                <span className="stepper-unit">kg</span>
                                <button
                                  type="button"
                                  className="stepper-btn"
                                  onClick={() => updateWeight(item.id, item.weight + 1)}
                                  aria-label="Increase weight"
                                >
                                  +
                                </button>
                              </div>
                              <div className="weight-presets">
                                {[5, 10, 20, 50].map((preset) => (
                                  <button
                                    key={preset}
                                    type="button"
                                    className="preset-chip"
                                    onClick={() => updateWeight(item.id, preset)}
                                  >
                                    {preset}kg
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Subtotal */}
                            <div className="waste-item-subtotal">
                              <div className="subtotal-label">Estimated Value</div>
                              <div className="subtotal-val">৳{item.subtotal.toLocaleString()}</div>
                            </div>

                            {/* Remove button */}
                            <button
                              type="button"
                              className="waste-item-remove"
                              onClick={() => toggleWasteType(item.id)}
                              title={`Remove ${item.name}`}
                            >
                              <TrashIcon size={16} />
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Aggregate Live Totals Bar */}
                  {wasteList.length > 0 && (
                    <div className="waste-aggregate-bar">
                      <div className="aggregate-metric">
                        <span className="metric-label">Total Estimated Weight</span>
                        <span className="metric-value">{totalEstimatedWeight} kg</span>
                      </div>
                      <div className="aggregate-metric">
                        <span className="metric-label">Total Estimated Value</span>
                        <span className="metric-value highlight">৳{totalEstimatedValue.toLocaleString()}</span>
                      </div>
                    </div>
                  )}

                  {/* On-site Scale Notice */}
                  <div className="waste-disclaimer-note">
                    <ScaleIcon size={20} color="var(--green)" />
                    <div>
                      <strong>Fair Weighing Notice:</strong> The final payable amount may adjust slightly after our collector verifies and weighs the actual materials on-site using a certified digital weight scale.
                    </div>
                  </div>

                  {/* Step Footer Navigation */}
                  <div className="step-nav-footer">
                    <button type="button" className="btn-step-prev" onClick={goToPrevStep}>
                      <ArrowLeftIcon size={16} />
                      <span>Back: Your Details</span>
                    </button>
                    <button type="button" className="btn-step-next" onClick={goToNextStep}>
                      <span>Continue to Location</span>
                      <ArrowRightIcon size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: PICKUP LOCATION (MAP + MANUAL ADDRESS) */}
              {currentStep === 3 && (
                <div className="pickup-card" id="location-step">
                  <div className="pickup-sec-head">
                    <div>
                      <span className="pickup-sec-num">Step 3 of 5</span>
                      <h2 className="pickup-sec-title">Pickup Location</h2>
                      <p className="pickup-sec-desc">
                        Select your location on the map or type in your detailed address. Both are captured together.
                      </p>
                    </div>
                  </div>

                  {/* Map Search & Current Location Button */}
                  <div className="map-controls-row">
                    <div className="map-search-wrap">
                      <input
                        type="text"
                        className="map-search-input"
                        placeholder="Search location (e.g. Mirpur 10, Dhanmondi 27)..."
                        value={mapSearchQuery}
                        onChange={(e) => setMapSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleMapSearch(e);
                        }}
                      />
                      <button
                        type="button"
                        className="map-search-btn"
                        onClick={handleMapSearch}
                        title="Search location"
                      >
                        <SearchIcon size={16} />
                      </button>
                    </div>

                    <button
                      type="button"
                      className="geo-btn"
                      onClick={handleUseCurrentLocation}
                      disabled={isLocating}
                    >
                      <CompassIcon size={16} />
                      <span>{isLocating ? 'Locating...' : 'Use My Current Location'}</span>
                    </button>
                  </div>

                  {/* Quick Popular Area Chips */}
                  <div className="popular-areas-chips">
                    <span className="chips-label">Popular Areas:</span>
                    {POPULAR_LOCATIONS.map((loc) => (
                      <button
                        key={loc.name}
                        type="button"
                        className="area-chip"
                        onClick={() => handleSelectPopularArea(loc)}
                      >
                        {loc.name}
                      </button>
                    ))}
                  </div>

                  {/* Interactive Map Canvas Container */}
                  <div className="map-canvas-container">
                    <div id="pickupLeafletMap" ref={mapRef}></div>
                  </div>

                  {/* Live Selected Location & Coordinates Box */}
                  <div className="location-summary-box">
                    <div className="loc-selected-address">
                      <MapPinIcon size={20} color="#e11d48" />
                      <div>
                        <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                          Selected Location
                        </div>
                        <div>{fullAddressString || 'Pin dropped on map'}</div>
                      </div>
                    </div>
                    <div className="loc-coords-badge">
                      <span>Lat: {coords.lat}</span>
                      <span>|</span>
                      <span>Lng: {coords.lng}</span>
                    </div>
                  </div>

                  {/* Manual Address Form */}
                    <div className="manual-address-section">
                    <h3 className="manual-address-header">
                      <FileTextIcon size={18} color="var(--green)" />
                      <span>Manual Address Form</span>
                    </h3>

                    <div className="form-grid-2">
                      <div className="form-group">
                        <label className="form-label">House / Building / Flat / বাসা বা ফ্ল্যাট নম্বর</label>
                        <input
                          type="text"
                          className="form-input"
                          style={{ paddingLeft: '14px' }}
                          placeholder="e.g. House 14, Flat 4B / যেমন: বাসা ১৪, ফ্ল্যাট ৪বি"
                          value={manualAddress.house}
                          onChange={(e) => setManualAddress({ ...manualAddress, house: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Road / Street / রোড বা রাস্তা</label>
                        <input
                          type="text"
                          className="form-input"
                          style={{ paddingLeft: '14px' }}
                          placeholder="e.g. Road 5, Block B / যেমন: রোড ৫, ব্লক বি"
                          value={manualAddress.road}
                          onChange={(e) => setManualAddress({ ...manualAddress, road: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-grid-2" style={{ marginTop: 12 }}>
                      <div className="form-group">
                        <label className="form-label">
                          Area / Neighborhood / এলাকা বা মহল্লা <span className="required">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-input ${errors.address ? 'has-error' : ''}`}
                          style={{ paddingLeft: '14px' }}
                          placeholder="e.g. Mirpur, Dhanmondi / যেমন: মিরপুর, ধানমন্ডি"
                          value={manualAddress.area}
                          onChange={(e) => {
                            setManualAddress({ ...manualAddress, area: e.target.value });
                            if (errors.address) setErrors({ ...errors, address: null });
                          }}
                        />
                        {errors.address && <span className="form-error-msg">{errors.address}</span>}
                      </div>

                      <div className="form-group">
                        <label className="form-label">City / শহর</label>
                        <input
                          type="text"
                          className="form-input"
                          style={{ paddingLeft: '14px' }}
                          placeholder="e.g. Dhaka / যেমন: ঢাকা"
                          value={manualAddress.city}
                          onChange={(e) => setManualAddress({ ...manualAddress, city: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-grid-2" style={{ marginTop: 12 }}>
                      <div className="form-group">
                        <label className="form-label">District / জেলা</label>
                        <input
                          type="text"
                          className="form-input"
                          style={{ paddingLeft: '14px' }}
                          placeholder="e.g. Dhaka / যেমন: ঢাকা"
                          value={manualAddress.district}
                          onChange={(e) => setManualAddress({ ...manualAddress, district: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Postal Code / পোস্টাল কোড</label>
                        <input
                          type="text"
                          className="form-input"
                          style={{ paddingLeft: '14px' }}
                          placeholder="e.g. 1216"
                          value={manualAddress.postalCode}
                          onChange={(e) => setManualAddress({ ...manualAddress, postalCode: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-group" style={{ marginTop: 12 }}>
                      <label className="form-label">Additional Address Details / Landmark / বিস্তারিত ঠিকানা বা ল্যান্ডমার্ক</label>
                      <input
                        type="text"
                        className="form-input"
                        style={{ paddingLeft: '14px' }}
                        placeholder="e.g. Near Mirpur Stadium Gate 2 / যেমন: স্টেডিয়াম গেট ২ এর কাছে"
                        value={manualAddress.details}
                        onChange={(e) => setManualAddress({ ...manualAddress, details: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Step Footer Navigation */}
                  <div className="step-nav-footer">
                    <button type="button" className="btn-step-prev" onClick={goToPrevStep}>
                      <ArrowLeftIcon size={16} />
                      <span>Back: Materials</span>
                    </button>
                    <button type="button" className="btn-step-next" onClick={goToNextStep}>
                      <span>Continue to Schedule</span>
                      <ArrowRightIcon size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: PREFERRED SCHEDULE & SPECIAL INSTRUCTIONS */}
              {currentStep === 4 && (
                <div className="pickup-card" id="schedule-step">
                  <div className="pickup-sec-head">
                    <div>
                      <span className="pickup-sec-num">Step 4 of 5</span>
                      <h2 className="pickup-sec-title">Preferred Schedule & Instructions</h2>
                      <p className="pickup-sec-desc">
                        Pick your convenient date, arrival time window, and any gate or handling instructions.
                      </p>
                    </div>
                  </div>

                  <div className="schedule-grid">
                    {/* Date Picker (Past dates disabled) */}
                    <div className="form-group">
                      <label className="form-label">
                        Preferred Pickup Date <span className="required">*</span>
                      </label>
                      <input
                        type="date"
                        min={todayStr}
                        className="form-input"
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                      />
                      <div className="date-shortcuts">
                        <button
                          type="button"
                          className="date-chip"
                          onClick={() => setPickupDate(todayStr)}
                        >
                          Today
                        </button>
                        <button
                          type="button"
                          className="date-chip"
                          onClick={() => setPickupDate(tomorrowStr)}
                        >
                          Tomorrow
                        </button>
                      </div>
                    </div>

                    {/* Time Slot Picker */}
                    <div className="form-group">
                      <label className="form-label">
                        Preferred Pickup Time <span className="required">*</span>
                      </label>
                      <div className="time-slots-grid">
                        {[
                          { name: 'Morning', time: '09:00 AM - 12:00 PM' },
                          { name: 'Midday', time: '12:00 PM - 03:00 PM' },
                          { name: 'Afternoon', time: '03:00 PM - 06:00 PM' },
                          { name: 'Evening', time: '06:00 PM - 08:00 PM' },
                        ].map((slot) => (
                          <button
                            key={slot.time}
                            type="button"
                            className={`time-slot-card ${pickupTime === slot.time ? 'active' : ''}`}
                            onClick={() => setPickupTime(slot.time)}
                          >
                            <span className="slot-name">{slot.name}</span>
                            <span className="slot-time">{slot.time}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="schedule-note" style={{ marginBottom: 24 }}>
                    <ClockIcon size={16} color="var(--green)" />
                    <span>Pickup time is subject to collector availability. Our collector will call 15 minutes prior to arrival.</span>
                  </div>

                  {/* Special Instructions */}
                  <div className="form-group">
                    <label className="form-label">
                      Special Instructions for Collector / সংগ্রাহকের জন্য বিশেষ নির্দেশনা <span className="optional">(ঐচ্ছিক)</span>
                    </label>
                    <textarea
                      className="form-textarea"
                      rows="3"
                      placeholder="Please call me before arriving... / আসার আগে অনুগ্রহ করে আমাকে কল দিন..."
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                    ></textarea>
                  </div>

                  <div className="instruction-templates">
                    {[
                      '+ Call me 15 mins before arrival',
                      '+ Scrap kept beside main gate',
                      '+ Heavy iron items - bring helper',
                      '+ Building has elevator / lift',
                    ].map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        className="instruction-tag"
                        onClick={() => {
                          const text = tag.replace('+ ', '');
                          setInstructions((prev) => (prev ? `${prev}. ${text}` : text));
                        }}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>

                  {/* Step Footer Navigation */}
                  <div className="step-nav-footer">
                    <button type="button" className="btn-step-prev" onClick={goToPrevStep}>
                      <ArrowLeftIcon size={16} />
                      <span>Back: Location</span>
                    </button>
                    <button type="button" className="btn-step-next" onClick={goToNextStep}>
                      <span>Review Booking Summary</span>
                      <ArrowRightIcon size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 5: REVIEW & BOOKING SUMMARY (Presented when all steps are completed!) */}
              {currentStep === 5 && (
                <div className="review-summary-container">
                  <div className="review-header">
                    <div>
                      <span className="pickup-sec-num">Step 5 of 5 — Review</span>
                      <h2 className="review-title">BOOKING SUMMARY</h2>
                      <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 14 }}>
                        Please review your pickup details before final confirmation.
                      </p>
                    </div>
                    <button
                      type="button"
                      className="pickup-prefill-btn"
                      onClick={() => setCurrentStep(1)}
                    >
                      <span>Edit Details</span>
                    </button>
                  </div>

                  <div className="review-grid">
                    {/* Left: Materials breakdown */}
                    <div>
                      <h3 style={{ fontSize: 16, fontWeight: 800, margin: '0 0 12px' }}>
                        Selected Recyclable Materials ({wasteList.length} items)
                      </h3>

                      <div className="summary-items-list" style={{ marginBottom: 16 }}>
                        {wasteList.map((item) => {
                          const ItemIcon = item.iconComponent || RecycleIcon;
                          return (
                            <div key={item.id} className="summary-item-row">
                              <span className="summary-item-name" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <ItemIcon size={16} color="var(--green)" />
                                {item.name}
                              </span>
                              <span className="summary-item-qty">{item.weight} kg (৳{item.price}/kg)</span>
                              <span className="summary-item-total">৳{item.subtotal.toLocaleString()}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Totals Box */}
                      <div className="summary-totals-box">
                        <div className="totals-row">
                          <span>Total Estimated Weight:</span>
                          <strong style={{ color: 'var(--ink)' }}>{totalEstimatedWeight} kg</strong>
                        </div>
                        <div className="totals-row main">
                          <span>Estimated Total Payout:</span>
                          <span className="totals-price-val">৳{totalEstimatedValue.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Contact, Location & Schedule Info */}
                    <div>
                      <h3 style={{ fontSize: 16, fontWeight: 800, margin: '0 0 12px' }}>
                        Pickup & Contact Info
                      </h3>

                      <div className="summary-meta-list">
                        <div className="summary-meta-item">
                          <UserIcon size={18} color="var(--green)" />
                          <div className="meta-content">
                            <strong>Customer Name</strong>
                            <span>{customer.fullName}</span>
                          </div>
                        </div>

                        <div className="summary-meta-item">
                          <PhoneIcon size={18} color="var(--green)" />
                          <div className="meta-content">
                            <strong>Phone Number</strong>
                            <span>+880 {customer.phone} {customer.altPhone ? `(Alt: ${customer.altPhone})` : ''}</span>
                          </div>
                        </div>

                        <div className="summary-meta-item">
                          <MailIcon size={18} color="var(--green)" />
                          <div className="meta-content">
                            <strong>Email Address</strong>
                            <span>{customer.email}</span>
                          </div>
                        </div>

                        <div className="summary-meta-item">
                          <MapPinIcon size={18} color="var(--green)" />
                          <div className="meta-content">
                            <strong>Pickup Address</strong>
                            <span>{fullAddressString || `${manualAddress.area}, ${manualAddress.city}`}</span>
                            <div style={{ fontSize: 11.5, color: '#94a3b8', marginTop: 2, fontFamily: 'monospace' }}>
                              Coords: {coords.lat}, {coords.lng}
                            </div>
                          </div>
                        </div>

                        <div className="summary-meta-item">
                          <CalendarIcon size={18} color="var(--green)" />
                          <div className="meta-content">
                            <strong>Preferred Schedule</strong>
                            <span>{pickupDate} | {pickupTime}</span>
                          </div>
                        </div>

                        {instructions && (
                          <div className="summary-meta-item">
                            <FileTextIcon size={18} color="var(--green)" />
                            <div className="meta-content">
                              <strong>Special Instructions</strong>
                              <span style={{ fontStyle: 'italic' }}>"{instructions}"</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Trust Badges */}
                  <div className="summary-trust-badges" style={{ marginBottom: 24 }}>
                    <div className="trust-badge-item">
                      <ShieldCheckIcon size={16} color="var(--green)" />
                      <span>Verified & Background-Checked Collector Guaranteed</span>
                    </div>
                    <div className="trust-badge-item">
                      <ScaleIcon size={16} color="var(--green)" />
                      <span>100% Certified On-Site Digital Weighing</span>
                    </div>
                    <div className="trust-badge-item">
                      <WalletIcon size={16} color="var(--green)" />
                      <span>Instant Spot Cash or bKash / Nagad Payment</span>
                    </div>
                  </div>

                  {/* Final Actions */}
                  <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
                    <button
                      type="button"
                      className="btn-step-prev"
                      onClick={goToPrevStep}
                    >
                      <ArrowLeftIcon size={16} />
                      <span>Back: Edit Schedule</span>
                    </button>

                    <button
                      type="button"
                      className="btn-book-confirm"
                      style={{ flex: 1, minWidth: 260 }}
                      onClick={handleFinalBookingSubmit}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span>Processing Booking...</span>
                      ) : (
                        <>
                          <CheckCircleIcon size={18} />
                          <span>Confirm & Book Pickup</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ===================================================================
              VIEW 2: PICKUP STATUS TRACKING (Section 8)
              =================================================================== */}
          {activeTab === 'track' && (
            <div className="tracking-wrapper">
              {/* Lookup Bar by Pickup ID */}
              <div className="tracking-search-bar">
                <SearchIcon size={20} color="var(--green)" />
                <input
                  type="text"
                  className="tracking-input"
                  placeholder="Enter Pickup ID (e.g. #SV-10248)..."
                  value={searchTrackingId}
                  onChange={(e) => setSearchTrackingId(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') loadBookingById(searchTrackingId);
                  }}
                />
                <button
                  type="button"
                  className="tracking-search-btn"
                  onClick={() => loadBookingById(searchTrackingId)}
                >
                  Track Pickup
                </button>
              </div>

              {trackedBooking ? (
                <>
                  {/* Active Header Card */}
                  <div className="tracker-header-card" style={{ marginTop: 24 }}>
                    <div className="tracker-id-group">
                      <span className="tracker-id-label">Active Request</span>
                      <span className="tracker-id-val">{trackedBooking.id}</span>
                      <span style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
                        Booked on {new Date(trackedBooking.createdAt).toLocaleDateString()} for {trackedBooking.pickupDate} ({trackedBooking.pickupTime})
                      </span>
                    </div>

                    <div className="tracker-current-badge">
                      <span className="pulse-dot"></span>
                      <span>Status: {TRACKING_STAGES[getStageIndex(trackedBooking.status)]?.name || 'Requested'}</span>
                    </div>
                  </div>

                  {/* Horizontal Pipeline Tracker (5 Core Business Stages: Requested, Confirmed, Collector Assigned, Collected, Payment Completed) */}
                  <div className="pipeline-card" style={{ marginBottom: 32 }}>
                    <div className="pipeline-track">
                      {TRACKING_STAGES.map((st, idx) => {
                        const currentIdx = getStageIndex(trackedBooking.status);
                        const isCompleted = idx < currentIdx;
                        const isActive = idx === currentIdx;
                        const StageIcon = st.iconComponent;

                        return (
                          <div
                            key={st.id}
                            className={`pipeline-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
                            title={`Status: ${st.name} - ${st.desc}`}
                          >
                            <div className="step-node-icon">
                              {isCompleted ? <CheckCircleIcon size={20} /> : <StageIcon size={20} />}
                            </div>
                            <div className="step-info">
                              <span className="step-name">{st.name}</span>
                              <span className="step-time">
                                {isCompleted ? 'Completed' : isActive ? 'Requested' : 'Pending'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              ) : (
                <div className="tracking-empty-card">
                  <FileTextIcon size={44} color="#94a3b8" />
                  <h3 style={{ fontSize: 18, fontWeight: 800, margin: '14px 0 6px', color: 'var(--ink)' }}>No Pickup Selected</h3>
                  <p style={{ fontSize: 14, color: '#64748b', maxWidth: 420, margin: '0 auto' }}>
                    Enter your Pickup ID (e.g., #SV-10248) in the search bar above to track real-time status.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ===================================================================
              CONFIRMATION SUCCESS MODAL
              =================================================================== */}
          {bookedSuccess && (
            <div className="pickup-modal-backdrop" role="dialog" aria-modal="true">
              <div className="pickup-modal-box">
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#ecfdf5', color: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <CheckCircleIcon size={36} color="var(--green)" />
                </div>
                <h2 className="modal-title">Pickup Booked Successfully!</h2>
                <div className="modal-id-pill">
                  <span>Pickup ID: {bookedSuccess.id}</span>
                </div>
                <p className="modal-message">
                  Your pickup request has been submitted successfully. A verified collector will be assigned to your request.
                </p>

                <div
                  style={{
                    background: '#f8fafc',
                    padding: '14px 18px',
                    borderRadius: 12,
                    textAlign: 'left',
                    fontSize: 13.5,
                    marginBottom: 20,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ color: '#64748b' }}>Date & Slot:</span>
                    <strong>{bookedSuccess.pickupDate} ({bookedSuccess.pickupTime})</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ color: '#64748b' }}>Estimated Scrap:</span>
                    <strong>{bookedSuccess.totalWeight} kg</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Estimated Value:</span>
                    <strong style={{ color: 'var(--green)' }}>৳{bookedSuccess.totalValue.toLocaleString()}</strong>
                  </div>
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="modal-btn-track"
                    onClick={() => {
                      setBookedSuccess(null);
                      setTrackedBooking(bookedSuccess);
                      setSearchTrackingId(bookedSuccess.id);
                      setActiveTab('track');
                      window.scrollTo({ top: 150, behavior: 'smooth' });
                    }}
                  >
                    Track Pickup Status
                  </button>
                  <Link
                    to="/"
                    className="modal-btn-secondary"
                    onClick={() => setBookedSuccess(null)}
                  >
                    Back to Home
                  </Link>
                  <button
                    type="button"
                    className="modal-btn-secondary"
                    onClick={() => {
                      setBookedSuccess(null);
                      setSelectedWaste({});
                      setCurrentStep(1);
                      setActiveTab('book');
                    }}
                  >
                    Book Another Pickup
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}
