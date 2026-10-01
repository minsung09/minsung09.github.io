// Project detail content is kept separate so each case follows the same reading order.
const projectSection = (number, title, content) => `<section class="case-section"><div class="case-section-heading"><span>${number}</span><h2>${title}</h2></div>${content}</section>`;
const projectArchitecture = (steps, caption) => `<figure class="case-architecture"><div class="architecture-steps">${steps.map((step, index) => `<div class="architecture-step"><span class="architecture-index">0${index + 1} / ${step.label}</span><strong>${step.name}</strong><span class="architecture-tech">${step.tech}</span></div>`).join('')}</div><figcaption>${caption}</figcaption></figure>`;
const caseParagraphs = text => text.split('\n\n').map(paragraph => `<p>${paragraph}</p>`).join('');
const projectPoints = points => `<div class="case-point-list">${points.map(point => `<div class="case-point"><h3>${point.title}</h3>${caseParagraphs(point.text)}</div>`).join('')}</div>`;
const projectDecisions = decisions => `<div class="case-decision-list">${decisions.map(item => `<div class="case-decision"><span>${item.label}</span><h3>${item.title}</h3>${caseParagraphs(item.text)}</div>`).join('')}</div>`;

const projects = {
  tongchoo: {
    name: 'TongChoo',
    index: '01',
    category: 'DATABASE DESIGN / TEAM PROJECT',
    subtitle: '상황에 맞는 답변과 후속 대화를 연결하는 서비스의 데이터 구조를 설계했습니다.',
    role: 'DB 설계 · ERD',
    stack: ['Java 21', 'Spring Boot', 'Spring Data JPA', 'MySQL', 'Flyway'],
    links: [
      ['Backend GitHub', 'https://github.com/TongChoo/TongChoo-BE'],
      ['ERD', 'https://dbdiagram.io/d/6a53b73e36d348d120c4f0f7']
    ],
    summary: 'TongChoo는 상대와 상황, 말투에 맞는 답변을 만들고 후속 대화까지 이어 가는 서비스입니다. 하나의 상황에서 여러 답변 후보가 만들어지고, 사용자가 그중 하나를 선택한 뒤 새로운 대화를 이어 가는 흐름이 데이터 모델의 중심입니다.\n\n저는 DB 설계와 ERD를 담당했습니다. 사용자와 답변의 소유 관계, 답변별 후보 목록, 이전 답변을 참조하는 후속 대화 구조를 정리했습니다. 화면에 보이는 기능을 테이블로 나누는 데서 그치지 않고, 후보의 순서·선택 상태와 데이터 삭제 이후의 관계까지 설계에 포함했습니다.',
    architecture: [
      { label: 'CLIENT', name: '서비스 화면', tech: '답변 작성 · 후속 대화' },
      { label: 'API', name: 'Spring Boot', tech: '도메인 · JPA · 검증' },
      { label: 'DATA', name: 'MySQL', tech: '관계형 스키마 · Flyway' }
    ],
    architectureCaption: '프로젝트의 데이터 흐름을 요약한 구조입니다. 개인 담당 영역은 데이터 모델과 제약 조건입니다.',
    implementation: [
      { title: '답변 후보 분리', text: '하나의 상황에 여러 답변 후보가 연결되므로, 답변 본문을 한 컬럼에 모아 저장하면 각 후보의 순서와 선택 여부를 개별적으로 관리하기 어려웠습니다. 이를 해결하기 위해 excuse_reply_options를 분리하고 원본 답변과 1:N 관계로 연결했습니다.\n\n각 후보의 표시 순서는 sort_order, 사용자의 선택 상태는 selected로 표현했습니다. 후보 목록을 조회하는 기준과 사용자가 선택한 결과를 구분해, 하나의 상황 안에서도 후보 단위로 상태를 다룰 수 있도록 모델링했습니다.' },
      { title: '후속 대화 연결', text: '후속 대화는 독립적인 답변이면서 동시에 이전 답변의 맥락을 가져야 합니다. 이전 대화 내용을 매번 복사하는 방식 대신 reply_to_excuse_id로 동일 테이블의 앞선 답변을 참조하도록 설계했습니다.\n\n이를 통해 새 답변 자체의 데이터와 어떤 답변에서 이어졌는지를 분리해 표현했습니다. 대화 관계를 외래 키로 명시해, 후속 답변을 조회하거나 대화 흐름을 해석할 때 사용할 연결 기준을 마련했습니다.' },
      { title: '데이터 무결성', text: '사용자 식별에 사용하는 이메일과 닉네임에는 UNIQUE 제약을 두고, 사용자·답변·답변 후보 사이의 연결은 외래 키로 표현했습니다. 애플리케이션의 입력 검증과 별개로 DB에서도 지켜야 하는 규칙을 명시했습니다.\n\n후보의 순서는 전체 서비스에서 고유할 필요가 없지만 같은 답변 안에서는 중복되면 안 됩니다. 이에 (excuse_id, sort_order) 조합을 복합 UNIQUE로 정의해, 서로 다른 답변은 같은 순서 값을 사용할 수 있도록 범위를 정했습니다.' }
    ],
    decisions: [
      { label: '설계 결정', title: '한 칸에 여러 답변을 담지 않기', text: '후보를 단일 문자열이나 고정 개수의 컬럼으로 저장하면 초기 구조는 단순하지만, 후보가 늘어날 때마다 해석 로직이나 스키마 변경이 필요합니다. 별도 테이블은 조회 시 관계를 따라가야 하는 비용이 있지만, 후보별 상태와 개수를 독립적으로 다룰 수 있습니다.\n\nTongChoo에서는 후보 목록과 선택 상태가 서비스 흐름의 일부이므로 후자를 선택했습니다. 데이터가 늘어나는 방향을 컬럼 추가가 아닌 행 추가로 표현한 설계입니다.' },
      { label: '문제 해결', title: '연결과 삭제 기준 명확히 하기', text: '답변을 삭제한 뒤 그 답변에 속한 후보만 남으면 의미 없는 연관 데이터가 생깁니다. 소유 관계가 분명한 연관 데이터에는 ON DELETE CASCADE 정책을 두어 원본의 생명주기와 함께 관리하도록 정리했습니다.\n\n기존 단일 답변을 후보 구조로 옮길 때는 기존 내용을 기본 후보로 이관하고 선택된 상태로 취급하는 마이그레이션을 정리했습니다. 새 구조로 바꾸는 것과 기존 데이터의 의미를 유지하는 것을 함께 고려했습니다.' }
    ],
    learned: '데이터 모델은 화면의 항목을 그대로 옮기는 작업이 아니라 서비스가 허용하는 관계와 상태를 정의하는 작업이라는 점을 배웠습니다. 특히 후보의 순서처럼 단순해 보이는 값도 고유해야 하는 범위를 먼저 정해야 올바른 제약을 만들 수 있었습니다.\n\n또한 스키마 변경에서는 새로운 구조의 타당성뿐 아니라 기존 데이터의 이관 방식과 삭제 이후의 상태까지 확인해야 했습니다. 이 경험을 통해 기능을 설계할 때 생성·조회·변경·삭제의 흐름을 함께 검토하는 관점을 익혔습니다.'
  },
  gotion: {
    name: 'Gotion',
    index: '02',
    category: 'FRONTEND / TEAM WEB PROJECT',
    subtitle: '팀을 이끌며 학교 구성원을 위한 메모 공유 서비스의 화면을 구현했습니다.',
    role: '팀장 · 프론트엔드',
    stack: ['React', 'Vite', 'Tailwind CSS', 'TipTap'],
    links: [['팀 GitHub · 비공개', 'https://github.com/soshinbalun/gotion']],
    summary: 'Gotion은 학교 구성원이 노트를 작성하고 공유하는 웹 서비스입니다. 팀 프로젝트에는 리치 텍스트 편집, 읽기·편집 권한에 따른 화면, 실시간 공동 편집 등이 포함되어 있습니다. React와 TipTap으로 편집 화면을 구성하고, 서버와 데이터베이스를 통해 노트 및 공유 정보를 관리합니다.\n\n저는 팀장과 프론트엔드를 맡았습니다. 개인 구현 사례로는 노트 페이지의 AI 채팅 패널을 중심으로 정리했습니다. 기존 노트를 보면서 보조 기능을 사용할 수 있도록 패널 진입점, 입력 처리, 메시지 표시와 닫기 동작을 연결했습니다. 이 구현 단계의 범위는 채팅 UI이며, 실제 AI 응답은 백엔드 연동 전 안내 메시지로 처리했습니다.',
    architecture: [
      { label: 'CLIENT', name: 'React · TipTap', tech: '메모 작성 · 화면 상호작용' },
      { label: 'SERVER', name: 'Express · Socket.IO', tech: 'API · 실시간 동기화' },
      { label: 'DATA', name: 'PostgreSQL', tech: 'Prisma ORM' }
    ],
    architectureCaption: '팀 프로젝트 전체의 주요 구성입니다. 개인 담당 영역은 React 기반 프론트엔드입니다.',
    implementation: [
      { title: '팀 진행과 사용자 흐름', text: '팀장 역할과 함께 노트 페이지에 새로운 기능을 연결하는 프론트엔드 작업을 맡았습니다. 노트는 읽기 전용 상태와 편집 상태가 나뉘므로, 두 화면에서 AI 기능을 여는 위치와 패널의 동작이 일관되도록 구성했습니다.\n\n읽기 화면에서는 저장된 노트 제목을, 편집 화면에서는 현재 입력한 제목을 우선 전달했습니다. 같은 기능이라도 사용자가 보고 있는 화면 상태에 맞는 맥락을 표시하도록 연결했습니다.' },
      { title: '컴포넌트와 상태의 책임 분리', text: 'AI 진입 버튼과 AiChatPanel을 별도 컴포넌트로 분리했습니다. 부모인 NotePage는 showAiChat으로 열림 상태를 관리하고, 패널에는 open·onClose·noteTitle을 전달합니다. 패널 내부에서는 messages와 input을 관리해 페이지 상태와 대화 입력 상태의 책임을 나눴습니다.\n\n메시지는 사용자와 안내 응답을 구분해 배치하고 줄바꿈을 보존했습니다. 새 메시지가 추가되거나 패널을 열 때는 스크롤 영역을 마지막 메시지 위치로 이동시켜 최신 대화를 확인할 수 있게 했습니다.' }
    ],
      
    decisions: [
      { label: '입력 처리', title: '한글 조합 중 전송을 막는 키보드 처리', text: 'Enter는 메시지 전송, Shift+Enter는 줄바꿈으로 처리했습니다. 한글 입력 중 Enter가 글자 조합을 확정하는 데 사용될 수 있으므로 nativeEvent.isComposing을 확인한 뒤 전송하도록 조건을 구성했습니다.\n\n공백만 입력한 메시지는 trim()으로 검사해 전송 함수에서 차단하고, 같은 조건으로 전송 버튼도 비활성화했습니다. 버튼 상태와 실제 처리 로직 양쪽에 동일한 입력 기준을 적용했습니다.' },
      { label: '반응형 구성', title: '하나의 패널을 화면 크기에 맞추기', text: '패널은 화면 너비를 사용하되 최대 너비를 제한했습니다. 작은 화면에서는 입력 공간을 확보하고, 큰 화면에서는 노트 옆의 보조 영역으로 보이도록 구성했습니다.\n\n헤더·메시지 목록·입력 영역을 세로로 나누고 메시지 목록만 스크롤되도록 했습니다. 대화가 길어져도 닫기 버튼과 입력 영역을 계속 사용할 수 있는 구조입니다.' },
      { label: '화면 설계', title: '작업 맥락을 유지하는 보조 패널', text: '별도 페이지로 이동하면 사용자가 작성하거나 읽던 노트와 대화 화면 사이를 반복해서 오가야 합니다. 노트 위에 여는 사이드 패널을 선택해 기존 작업 화면을 유지하고, 읽기·편집 화면에서 같은 컴포넌트를 사용하도록 했습니다.\n\n배경을 누르면 닫히도록 하되 패널 내부 클릭에는 이벤트 전파를 차단했습니다. 입력창이나 메시지를 클릭하는 행동이 패널 닫기로 이어지지 않도록 상호작용의 경계를 구분했습니다.' },
      { label: '구현 단계', title: '서버 연결과 화면 상태 분리', text: '입력과 메시지 표시, 패널 열기·닫기는 서버 응답과 관계없이 먼저 확인할 수 있는 동작입니다. 초기 구현에서는 이 흐름을 구성하고, 전송 후에는 백엔드 연결 준비 중임을 알리는 안내 메시지를 표시했습니다.\n\n이 단계에서 구현한 것은 AI 응답 생성이 아닌 사용자 인터페이스입니다. 실제 응답을 연동할 때는 요청 중 상태, 실패·재시도, 응답 순서 등을 별도로 다뤄야 하므로 현재 구현 범위와 후속 과제를 구분했습니다.' }
    ],
    learned: '기능을 추가할 때는 새로운 컴포넌트 자체뿐 아니라 기존 페이지의 읽기·편집 상태, 입력 방식, 닫기 동작까지 함께 설계해야 한다는 점을 배웠습니다. 특히 한글 조합 입력이나 배경 클릭처럼 작은 상호작용이 실제 사용성에 직접 영향을 준다는 것을 구현 과정에서 확인했습니다.\n\n팀장 역할과 프론트엔드 개발을 병행하면서 팀 전체 서비스의 기능과 개인이 완료한 구현 범위를 명확히 설명하는 중요성도 배웠습니다. 이후 작업에서는 UI 완료와 서버 연동 완료를 구분하고, 연동 시 필요한 상태를 더 일찍 정리하고자 합니다.'
  }
};

