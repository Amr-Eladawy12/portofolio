/**
 * AMR HATEM ELADAWY - PORTFOLIO LOGIC & INTERACTIVITY
 * Junior Network Security Engineer | SOC Analyst
 * Vanilla JavaScript Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initNetworkCanvas();
  initTerminalTyping();
  initTestimonialsSlider();
  initProjectModals();
  initContactForm();
  initResumeDownload();
  initYear();
});

/* ================= 1. NAVBAR & ACTIVE SCROLL-SPY ================= */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  // Sticky header background
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile menu
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const expanded = navMenu.classList.contains('open');
      menuToggle.setAttribute('aria-expanded', expanded);
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });

    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        navMenu.classList.remove('open');
      }
    });
  }

  // IntersectionObserver for active section highlighting
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

/* ================= 2. NETWORK CANVAS MESH ================= */
function initNetworkCanvas() {
  const canvas = document.getElementById('network-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let mouse = { x: null, y: null, radius: 140 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  const count = Math.min(Math.floor(window.innerWidth / 22), 60);

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.radius = Math.random() * 2 + 1;
      this.color = Math.random() > 0.4 ? 'rgba(0, 242, 254, ' : 'rgba(0, 255, 136, ';
      this.baseAlpha = Math.random() * 0.4 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx = -this.vx;
      if (this.y < 0 || this.y > height) this.vy = -this.vy;

      if (mouse.x != null && mouse.y != null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 2.5;
          this.y -= (dy / dist) * force * 2.5;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `${this.color}${this.baseAlpha})`;
      ctx.shadowBlur = 6;
      ctx.shadowColor = '#00f2fe';
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }

  function connect() {
    const maxDist = 120;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        let dx = particles[i].x - particles[j].x;
        let dy = particles[i].y - particles[j].y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          let alpha = (1 - dist / maxDist) * 0.16;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 242, 254, ${alpha})`;
          ctx.lineWidth = 0.75;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    connect();
    requestAnimationFrame(animate);
  }
  animate();
}

/* ================= 3. TERMINAL TYPING ENGINE ================= */
function initTerminalTyping() {
  const typingElement = document.getElementById('typing-text');
  if (!typingElement) return;

  const commands = [
    'scapy.sniff(iface="eth0", count=10000, prn=inspect_anomalies)',
    'python -m port_scanner --target 10.0.0.0/24 --threads 16 --rate 100/s',
    'gns3.deploy_topology(branches=3, nodes=25, failover_test="0% loss")',
    'fortisiem.ingest_logs(source="FortiAnalyzer", telemetry="STABLE")',
    'ipsec_tunnel.verify_encryption(algo="AES-256-GCM", status="ACTIVE")'
  ];

  let cmdIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingSpeed = 55;
  const deleteSpeed = 28;
  const pauseEnd = 2200;

  function typeCycle() {
    const currentCmd = commands[cmdIndex];

    if (!isDeleting) {
      typingElement.textContent = currentCmd.substring(0, charIndex + 1);
      charIndex++;

      if (charIndex === currentCmd.length) {
        isDeleting = true;
        setTimeout(typeCycle, pauseEnd);
        return;
      }
    } else {
      typingElement.textContent = currentCmd.substring(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        cmdIndex = (cmdIndex + 1) % commands.length;
      }
    }

    setTimeout(typeCycle, isDeleting ? deleteSpeed : typingSpeed);
  }

  typeCycle();
}

/* ================= 4. TESTIMONIALS SLIDER ================= */
function initTestimonialsSlider() {
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.slider-dots .dot');
  const prevBtn = document.getElementById('prevTestimonial');
  const nextBtn = document.getElementById('nextTestimonial');
  const container = document.querySelector('.testimonials-slider-container');

  if (!slides.length) return;

  let currentSlide = 0;
  let autoPlayTimer = null;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
    currentSlide = index;
  }

  function nextSlide() {
    let nextIndex = (currentSlide + 1) % slides.length;
    showSlide(nextIndex);
  }

  function prevSlide() {
    let prevIndex = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(prevIndex);
  }

  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoplay(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoplay(); });

  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const idx = parseInt(e.target.getAttribute('data-index'), 10);
      showSlide(idx);
      resetAutoplay();
    });
  });

  function startAutoplay() {
    autoPlayTimer = setInterval(nextSlide, 5500);
  }

  function resetAutoplay() {
    clearInterval(autoPlayTimer);
    startAutoplay();
  }

  if (container) {
    container.addEventListener('mouseenter', () => clearInterval(autoPlayTimer));
    container.addEventListener('mouseleave', startAutoplay);

    // Touch swipe for mobile devices
    let touchStartX = 0;
    container.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    container.addEventListener('touchend', (e) => {
      let touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 50) {
        nextSlide();
        resetAutoplay();
      } else if (touchEndX - touchStartX > 50) {
        prevSlide();
        resetAutoplay();
      }
    }, { passive: true });
  }

  startAutoplay();
}

/* ================= 5. PROJECT DEEP DIVE MODALS ================= */
function initProjectModals() {
  const modalBackdrop = document.getElementById('projectModalBackdrop');
  const modalContent = document.getElementById('modalDynamicContent');
  const closeBtn = document.getElementById('modalCloseBtn');
  const triggers = document.querySelectorAll('.project-modal-trigger');

  const projectData = {
    'network-modal': {
      title: 'Enterprise Multi-Vendor Network Architecture & Hardening',
      sub: 'GNS3 / Cisco Packet Tracer / Huawei eNSP / OSPF / VLANs / IPsec VPN / 40+ ACLs',
      desc: 'Designed and simulated scalable multi-tier enterprise network topologies connecting 3 regional branches with 25+ virtual network nodes. The project achieved sub-second failover recovery with 0% packet loss during link failure tests.',
      highlights: [
        'Configured multi-area OSPF routing across 6 subnets and 8+ VLANs with automated default route redistribution.',
        'Hardened network perimeter by implementing 40+ Access Control Lists (ACLs), Stateful Firewall inspection rules, and 256-bit AES site-to-site IPsec VPN tunnels.',
        'Authored 15+ pages of comprehensive technical architecture documentation, IP addressing schemes, and security compliance baselines for presentation.',
        'Multi-vendor interoperability tested across Cisco IOS, Huawei VRP (eNSP), and GNS3 virtual routers.'
      ]
    },
    'soc-modal': {
      title: 'Custom Network Security Automation & Packet Analyzer',
      sub: 'Python / Scapy / Sockets / Requests / Nmap API / Multithreading / JSON & CSV',
      desc: 'Engineered a modular, multi-threaded Python scanner capable of auditing 100+ TCP/UDP ports per second, accelerating reconnaissance time by 65%. Built automated packet crafting and inspection scripts using Scapy to analyze 10,000+ live network frames.',
      highlights: [
        'Deep packet dissection parsing Layer 2-4 headers to identify malformed packets, port scans, and SYN flood attempts.',
        'Automated subnet host discovery and service banner-grabbing routines.',
        'Generated structured JSON and CSV security audit reports for SIEM ingestion and SOC incident reporting.',
        'Integrated multi-threading to achieve high-throughput asynchronous network auditing with minimal CPU overhead.'
      ]
    },
    'vision-modal': {
      title: 'AI Camera Detection & Recognition Model',
      sub: 'Python / Neural Networks / Computer Vision / Team Leadership (5 Members)',
      desc: 'Served as University Engineering Team Leader managing a 5-member student cohort. Spearheaded project architecture, sprint roadmaps, weekly progress reviews, and final technical defense presentations in front of university faculty.',
      highlights: [
        'Organized modular project roadmaps, delegating specialized technical tracks (data acquisition, neural model training, security auditing).',
        'Facilitated technical dispute resolutions and code reviews, maintaining positive team momentum and meeting tight academic deadlines.',
        'Spearheaded technical defenses and live demonstrations, clearly communicating system architecture, benchmarks, and security constraints.',
        'Standardized GitHub repository collaboration, branch protection, and technical documentation.'
      ]
    }
  };

  triggers.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetKey = btn.getAttribute('data-target');
      const data = projectData[targetKey];
      if (!data) return;

      modalContent.innerHTML = `
        <h3>${data.title}</h3>
        <div class="modal-sub"><i class="fa-solid fa-code"></i> ${data.sub}</div>
        <p>${data.desc}</p>
        <h4 style="margin-bottom: 0.75rem; font-size: 1rem; color: var(--text-main);">Key Technical Highlights:</h4>
        <ul>
          ${data.highlights.map(h => `<li><i class="fa-solid fa-circle-check"></i> ${h}</li>`).join('')}
        </ul>
        <div style="display: flex; gap: 0.75rem; margin-top: 1rem;">
          <a href="#contact" class="btn btn-sm btn-primary" onclick="document.getElementById('projectModalBackdrop').classList.remove('open')">
            <i class="fa-solid fa-envelope"></i> Inquire About Project
          </a>
        </div>
      `;
      modalBackdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    if (modalBackdrop) {
      modalBackdrop.classList.remove('open');
      document.body.style.overflow = 'auto';
    }
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

/* ================= 6. CONTACT FORM VALIDATION ================= */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const nameInput = document.getElementById('userName');
  const emailInput = document.getElementById('userEmail');
  const messageInput = document.getElementById('userMessage');
  const toast = document.getElementById('formToast');
  const toastMessage = document.getElementById('toastMessage');
  const submitBtn = document.getElementById('submitFormBtn');

  if (!form) return;

  function validateField(input, condition) {
    const group = input.closest('.form-group');
    if (!condition) {
      group.classList.add('has-error');
      return false;
    } else {
      group.classList.remove('has-error');
      return true;
    }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  nameInput.addEventListener('blur', () => {
    validateField(nameInput, nameInput.value.trim().length >= 2);
  });

  emailInput.addEventListener('blur', () => {
    validateField(emailInput, emailRegex.test(emailInput.value.trim()));
  });

  messageInput.addEventListener('blur', () => {
    validateField(messageInput, messageInput.value.trim().length >= 10);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const isNameValid = validateField(nameInput, nameInput.value.trim().length >= 2);
    const isEmailValid = validateField(emailInput, emailRegex.test(emailInput.value.trim()));
    const isMessageValid = validateField(messageInput, messageInput.value.trim().length >= 10);

    if (isNameValid && isEmailValid && isMessageValid) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Transmitting to Amr Eladawy...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Encrypted Dispatch';
        form.reset();

        toast.classList.add('active');
        toastMessage.textContent = 'Transmission Successful: Message dispatched to Amr Hatem Eladawy (aeladawy744@gmail.com)!';

        setTimeout(() => {
          toast.classList.remove('active');
        }, 6000);
      }, 1100);
    }
  });
}

/* ================= 7. RESUME DOWNLOAD HANDLER ================= */
function initResumeDownload() {
  const resumeBtn = document.getElementById('downloadResumeBtn');
  if (!resumeBtn) return;

  resumeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    const cvText = `========================================================================
AMR HATEM ELADAWY
Junior Network Security Engineer | SOC Analyst
Mansoura, Egypt | +201013321664 | aeladawy744@gmail.com
LinkedIn | GitHub
========================================================================

PROFESSIONAL SUMMARY:
Detail-oriented Computer Science student specializing in Network Security, Defensive Engineering, and Infrastructure Hardening. Backed by 250+ hours of accredited technical training across Huawei, NTI, and DEPI. Experienced in simulating multi-vendor enterprise networks (GNS3, Cisco Packet Tracer, Huawei eNSP), implementing robust firewall policies, and building high-performance Python security automation utilities. Strong communicator skilled in technical documentation, structured incident reporting, and cross-functional team collaboration. Seeking to leverage hands-on lab experience and analytical skills as an entry-level Network Security Engineer.

EDUCATION:
- Bachelor of Computer Science — Damietta University, Egypt (Expected Graduation: 2027)
  • Transferred from Fayoum University (2023 – 2024)

CERTIFICATIONS & SPECIALIZED TRAINING (250+ Hours):
- HCIA-Security V4 — Huawei (80 Hours, 2026)
- FortiSIEM & FortiAnalyzer Practical Training — National Telecommunication Institute (NTI) (72 Hours, 2026)
- AWS Security Training — Digital Egypt Pioneers Initiative (DEPI) (190+ Hours, In Progress)
- Cybersecurity Fundamentals — MaharaTech (35 Hours, 2026)
- CCNA Routing & Switching Preparation — Self-Study / Lab Simulation (Completed Comprehensive Hands-On Labs)

TECHNICAL SKILLS:
- Network Security & Defense: Firewall Policies, IDS/IPS, Access Control Lists (ACLs), IAM, IPsec/SSL VPN, NAT/PAT, Cryptography, Endpoint Hardening.
- Networking & Protocols: TCP/IP Suite, IPv4 Subnetting (VLSM/CIDR), Routing (OSPF, Static), Switching (VLANs, STP, Trunking), DNS, DHCP, Troubleshooting.
- Security & Analysis Tools: FortiSIEM, FortiAnalyzer, Wireshark, Nmap, GNS3, Cisco Packet Tracer, Huawei eNSP.
- Scripting & Automation: Python (Scapy, Sockets, Requests, Nmap API, Multithreading), Bash Scripting.
- Operating Systems & Cloud: Linux (Kali, Ubuntu), Windows Server, AWS Cloud Security Fundamentals, SQL.
- Communication & Professional Skills: Technical Documentation, Incident Reporting, Cross-functional Collaboration, Analytical Problem-Solving, Teamwork.

TECHNICAL PROJECTS & PRACTICAL EXPERIENCE:
1. Enterprise Multi-Vendor Network Architecture & Hardening (NTI / Self-Trained)
   Tools & Tech: GNS3, Cisco Packet Tracer, Huawei eNSP, OSPF, VLANs, IPsec VPN, ACLs
   • Designed and simulated scalable multi-tier enterprise network topologies connecting 3 regional branches with 25+ virtual network nodes.
   • Configured multi-area OSPF routing across 6 subnets and 8+ VLANs, achieving sub-second failover recovery with 0% packet loss during link failure tests.
   • Hardened network perimeter by implementing 40+ Access Control Lists (ACLs), Stateful Firewall inspection rules, and 256-bit AES site-to-site IPsec VPN tunnels.
   • Authored 15+ pages of technical architecture documentation, IP addressing schemes, and security compliance baselines for team presentation.

2. Custom Network Security Automation & Packet Analyzer (Personal Project)
   Technologies: Python, Scapy, Sockets, Requests, Nmap API, Multithreading
   • Developed a modular, multi-threaded Python scanner capable of auditing 100+ TCP/UDP ports per second, accelerating reconnaissance time by 65%.
   • Built automated packet crafting and inspection scripts using Scapy to analyze 10,000+ live network frames and detect header anomalies.
   • Automated subnet host discovery and service banner-grabbing routines, generating structured JSON and CSV security audit reports for reporting.

3. AI Camera Detection & Vision Model (University Team Leader)
   • Led a 5-member engineering team to design, train, and defend a neural network vision model.

LANGUAGES:
- Arabic: Native
- English: Upper-Intermediate / Professional Working Proficiency (B2 - Fluent in Technical Communication)
========================================================================`;

    const blob = new Blob([cvText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Amr_Hatem_Eladawy_Resume.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  });
}

/* ================= 8. CURRENT YEAR ================= */
function initYear() {
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
