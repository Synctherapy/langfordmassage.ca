// SpatialChat Micro-Interactions & Conversion Widgets
document.addEventListener('DOMContentLoaded', () => {
  
  // 0. Mobile Hamburger Navigation Menu Toggle
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navMenu.classList.contains('open');
      if (isOpen) {
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      } else {
        navMenu.classList.add('open');
        mobileToggle.classList.add('active');
        mobileToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
      }
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });

    // Close when clicking any nav link
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // 1. Interactive Symptom Solver Tabs
  const symptomTabs = document.querySelectorAll('.symptom-tab');
  const symptomPanels = document.querySelectorAll('.symptom-display-panel');

  if (symptomTabs.length > 0) {
    symptomTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetId = tab.getAttribute('data-target');
        
        symptomTabs.forEach(t => t.classList.remove('active'));
        symptomPanels.forEach(p => p.classList.remove('active'));
        
        tab.classList.add('active');
        const targetPanel = document.getElementById(targetId);
        if (targetPanel) {
          targetPanel.classList.add('active');
        }
      });
    });
  }

  // 2. Interactive Direct Billing Coverage Qualifier
  const insurerButtons = document.querySelectorAll('.insurer-select-btn');
  const insurerTitle = document.getElementById('insurerResultTitle');
  const insurerDesc = document.getElementById('insurerResultDesc');
  const insurerNote = document.getElementById('insurerResultNote');

  const insurerData = {
    'pbc': {
      title: '✅ Pacific Blue Cross Direct Billing Confirmed',
      desc: 'We submit your claim directly to Pacific Blue Cross in real-time. You only pay your remaining copay at your appointment.',
      note: 'Dual coverage supported. Simply input your policy & member ID on your Jane App online intake form.'
    },
    'canada-life': {
      title: '✅ Canada Life Direct Billing Confirmed',
      desc: 'Processed electronically via Telus Health eClaims instantly at the end of your treatment session.',
      note: 'No paper receipts required. Your official claim breakdown is emailed to you automatically.'
    },
    'sun-life': {
      title: '✅ Sun Life Financial Direct Billing Confirmed',
      desc: 'Real-time electronic claim submission. Most Sun Life extended health plans are adjudicated on the spot.',
      note: 'Enter your Sun Life member details on your secure Jane App intake form before your visit.'
    },
    'manulife': {
      title: '✅ Manulife Financial Direct Billing Confirmed',
      desc: 'Direct electronic adjudication supported for all major Manulife group extended health plans.',
      note: 'Zero paperwork. We submit directly so you leave with pain relief rather than claim forms.'
    },
    'desjardins': {
      title: '✅ Desjardins Insurance Direct Billing Confirmed',
      desc: 'Instant direct billing via Telus eClaims network. Your covered amount is applied immediately.',
      note: 'We also direct bill other family members if you have coordinating dual insurance plans.'
    },
    'green-shield': {
      title: '✅ Green Shield Canada Direct Billing Confirmed',
      desc: 'Submitted directly via Provider Connect in real-time at the time of your appointment.',
      note: 'Instant claim receipt emailed to you with insurer breakdown for your records.'
    }
  };

  if (insurerButtons.length > 0 && insurerTitle && insurerDesc) {
    insurerButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const insurerKey = btn.getAttribute('data-insurer');
        insurerButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        if (insurerData[insurerKey]) {
          insurerTitle.textContent = insurerData[insurerKey].title;
          insurerDesc.textContent = insurerData[insurerKey].desc;
          if (insurerNote) {
            insurerNote.textContent = insurerData[insurerKey].note;
          }
        }
      });
    });
  }

  // 3. Interactive 3-Click Symptom & Treatment Triage Quiz
  const quizOptionBtns = document.querySelectorAll('.quiz-option-btn');
  let quizState = {
    location: '',
    duration: '',
    directBill: ''
  };

  const step1 = document.getElementById('quizStep1');
  const step2 = document.getElementById('quizStep2');
  const step3 = document.getElementById('quizStep3');
  const resultStep = document.getElementById('quizResult');
  const recTitle = document.getElementById('quizRecTitle');
  const recDesc = document.getElementById('quizRecDesc');
  const recProtocol = document.getElementById('quizRecProtocol');
  const recBilling = document.getElementById('quizRecBilling');
  const recContextLink = document.getElementById('quizRecContextLink');
  const recBookingBtn = document.getElementById('quizBookingBtn');
  const resetBtn = document.getElementById('quizResetBtn');

  const INITIAL_BOOKING_URL = 'https://synctherapy.janeapp.com/#/discipline/3/treatment/5';

  if (quizOptionBtns.length > 0) {
    quizOptionBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const step = btn.getAttribute('data-step');
        const value = btn.getAttribute('data-value');

        if (step === '1') {
          quizState.location = value;
          if (step1 && step2) {
            step1.classList.remove('active');
            step2.classList.add('active');
          }
        } else if (step === '2') {
          quizState.duration = value;
          if (step2 && step3) {
            step2.classList.remove('active');
            step3.classList.add('active');
          }
        } else if (step === '3') {
          quizState.directBill = value;
          if (step3 && resultStep) {
            step3.classList.remove('active');
            resultStep.classList.add('active');
            generateQuizRecommendation(quizState);
          }
        }
      });
    });
  }

  function generateQuizRecommendation(state) {
    if (!recTitle || !recDesc || !recProtocol) return;

    if (recBookingBtn) {
      recBookingBtn.href = INITIAL_BOOKING_URL;
    }

    // Direct Billing Message
    if (recBilling) {
      if (state.directBill === 'yes') {
        recBilling.innerHTML = '<strong>💳 Direct Billing Available:</strong> Yes, we direct bill most major extended health insurers (Pacific Blue Cross, Canada Life, Sun Life, Manulife, Desjardins, Green Shield). You will be able to enter your policy & member ID into your secure Jane App intake form right after booking!';
      } else {
        recBilling.innerHTML = '<strong>💳 Self-Pay / Direct Reimbursement:</strong> We accept Debit, Visa, and MasterCard. You will receive an official CCHPBC-compliant RMT receipt automatically by email after your appointment for your personal records or tax deduction.';
      }
    }

    // Clinical Recommendation & Contextual Internal Link
    if (state.location === 'neck') {
      recTitle.textContent = 'Recommended: Initial Assessment + Cervical & Shoulder Decompression';
      recDesc.textContent = 'Based on your answers, your neck stiffness and headaches stem from prolonged postural tension and tight suboccipital musculature.';
      recProtocol.textContent = 'Clinical Protocol: Targeted orthopedic testing, hands-on suboccipital release, levator scapulae deactivation, and postural realignment with Daryl Stubbs, RMT & CAT(C).';
      if (recContextLink) {
        recContextLink.innerHTML = '📖 <em>Want to learn more?</em> Read our detailed guide on <a href="/conditions/neck-shoulder-pain/" style="color: var(--color-brand-violet); font-weight: 600; text-decoration: underline;">Clinical Neck & Shoulder Pain Therapy in Langford &rarr;</a>';
      }
    } else if (state.location === 'back') {
      recTitle.textContent = 'Recommended: Initial Assessment + Lumbar & Piriformis Sciatic Release';
      recDesc.textContent = 'Your symptoms indicate deep gluteal and lumbar muscular tension compressing the sciatic nerve pathway.';
      recProtocol.textContent = 'Clinical Protocol: Orthopedic assessment, deep tissue release on piriformis and QL muscles, and pelvic alignment techniques with Daryl Stubbs, RMT & CAT(C).';
      if (recContextLink) {
        recContextLink.innerHTML = '📖 <em>Want to learn more?</em> Read our clinical breakdown of <a href="/conditions/sciatica/" style="color: var(--color-brand-violet); font-weight: 600; text-decoration: underline;">Sciatica & Lower Back Relief in Langford &rarr;</a>';
      }
    } else if (state.location === 'sports') {
      recTitle.textContent = 'Recommended: Initial Assessment + Athletic Recovery & Biomechanical Analysis';
      recDesc.textContent = 'Your responses point to tendon overload and compensatory movement patterns from training or repetitive physical activity.';
      recProtocol.textContent = 'Clinical Protocol: Kinetic chain assessment, transverse friction, active tissue release, and Athletic Therapy recovery with Daryl Stubbs, RMT & CAT(C).';
      if (recContextLink) {
        recContextLink.innerHTML = '📖 <em>Want to learn more?</em> Explore our <a href="/services/sports-massage-therapy/" style="color: var(--color-brand-violet); font-weight: 600; text-decoration: underline;">Sports Massage & Athletic Therapy Protocols &rarr;</a>';
      }
    } else if (state.location === 'relaxation') {
      recTitle.textContent = 'Recommended: Initial Assessment + Relaxation & Swedish Therapeutic Massage';
      recDesc.textContent = 'Your goal is systemic stress reduction, nervous system down-regulation, and gentle muscular relief in a quiet clinical setting.';
      recProtocol.textContent = 'Clinical Protocol: Rhythmic Swedish effleurage, gentle myofascial unwinding, and parasympathetic nervous system activation with Daryl Stubbs, RMT & CAT(C).';
      if (recContextLink) {
        recContextLink.innerHTML = '📖 <em>Want to learn more?</em> Explore our <a href="/services/relaxation-massage/" style="color: var(--color-brand-violet); font-weight: 600; text-decoration: underline;">Relaxation Massage Therapy Services in Langford &rarr;</a>';
      }
    } else {
      recTitle.textContent = 'Recommended: Initial Assessment + Clinical Deep Tissue Therapy';
      recDesc.textContent = 'Your responses indicate chronic postural tension across multiple joint segments and restricted connective tissue glide.';
      recProtocol.textContent = 'Clinical Protocol: Comprehensive orthopedic assessment, deep tissue neuromuscular release, and myofascial mobilization with Daryl Stubbs, RMT & CAT(C).';
      if (recContextLink) {
        recContextLink.innerHTML = '📖 <em>Want to learn more?</em> Explore our <a href="/services/deep-tissue-massage/" style="color: var(--color-brand-violet); font-weight: 600; text-decoration: underline;">Clinical Deep Tissue Massage in Langford &rarr;</a>';
      }
    }
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      quizState = { location: '', duration: '', directBill: '' };
      if (resultStep && step1) {
        resultStep.classList.remove('active');
        step1.classList.add('active');
      }
    });
  }

  // 4. FAQ Accordion Toggle
  const faqCards = document.querySelectorAll('.faq-card');
  faqCards.forEach(card => {
    const header = card.querySelector('.faq-header');
    if (header) {
      header.addEventListener('click', () => {
        const isActive = card.classList.contains('active');
        faqCards.forEach(c => c.classList.remove('active'));
        if (!isActive) {
          card.classList.add('active');
        }
      });
    }
  });

});