function renderCase(id) {
  const project = projects[id];
  const links = project.links.map(([label, url]) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`).join('');
  document.querySelector('#case-index').textContent = `PROJECT / ${project.index}`;
  document.querySelector('#case-content').innerHTML = `<div class="case-hero">
    <div class="case-eyebrow">${project.category}</div>
    <h1 id="case-title" tabindex="-1">${project.name}</h1>
    <p class="case-subtitle">${project.subtitle}</p>
    <dl class="case-facts">
      <div><dt>ROLE</dt><dd>${project.role}</dd></div>
      <div><dt>LINKS</dt><dd class="case-fact-links">${links}</dd></div>
      <div><dt>TECH STACK</dt><dd class="case-stack">${project.stack.map(tech => `<span>${tech}</span>`).join('')}</dd></div>
    </dl>
  </div><article class="case-main case-main-full">
    ${projectSection('01', '프로젝트 요약', `<div class="case-prose">${caseParagraphs(project.summary)}</div>`)}
    ${projectSection('02', '시스템 / 인프라', projectArchitecture(project.architecture, project.architectureCaption))}
    ${projectSection('03', '핵심 구현', projectPoints(project.implementation))}
    ${projectSection('04', '설계 결정 · 트러블슈팅', projectDecisions(project.decisions))}
    ${projectSection('05', '배운 점', `<div class="case-result">${caseParagraphs(project.learned)}</div>`)}
  </article>`;
}
