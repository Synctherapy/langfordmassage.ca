// SpatialChat Micro-Interactions & Conversion Widgets
document.addEventListener('DOMContentLoaded', () => {
  
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
    trigger: ''
  };

  const step1 = document.getElementById('quizStep1');
  const step2 = document.getElementById('quizStep2');
  const step3 = document.getElementById('quizStep3');
  const resultStep = document.getElementById('quizResult');
  const recTitle = document.getElementById('quizRecTitle');
  const recDesc = document.getElementById('quizRecDesc');
  const recProtocol = document.getElementById('quizRecProtocol');
  const resetBtn = document.getElementById('quizResetBtn');

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
          quizState.trigger = value;
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

    if (state.location === 'neck') {
      recTitle.textContent = 'Recommended: 60-Min Cervical & Upper Back Decompression';
      recDesc.textContent = 'Based on your answers, your neck stiffness and headaches stem from prolonged forward head posture and tight suboccipital muscles.';
      recProtocol.textContent = 'Treatment Plan: Hands-on suboccipital release, levator scapulae deactivation, and anterior chest opening with Daryl Stubbs, RMT & CAT(C).';
    } else if (state.location === 'back') {
      recTitle.textContent = 'Recommended: 60-Min Lumbar & Piriformis Sciatic Release';
      recDesc.textContent = 'Your symptoms indicate deep gluteal and lumbar muscular guarding compressing the sciatic pathway.';
      recProtocol.textContent = 'Treatment Plan: Targeted deep tissue release on piriformis and QL muscles, followed by pelvic re-alignment stretches with Daryl Stubbs, RMT & CAT(C).';
    } else if (state.location === 'sports') {
      recTitle.textContent = 'Recommended: 60-Min Athletic Recovery & Kinetic Chain Assessment';
      recDesc.textContent = 'Your symptoms point to tendon overload and compensatory movement patterns from training.';
      recProtocol.textContent = 'Treatment Plan: Cross-fiber friction, active tissue release, and Athletic Therapy assessment with Daryl Stubbs, RMT & CAT(C).';
    } else {
      recTitle.textContent = 'Recommended: 60-Min Full-Body Therapeutic Assessment';
      recDesc.textContent = 'Your responses indicate chronic postural tension across multiple joint segments.';
      recProtocol.textContent = 'Treatment Plan: Comprehensive orthopedic assessment and targeted myofascial release with Daryl Stubbs, RMT & CAT(C).';
    }
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      quizState = { location: '', duration: '', trigger: '' };
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
