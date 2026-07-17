// Mobile navigation toggle + progressive enhancements (no dependencies)
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.querySelector('.nav-toggle');
  if (!btn) return;

  const navId = btn.getAttribute('aria-controls');
  const nav = navId ? document.getElementById(navId) : null;
  if (!nav) return;

  const isDesktop = () => window.matchMedia('(min-width: 721px)').matches;

  const setExpanded = (open) => btn.setAttribute('aria-expanded', String(!!open));

  const closeMenu = () => {
    nav.classList.remove('is-open');
    document.body.classList.remove('nav-open');
    setExpanded(false);
  };

  const toggleMenu = () => {
    const open = nav.classList.toggle('is-open');
    document.body.classList.toggle('nav-open', open);
    setExpanded(open);
  };

  // 1) Toggle on button click
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // 2) Close when a nav link is clicked (mobile)
  nav.addEventListener('click', (e) => {
    const t = e.target;
    if (t && t.tagName === 'A' && !isDesktop()) closeMenu();
  });

  // 3) Close when clicking outside (background click)
  document.addEventListener('click', (e) => {
    if (isDesktop()) return;
    if (!nav.classList.contains('is-open')) return;
    const target = e.target;
    if (nav.contains(target) || btn.contains(target)) return;
    closeMenu();
  });

  // 4) Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) closeMenu();
  });

  // 5) Ensure menu resets when resizing to desktop
  window.addEventListener('resize', () => {
    if (isDesktop()) closeMenu();
  });

  // 6) Current page highlight (adds .is-active + aria-current)
  try {
    const path = (location.pathname || '').split('/').pop() || 'index.html';
    const links = Array.from(nav.querySelectorAll('a.nav-link[href]'));

    let anyActive = false;

    links.forEach((a) => {
      const href = a.getAttribute('href') || '';
      const hrefFile = href.split('#')[0].split('/').pop();

      // Normalize index
      const isIndex = (path === '' || path === 'index.html');
      const linkIsIndex = (hrefFile === '' || hrefFile === 'index.html');

      let active = false;

      if (path === 'contact.html' && href.includes('contact.html')) active = true;
      else if (path === 'resume.html' && href.includes('resume.html')) active = true;
      else if (isIndex && linkIsIndex) active = true;

      if (active) anyActive = true;

      if (active) {
        a.classList.add('is-active');
        a.setAttribute('aria-current', 'page');
      } else {
        a.classList.remove('is-active');
        if (a.getAttribute('aria-current') === 'page') a.removeAttribute('aria-current');
      }
    });

    // Fallback: pages that are not in the top nav (e.g., project detail pages)
    if (!anyActive && links.length) {
      links[0].classList.add('is-active');
      links[0].setAttribute('aria-current', 'page');
    }
  } catch (_) {
    // no-op
  }
});

