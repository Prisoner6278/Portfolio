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
    'brand.producerRole': { en: 'Project Manager', ko: '프로젝트 매니저' },
    'brand.localizationRole': { en: 'Localization QA', ko: '로컬라이제이션 QA' },

    // index.html
    'index.hero': {
      en: `Hi, I'm Do Hwi — a bilingual (Korean/English) <span class="lede-emph">Project &amp; Operations Coordinator</span> who turns loose goals into clear plans and keeps teams on schedule.`,
      ko: `안녕하세요, 이도휘입니다. 막연한 목표를 구체적인 계획으로 정리하고 팀이 일정을 지키도록 돕는, 한국어·영어 이중언어 <span class="lede-emph">프로젝트·운영 코디네이터</span>입니다.`
    },
    'index.heroSub': {
      en: `At DePaul, I ran the roadmap and weekly cadence for an 11-person team across engineering, design, art, writing, and audio, delivering 8 milestones on schedule over 10 months. At Young Horses, I caught and closed 50+ Korean localization issues across Octodad and Bugsnax before launch, following each one through fix, re-test, and approval.
        <br />
        <br />
        I'm now looking for project coordination and operations roles where clear ownership and reliable follow-through matter.`,
      ko: `DePaul 재학 중에는 프로그래밍, 디자인, 아트, 시나리오, 사운드를 아우르는 11명 규모 팀의 로드맵과 주간 계획을 운영하며, 10개월 동안 8건의 마일스톤을 모두 일정 내에 완수했습니다. Young Horses에서는 Octodad와 Bugsnax의 한국어 현지화 이슈 50건 이상을 출시 전에 찾아내고, 각 이슈를 수정·재검수·승인까지 끝까지 추적했습니다.
        <br />
        <br />
        앞으로는 명확한 책임 분담과 끝까지 챙기는 실행력이 중요한 프로젝트 코디네이션 및 운영 직무에서 일하고 싶습니다.`
    },
    'index.projects.title': { en: 'Notable Projects', ko: '주요 프로젝트' },

    'index.project1.title': { en: 'Project Management — Final Hour', ko: '프로젝트 매니지먼트 — Final Hour' },
    'index.project1.desc': {
      en: 'Ran the roadmap and weekly planning cadence for an 11-member cross-functional team over a 10-month cycle, delivering 8 major milestones on schedule.',
      ko: '11명 규모 다기능 팀의 로드맵과 주간 계획 체계를 약 10개월간 운영하며, 8건의 주요 마일스톤을 모두 일정 내에 완수했습니다.'
    },
    'index.project1.bullets': {
      en: `<li>Tracked velocity and milestone data across 42 planning/review cycles to flag schedule risk early</li>
<li>Re-scoped lower-priority work through 3+ unexpected resource constraints</li>
<li>Resolved cross-team dependencies across engineering, design, art, writing, and audio</li>`,
      ko: `<li>42회의 계획·리뷰 사이클에 걸쳐 벨로시티와 마일스톤 데이터를 추적하고 일정 리스크를 조기에 식별</li>
<li>3건 이상의 예기치 못한 리소스 제약 상황에서 우선순위가 낮은 작업의 범위를 재조정</li>
<li>프로그래밍, 디자인, 아트, 시나리오, 사운드 팀 간 의존관계를 조율</li>`
    },

    'index.project2.title': { en: 'Localization QA — Octodad & Bugsnax (ko-KR)', ko: '로컬라이제이션 QA — Octodad & Bugsnax (ko-KR)' },
    'index.project2.desc': {
      en: 'Reviewed English-to-Korean localization quality for 2 shipped titles, resolving 50+ quality issues before launch.',
      ko: '출시작 2종의 영어→한국어 현지화 품질을 검수하여 50건 이상의 품질 이슈를 출시 전에 해결했습니다.'
    },
    'index.project2.bullets': {
      en: `<li>Flagged subtitles that did not match scene context or character emotion, plus terminology, tone, and UI issues</li>
<li>Wrote actionable notes with recommended alternatives in MemoQ</li>
<li>Tracked fix, re-test, and approval status with the dev team through final delivery</li>`,
      ko: `<li>장면 맥락이나 캐릭터 감정과 맞지 않는 자막, 용어·어조·UI 이슈를 식별</li>
<li>MemoQ에서 대안 표현을 포함한 실행 가능한 수정 노트를 작성</li>
<li>개발팀과 이슈의 수정·재검수·승인 상태를 최종 납품까지 추적</li>`
    },

    'index.project3.title': { en: 'Game Testing / QA — Title under NDA', ko: '게임 테스트 / QA — NDA 비공개 타이틀' },
    'index.project3.desc': {
      en: 'Maintained product stability across a full test cycle for a portfolio company of Anthos Capital by authoring 12 structured test and regression plans.',
      ko: 'Anthos Capital 포트폴리오사 프로젝트에서 12건의 구조화된 테스트·회귀 테스트 계획을 작성하여 전체 테스트 사이클 동안 제품 안정성을 유지했습니다.'
    },
    'index.project3.bullets': {
      en: `<li>Functional, regression, and exploratory testing across gameplay and UI flows</li>
<li>Bug reports with steps, expected vs. actual, repro rate, and severity</li>
<li>Verified fixes across iterative builds and tracked regressions to closure</li>`,
      ko: `<li>게임플레이 및 UI 플로우 전반의 기능·회귀·탐색적 테스트</li>
<li>재현 절차, 기대 결과 대비 실제 결과, 재현율, 심각도를 포함한 버그 리포트 작성</li>
<li>반복 빌드에서 수정 사항을 검증하고 회귀 이슈를 종결까지 추적</li>`
    },

    // resume.html
    'resume.headline': { en: 'Project & Operations Coordinator', ko: '프로젝트 및 운영 코디네이터' },
    'resume.summary': {
      en: 'Bilingual (Korean/English) coordinator experienced in managing cross-functional teams, external partner relationships, and full project lifecycles — translating stakeholder needs into actionable plans and keeping delivery on schedule through KPI and milestone tracking.',
      ko: '한국어와 영어에 능통한 코디네이터로서 다기능 팀 운영, 외부 파트너 관계 관리, 프로젝트 전 주기 관리 경험을 보유하고 있습니다. 이해관계자의 요구사항을 실행 가능한 계획으로 전환하고, KPI 및 마일스톤 트래킹을 통해 일정 준수를 이끌어 왔습니다.'
    },
    'resume.downloadPdf': { en: 'Download PDF', ko: 'PDF 다운로드' },
    'resume.experience': { en: 'Experience', ko: '경력사항' },
    'resume.education': { en: 'Education', ko: '학력' },
    'resume.skills': { en: 'Skills', ko: '보유 역량' },
    'resume.military': { en: 'Military Service', ko: '병역사항' },

    'resume.job2.title': { en: 'Project Manager | DePaul Original Game Studio', ko: '프로젝트 매니저 | DePaul Original Game Studio' },
    'resume.job2.bullets': {
      en: `<li>Delivered 8 major project milestones on schedule across a 10-month cycle by building and running the end-to-end project roadmap and weekly planning cadence for an 11-member cross-functional team (engineering, design, art, writing, and audio).</li>
    <li>Protected delivery timelines through 3+ unexpected resource constraints by re-scoping lower-priority work and resolving cross-team dependencies in real time.</li>
    <li>Identified and corrected recurring schedule risk patterns across 42 planning/review cycles by tracking team velocity and milestone data to flag inefficiencies before they hit deadlines.</li>`,
      ko: `<li>프로그래밍, 디자인, 아트, 시나리오, 사운드 등 11명 규모의 다기능 팀을 위한 전체 프로젝트 로드맵과 주간 계획 체계를 구축·운영하여, 약 10개월 일정 동안 8건의 주요 마일스톤을 모두 일정 내에 완수했습니다.</li>
    <li>3건 이상의 예기치 못한 리소스 제약 상황에서 우선순위가 낮은 작업의 범위를 재조정하고 팀 간 의존관계를 실시간으로 해결하여 일정을 지켰습니다.</li>
    <li>총 42회의 계획·리뷰 사이클에 걸쳐 팀 벨로시티와 마일스톤 데이터를 추적하고, 반복되는 일정 리스크 패턴을 마감 전에 식별·개선했습니다.</li>`
    },
    'resume.job1.title': { en: 'Localization Quality Assurance Specialist | Young Horses', ko: '로컬라이제이션 QA | Young Horses' },
    'resume.job1.bullets': {
      en: `<li>Reviewed English-to-Korean localization quality for 2 titles (Octodad, Bugsnax), resolving 50+ quality issues before launch, including subtitles that did not match scene context or character emotion.</li>
    <li>Tracked fix, re-test, and approval status for each issue with the development team through final delivery, eliminating unresolved issues that could have blocked release.</li>`,
      ko: `<li>Octodad, Bugsnax 2개 제품의 영어→한국어 현지화 품질을 검수하여, 장면 맥락이나 캐릭터 감정과 맞지 않는 자막 등 50건 이상의 품질 이슈를 출시 전에 해결했습니다.</li>
    <li>개발팀과 이슈의 수정·재검수·승인 상태를 최종 납품까지 추적하여, 출시를 막을 수 있는 미해결 이슈를 사전에 제거했습니다.</li>`
    },
    'resume.job3.title': { en: 'Game Tester / QA Analyst | Anthos Capital', ko: '게임 테스터 / QA 애널리스트 | Anthos Capital' },
    'resume.job3.note': { en: 'Portfolio company engagement; title and product under NDA', ko: '포트폴리오사 참여 프로젝트 (제품명 및 타이틀 NDA로 비공개)' },
    'resume.job3.bullets': {
      en: `<li>Maintained product stability across a full test cycle by authoring 12 structured test and regression plans.</li>`,
      ko: `<li>12건의 구조화된 테스트·회귀 테스트 계획을 작성하여 전체 테스트 사이클 동안 제품 안정성을 유지했습니다.</li>`
    },
    'resume.education1.title': {
      en: 'Bachelor of Arts, Game and Interactive Media Design | DePaul University, Chicago, IL',
      ko: '게임 및 인터랙티브 미디어 디자인 학사 | DePaul University, 시카고(일리노이주)'
    },
    'resume.education1.bullets': {
      en: `<li><b>Minors:</b> Computer Science, Screenwriting · GPA 3.6</li>
<li><b>Relevant coursework:</b> Production Planning, Project Management, Resource &amp; Risk Management, Agile Development</li>`,
      ko: `<li><b>부전공:</b> 컴퓨터공학, 시나리오 · 학점 3.6</li>
<li><b>관련 과목:</b> 프로덕션 플래닝, 프로젝트 매니지먼트, 리소스·리스크 매니지먼트, 애자일 개발</li>`
    },
    'resume.skills.list': {
      en: `<li><b>Planning &amp; Scheduling:</b> Project roadmap &amp; milestone management, resource allocation, capacity planning, risk assessment &amp; mitigation, KPI tracking, data-informed decision making, process improvement</li>
  <li><b>Partner &amp; Stakeholder Coordination:</b> External partner/vendor coordination, cross-functional alignment, client &amp; stakeholder communication, issue triage &amp; sign-off management</li>
  <li><b>Core Tools:</b> Microsoft Excel/Office, Google Workspace, Jira, Trello, Confluence</li>
  <li><b>Additional Tools:</b> Perforce, GitHub, MemoQ</li>
  <li><b>Languages:</b> Korean (native) · English (fluent, professional working proficiency)</li>`,
      ko: `<li><b>기획 및 일정 관리:</b> 프로젝트 로드맵·마일스톤 관리, 리소스 배분, 캐파시티 플래닝, 리스크 평가 및 대응, KPI 트래킹, 데이터 기반 의사결정, 프로세스 개선</li>
  <li><b>파트너·이해관계자 조율:</b> 외부 파트너/벤더 조율, 크로스펑셔널 협업, 클라이언트·이해관계자 커뮤니케이션, 이슈 트리아지 및 승인 관리</li>
  <li><b>주요 툴:</b> Microsoft Excel/Office, Google Workspace, Jira, Trello, Confluence</li>
  <li><b>기타 툴:</b> Perforce, GitHub, MemoQ</li>
  <li><b>언어:</b> 한국어(모국어) · 영어(유창, 전문 업무 가능 수준)</li>`
    },
    'resume.military.title': { en: 'Operations Specialist | Republic of Korea Army', ko: '운영 담당 | 대한민국 육군' },
    'resume.military.text': { en: 'Mandatory military service', ko: '의무 복무' },

    // producer.html
    'producer.hero.title': { en: 'Final Hour — Project Management', ko: 'Final Hour — 프로젝트 매니지먼트' },
    'producer.hero.lede': {
      en: 'Built and ran the end-to-end roadmap and weekly planning cadence for an 11-member cross-functional team, delivering 8 major milestones on schedule across a 10-month cycle.',
      ko: '11명 규모 다기능 팀을 위한 전체 로드맵과 주간 계획 체계를 구축·운영하여, 약 10개월 동안 8건의 주요 마일스톤을 모두 일정 내에 완수했습니다.'
    },
    'meta.project': { en: 'Project', ko: '프로젝트' },
    'meta.role': { en: 'Role', ko: '역할' },
    'meta.team': { en: 'Team', ko: '팀' },
    'meta.duration': { en: 'Duration', ko: '기간' },
    'meta.outcome': { en: 'Outcome', ko: '성과' },
    'meta.tools': { en: 'Tools', ko: '툴' },
    'producer.meta.role': { en: 'Project Manager', ko: '프로젝트 매니저' },
    'producer.meta.team': { en: '11 members (engineering, design, art, writing, audio)', ko: '11명 (프로그래밍, 디자인, 아트, 시나리오, 사운드)' },
    'producer.meta.duration': { en: 'Sep 2022 – Jun 2023 (10 months)', ko: '2022.09 – 2023.06 (약 10개월)' },
    'producer.meta.outcome': { en: '8/8 major milestones on schedule', ko: '주요 마일스톤 8건 모두 일정 내 완수' },

    'producer.coreResponsibilities.title': { en: 'Core responsibilities', ko: '핵심 업무' },
    'producer.coreResponsibilities.bullets': {
      en: `<li>Owned the project roadmap, milestone planning, and a weekly cadence (priorities, blockers, dependencies).</li>
<li>Structured work breakdown (epics → tasks) with clear acceptance criteria.</li>
<li>Tracked velocity and milestone data across 42 planning/review cycles to flag schedule risk before deadlines.</li>
<li>Supported release readiness by clarifying risks, scope boundaries, and next actions.</li>
<li>Established triage + verification habits to reduce regressions and improve release confidence.</li>`,
      ko: `<li>프로젝트 로드맵, 마일스톤 계획, 주간 진행 리듬(우선순위, 블로커, 의존성)을 담당했습니다.</li>
<li>명확한 완료 기준과 함께 작업 분해 구조(에픽 → 태스크)를 체계화했습니다.</li>
<li>42회의 계획·리뷰 사이클에 걸쳐 벨로시티와 마일스톤 데이터를 추적해 마감 전에 일정 리스크를 식별했습니다.</li>
<li>리스크, 범위 경계, 다음 액션을 명확히 하여 출시 준비를 지원했습니다.</li>
<li>회귀를 줄이고 출시 신뢰도를 높이기 위한 트리아지 및 검증 습관을 정착시켰습니다.</li>`
    },
    'producer.media.title': { en: 'Final Hour media', ko: 'Final Hour 미디어' },
    'producer.supportingCase.title': { en: 'Supporting case', ko: '세부 사례' },

    'producer.case1.title': { en: 'Case 01 — Milestone slippage control', ko: 'Case 01 — 마일스톤 지연 관리' },
    'producer.case1.bullets': {
      en: `<li><b>Context:</b> Milestones started slipping due to unclear weekly priorities and ownership across disciplines.</li>
    <li><b>Actions:</b> Set up a weekly planning cadence in Trello (by week), assigned owners, and used discipline labels to surface blockers early.</li>
    <li><b>Impact:</b> <b>8 of 8 major milestones delivered on schedule</b> by improving visibility and tightening weekly execution.</li>
    <li><b>Evidence:</b> Trello weekly board (planning cadence + ownership).</li>`,
      ko: `<li><b>배경:</b> 직군 간 주간 우선순위와 담당자가 명확하지 않아 마일스톤이 지연되기 시작했습니다.</li>
    <li><b>액션:</b> Trello에 주 단위 계획 리듬을 구축하고, 담당자를 지정했으며, 직군별 라벨을 사용해 블로커를 조기에 파악했습니다.</li>
    <li><b>임팩트:</b> 가시성을 높이고 주간 실행력을 강화하여 <b>주요 마일스톤 8건을 모두 일정 내에 완수했습니다.</b></li>
    <li><b>근거자료:</b> Trello 주간 보드(계획 리듬 + 담당자 배정).</li>`
    },
    'producer.case1.caption': { en: 'Trello board view — weekly planning cadence.', ko: 'Trello 보드 뷰 — 주간 계획 리듬.' },

    'producer.case2.title': { en: 'Case 02 — Scope reduction to protect the release date', ko: 'Case 02 — 출시일을 지키기 위한 스코프 조정' },
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
      en: "Your message has been sent. I’ll get back to you as soon as I can.",
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