// ---------------------------------------------------------------
// Language toggle (한국어 / English)
// ---------------------------------------------------------------
(function () {
  const LANG_KEY = 'site-lang';

  const I18N = {
    // Shared nav
    'nav.profile': { en: 'Profile', ko: '프로필' },
    'nav.resume': { en: 'Resume', ko: '이력서' },
    'nav.contact': { en: 'Contact', ko: '연락처' },
    'brand.producerRole': { en: 'Producer / Production Support', ko: '프로듀서 / 프로덕션 서포트' },
    'brand.localizationRole': { en: 'Localization / QA', ko: '로컬라이제이션 / QA' },

    // index.html
    'index.hero': {
      en: `I am a <span class="lede-emph">Producer / Production Coordinator</span> who specializes in turning ambiguity into shippable plans. I focus on clear ownership, lightweight documentation, and crisp cross team communication.
        <br />
        <br />
        My approach is rooted in precision and reliability. Whether I'm managing high stakes data
        protocols with zero margin for error or streamlining localization
        for global hits like Bugsnax, I ensure the pipeline stays clear. I've collaborated closely
        with development teams to identify and resolve cultural and linguistic localization issues
        before they reach players.
        <br />
        <br />
        I\u2019m familiar with tools such as, <span class="lede-emph">Jira, Trello, and MemoQ</span> and love owning the full loop from discovery to verification.`,
      ko: `저는 모호함을 실행 가능한 계획으로 바꾸는 것을 전문으로 하는 <span class="lede-emph">프로듀서 / 프로덕션 코디네이터</span>입니다. 명확한 오너십, 가벼운 문서화, 그리고 명료한 팀 간 커뮤니케이션에 집중합니다.
        <br />
        <br />
        저의 접근 방식은 정확성과 신뢰성을 기반으로 합니다. 오차가 허용되지 않는 고위험 데이터 프로토콜을 관리하든, Bugsnax와 같은 글로벌 히트작의 로컬라이제이션 프로세스를 체계화하든, 파이프라인이 항상 명확하게 유지되도록 합니다. 개발팀과 긴밀히 협업하며 문화적·언어적 로컬라이제이션 이슈를 플레이어에게 닿기 전에 찾아내고 해결해 왔습니다.
        <br />
        <br />
        <span class="lede-emph">Jira, Trello, MemoQ</span> 등 다양한 툴에 익숙하며, 발견부터 검증까지 전체 과정을 책임지는 것을 좋아합니다.`
    },
    'index.projects.title': { en: 'Notable Projects', ko: '주요 프로젝트' },

    'index.project1.title': { en: 'Producer / Production Support', ko: '프로듀서 / 프로덕션 서포트' },
    'index.project1.desc': {
      en: 'Kept cross-functional teams aligned through lightweight documentation, milestone tracking, and clear ownership—reducing ambiguity and unblocking delivery.',
      ko: '가벼운 문서화, 마일스톤 트래킹, 명확한 오너십을 통해 크로스펑셔널 팀의 정렬을 유지하며 모호함을 줄이고 딜리버리를 원활하게 진행했습니다.'
    },
    'index.project1.bullets': {
      en: `<li>Maintained project docs and coordination rhythms (updates, handoffs, decision logs)</li>
<li>Facilitated collaboration between writing/design without blocking development</li>
<li>Supported \u201cship readiness\u201d by clarifying scope, risks, and next actions</li>`,
      ko: `<li>프로젝트 문서와 협업 리듬(업데이트, 핸드오프, 의사결정 로그)을 관리했습니다</li>
<li>개발 진행을 막지 않으면서 기획/디자인 간 협업을 조율했습니다</li>
<li>범위, 리스크, 다음 액션을 명확히 하여 \u201c출시 준비\u201d를 지원했습니다</li>`
    },

    'index.project2.title': { en: 'Localization QA — Korean Consistency Pass', ko: '로컬라이제이션 QA — 한국어 표현 정합성 점검' },
    'index.project2.desc': {
      en: 'I ran a Korean consistency pass to make the player-facing experience read naturally—clear, consistent, and culturally appropriate.',
      ko: '플레이어가 자연스럽게 느낄 수 있도록 명확하고 일관되며 문화적으로 적절한 한국어 표현이 되도록 정합성 점검을 진행했습니다.'
    },
    'index.project2.bullets': {
      en: `<li>Flagged terminology, tone, spacing, UI truncation, and cultural context mismatches</li>
<li>Wrote actionable notes for implementation with examples and recommended alternatives</li>
<li>Collaborated with stakeholders to resolve high-impact player-facing issues</li>`,
      ko: `<li>용어, 어조, 띄어쓰기, UI 텍스트 잘림, 문화적 맥락 불일치를 식별했습니다</li>
<li>예시와 대안을 포함한 실행 가능한 수정 노트를 작성했습니다</li>
<li>이해관계자와 협업하여 플레이어에게 영향이 큰 이슈를 해결했습니다</li>`
    },

    'index.project3.title': { en: 'Unannounced Title (NDA) — Game Testing / QA Verification', ko: '미공개 타이틀(NDA) — 게임 테스트 / QA 검증' },
    'index.project3.desc': {
      en: 'Tested pre-release builds and wrote high-signal bug reports with clear repro steps, severity, and environment details—then verified fixes across iterative builds.',
      ko: '출시 전 빌드를 테스트하고 명확한 재현 절차, 심각도, 환경 정보를 포함한 정확도 높은 버그 리포트를 작성했으며, 이후 반복되는 빌드에서 수정 사항을 검증했습니다.'
    },
    'index.project3.bullets': {
      en: `<li>Functional / regression / exploratory testing across gameplay &amp; UI flows</li>
<li>Authored tickets with Steps, Expected vs Actual, Repro Rate, Severity/Priority</li>
<li>Supported triage with dev/production; validated fixes and tracked regressions to closure</li>`,
      ko: `<li>게임플레이 및 UI 플로우 전반에 대한 기능/회귀/탐색적 테스트를 수행했습니다</li>
<li>재현 절차, 기대 결과 대 실제 결과, 재현율, 심각도/우선순위를 포함한 티켓을 작성했습니다</li>
<li>개발/프로덕션과 트리아지를 지원했으며, 수정 사항을 검증하고 회귀 이슈를 종결까지 추적했습니다</li>`
    },

    // resume.html
    'resume.downloadPdf': { en: 'Download PDF', ko: 'PDF 다운로드' },
    'resume.experience': { en: 'Experience', ko: '경력' },
    'resume.education': { en: 'Education', ko: '학력' },
    'resume.skills': { en: 'Skills', ko: '보유 역량' },
    'resume.military': { en: 'Military Service', ko: '병역 사항' },

    'resume.job1.bullets': {
      en: `<li>
        Partnered with developers using MemoQ to identify and resolve cultural and linguistic localization issues across two
        shipped titles, Octodad and Bugsnax.
    </li>`,
      ko: `<li>
        MemoQ를 활용해 개발자와 협업하며 Octodad와 Bugsnax 두 출시작 전반에서 문화적·언어적 로컬라이제이션 이슈를 발견하고 해결했습니다.
    </li>`
    },
    'resume.job2.bullets': {
      en: `<li>
        Led an 11-member cross-functional team of programmers, artists, writers, and sound designers throughout a 15-month Agile game development project, delivering Final Hour from concept to release.
    </li>
    <li>
        Defined and managed the production roadmap, 9 major milestones, and weekly sprint cadence, balancing scope, schedule, and resource constraints throughout development.
    </li>
    <li>
        Facilitated 60+ one-week Scrum sprints, leading sprint planning, backlog prioritization, progress reviews, and retrospectives while monitoring team velocity and milestone completion.
    </li>
    <li>
        Reduced schedule risk by re-scoping lower-priority work, resolving cross-functional dependencies, and reallocating tasks during unexpected resource constraints, ensuring on-time project delivery.
    </li>`,
      ko: `<li>
        프로그래머, 아티스트, 작가, 사운드 디자이너로 구성된 11명 규모의 크로스펑셔널 팀을 15개월간의 애자일 게임 개발 프로젝트 전반에서 이끌며 Final Hour를 기획부터 출시까지 완성했습니다.
    </li>
    <li>
        프로덕션 로드맵, 9개의 주요 마일스톤, 주간 스프린트 주기를 정의하고 관리하며 개발 전 과정에서 범위, 일정, 리소스 제약의 균형을 맞췄습니다.
    </li>
    <li>
        60회 이상의 1주 단위 스크럼 스프린트를 진행하며 스프린트 계획, 백로그 우선순위화, 진행 리뷰, 회고를 이끌었고 팀 벨로시티와 마일스톤 완료 현황을 관리했습니다.
    </li>
    <li>
        예상치 못한 리소스 제약 상황에서 우선순위가 낮은 작업의 범위를 재조정하고, 부서 간 의존성을 해결하며, 작업을 재배분하여 일정 리스크를 줄이고 프로젝트를 제때 완료했습니다.
    </li>`
    },
    'resume.job3.bullets': {
      en: `<li>
        Streamlined the bug triage workflow in Jira by prioritizing high-severity issues and producing detailed reproducibility
        reports, unblocking engineering teams and accelerating release cycles.
    </li>
    <li>
        Authored comprehensive test plans and regression reports that maintained build stability throughout active
        development cycles.
    </li>`,
      ko: `<li>
        Jira에서 심각도가 높은 이슈를 우선순위화하고 상세한 재현 리포트를 작성하여 버그 트리아지 워크플로우를 효율화했으며, 엔지니어링 팀의 병목을 해소하고 릴리스 주기를 단축했습니다.
    </li>
    <li>
        포괄적인 테스트 플랜과 회귀 리포트를 작성하여 활발한 개발 주기 동안 빌드 안정성을 유지했습니다.
    </li>`
    },
    'resume.education1.bullets': {
      en: `<li>Computer Science + Screenwriting Minor | GPA: 3.6</li>`,
      ko: `<li>컴퓨터공학 전공 + 시나리오 부전공 | 학점: 3.6</li>`
    },
    'resume.skills.list': {
      en: `<li><b>Production:</b> Agile/Scrum, documentation, decision logs, risk tracking (RAID)</li>
  <li><b>QA / Localization:</b> CAT tools, localization QA, test case writing, verification</li>
  <li><b>Tools:</b> Jira, Trello, Perforce, GitHub, Google Workspace, Microsoft Office</li>`,
      ko: `<li><b>프로덕션:</b> 애자일/스크럼, 문서화, 의사결정 로그, 리스크 트래킹(RAID)</li>
  <li><b>QA / 로컬라이제이션:</b> CAT 툴, 로컬라이제이션 QA, 테스트 케이스 작성, 검증</li>
  <li><b>툴:</b> Jira, Trello, Perforce, GitHub, Google Workspace, Microsoft Office</li>`
    },
    'resume.military.text': {
      en: 'Mandatory military service, Republic of Korea Army — July 2024 to January 2026.',
      ko: '대한민국 육군 의무 복무 — 2024년 7월 ~ 2026년 1월'
    },

    // producer.html
    'producer.coreResponsibilities.title': { en: 'Core responsibilities', ko: '핵심 업무' },
    'producer.coreResponsibilities.bullets': {
      en: `<li>Owned milestone planning and a weekly cadence (priorities, blockers, dependencies).</li>
<li>Structured work breakdown (epics → tasks) with clear acceptance criteria.</li>
<li>Supported ship readiness by clarifying risks, scope boundaries, and next actions.</li>
<li>Established triage + verification habits to reduce regressions and improve release confidence.</li>`,
      ko: `<li>마일스톤 계획과 주간 진행 리듬(우선순위, 블로커, 의존성)을 담당했습니다.</li>
<li>명확한 승인 기준과 함께 작업 분해 구조(에픽 → 태스크)를 체계화했습니다.</li>
<li>리스크, 범위 경계, 다음 액션을 명확히 하여 출시 준비를 지원했습니다.</li>
<li>회귀를 줄이고 출시 신뢰도를 높이기 위한 트리아지 및 검증 습관을 정착시켰습니다.</li>`
    },
    'producer.media.title': { en: 'Final Hour media', ko: 'Final Hour 미디어' },
    'producer.supportingCase.title': { en: 'Supporting case', ko: '세부 사례' },

    'producer.case1.title': { en: 'Case 01 — Milestone slippage control', ko: 'Case 01 — 마일스톤 지연 관리' },
    'producer.case1.bullets': {
      en: `<li><b>Context:</b> Milestones started slipping due to unclear weekly priorities and ownership across disciplines.</li>
    <li><b>Actions:</b> Set up a weekly planning cadence in Trello (by week), assigned owners, and used discipline labels to surface blockers early.</li>
    <li><b>Impact:</b> <b>Reduced milestone delay frequency</b> by improving visibility and tightening weekly execution.</li>
    <li><b>Evidence:</b> Trello weekly board (planning cadence + ownership).</li>`,
      ko: `<li><b>배경:</b> 직군 간 주간 우선순위와 담당자가 명확하지 않아 마일스톤이 지연되기 시작했습니다.</li>
    <li><b>액션:</b> Trello에 주 단위 계획 리듬을 구축하고, 담당자를 지정했으며, 직군별 라벨을 사용해 블로커를 조기에 파악했습니다.</li>
    <li><b>임팩트:</b> 가시성을 높이고 주간 실행력을 강화하여 <b>마일스톤 지연 빈도를 줄였습니다.</b></li>
    <li><b>근거자료:</b> Trello 주간 보드(계획 리듬 + 담당자 배정).</li>`
    },
    'producer.case1.caption': { en: 'Trello board view — weekly planning cadence.', ko: 'Trello 보드 뷰 — 주간 계획 리듬.' },

    'producer.case2.title': { en: 'Case 02 — Scope reduction to hit ship date', ko: 'Case 02 — 출시 일정 준수를 위한 스코프 조정' },
    'producer.case2.bullets': {
      en: `<li><b>Context:</b> Narrative scope threatened the schedule late in the milestone.</li>
    <li><b>Actions:</b> Cut a small number of characters / lines and re-baselined remaining work to protect the release date.</li>
    <li><b>Impact:</b> <b>Reduced workload</b> and kept the project on track for an on-time release.</li>
    <li><b>Evidence:</b> Trello table view (task-level tracking with labels/owners).</li>`,
      ko: `<li><b>배경:</b> 마일스톤 후반부에 내러티브 스코프가 일정을 위협했습니다.</li>
    <li><b>액션:</b> 캐릭터/대사 일부를 축소하고 남은 작업을 재산정하여 출시일을 지켰습니다.</li>
    <li><b>임팩트:</b> <b>작업량을 줄여</b> 프로젝트가 제때 출시될 수 있도록 유지했습니다.</li>
    <li><b>근거자료:</b> Trello 테이블 뷰(라벨/담당자 기준 태스크 단위 트래킹).</li>`
    },
    'producer.case2.caption': { en: 'Trello table view — task-level tracking.', ko: 'Trello 테이블 뷰 — 태스크 단위 트래킹.' },

    'producer.case3.title': { en: 'Case 03 — Pipeline improvement for narrative updates', ko: 'Case 03 — 내러티브 업데이트 파이프라인 개선' },
    'producer.case3.bullets': {
      en: `<li><b>Stakeholders:</b> Lead Narrative, Programmer, Art.</li>
    <li><b>Change:</b> Implemented a CSV-to-Unity update flow to reduce manual edits and keep content updates consistent.</li>
    <li><b>Impact:</b> Improved turnaround time for narrative updates and reduced manual error risk during iteration.</li>
    <li><b>Evidence:</b> Trello dashboard (work distribution + label coverage).</li>`,
      ko: `<li><b>이해관계자:</b> 리드 내러티브, 프로그래머, 아트.</li>
    <li><b>변경 사항:</b> 수작업 편집을 줄이고 콘텐츠 업데이트의 일관성을 유지하기 위해 CSV-to-Unity 업데이트 플로우를 도입했습니다.</li>
    <li><b>임팩트:</b> 내러티브 업데이트 소요 시간을 단축하고 반복 작업 중 수작업 오류 리스크를 줄였습니다.</li>
    <li><b>근거자료:</b> Trello 대시보드(작업 분포 + 라벨 커버리지).</li>`
    },
    'producer.case3.caption': { en: 'Trello dashboard — distribution and progress snapshot.', ko: 'Trello 대시보드 — 작업 분포 및 진행 현황.' },

    // contact.html
    'contact.title': { en: 'Contact', ko: '연락처' },
    'contact.intro': {
      en: `The fastest way to reach me is email. I typically respond within 1–2 business days.
            <br/>
            Email: qnyt123456@gmail.com`,
      ko: `가장 빠르게 연락하실 수 있는 방법은 이메일입니다. 보통 영업일 기준 1~2일 이내에 답변드립니다.
            <br/>
            이메일: qnyt123456@gmail.com`
    },
    'contact.form.name': { en: 'Your name', ko: '이름' },
    'contact.form.email': { en: 'Your email', ko: '이메일' },
    'contact.form.message': { en: 'Message', ko: '메시지' },
    'contact.form.send': { en: 'Send', ko: '보내기' },
    'contact.form.note': {
      en: 'This form submits via Formspree and emails me the message.',
      ko: '이 양식은 Formspree를 통해 전송되며, 메시지가 이메일로 발송됩니다.'
    },

    // thanks.html
    'thanks.title': { en: 'Thank you', ko: '감사합니다' },
    'thanks.body': {
      en: "Your message has been sent. I\u2019ll get back to you as soon as I can.",
      ko: '메시지가 전송되었습니다. 최대한 빠르게 답변드리겠습니다.'
    },
    'thanks.back': { en: 'Back to Contact', ko: '연락처로 돌아가기' }
  };

  function applyLanguage(lang) {
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      const entry = I18N[key];
      if (entry && entry[lang] != null) el.textContent = entry[lang];
    });

    document.querySelectorAll('[data-i18n-html]').forEach((el) => {
      const key = el.getAttribute('data-i18n-html');
      const entry = I18N[key];
      if (entry && entry[lang] != null) el.innerHTML = entry[lang];
    });

    document.querySelectorAll('[data-href-en]').forEach((el) => {
      const enHref = el.getAttribute('data-href-en');
      const koHref = el.getAttribute('data-href-ko');
      const href = (lang === 'ko' && koHref) ? koHref : enHref;
      el.setAttribute('href', href);
      if (el.hasAttribute('download')) el.setAttribute('download', href);
    });

    document.querySelectorAll('.lang-btn').forEach((el) => {
      const isActive = el.getAttribute('data-lang') === lang;
      el.classList.toggle('active', isActive);
      el.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    try { localStorage.setItem(LANG_KEY, lang); } catch (_) { /* no-op */ }
  }

  document.addEventListener('DOMContentLoaded', () => {
    let saved = null;
    try { saved = localStorage.getItem(LANG_KEY); } catch (_) { /* no-op */ }
    const lang = (saved === 'ko' || saved === 'en') ? saved : 'en';

    applyLanguage(lang);

    document.querySelectorAll('.lang-btn').forEach((btn) => {
      btn.addEventListener('click', () => applyLanguage(btn.getAttribute('data-lang')));
    });
  });
})();
