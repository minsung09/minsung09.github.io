// Project detail content is kept separate so each case follows the same reading order.
const projectSection = (number, title, content) => `<section class="case-section"><div class="case-section-heading"><span>${number}</span><h2>${title}</h2></div>${content}</section>`;
const projectArchitecture = (steps, caption) => `<figure class="case-architecture"><div class="architecture-steps">${steps.map((step, index) => `<div class="architecture-step"><span class="architecture-index">0${index + 1} / ${step.label}</span><strong>${step.name}</strong><span class="architecture-tech">${step.tech}</span></div>`).join('')}</div><figcaption>${caption}</figcaption></figure>`;
const projectPoints = points => `<div class="case-point-list">${points.map(point => `<div class="case-point"><h3>${point.title}</h3><p>${point.text}</p></div>`).join('')}</div>`;
const projectDecisions = decisions => `<div class="case-decision-list">${decisions.map(item => `<div class="case-decision"><span>${item.label}</span><h3>${item.title}</h3><p>${item.text}</p></div>`).join('')}</div>`;

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
    summary: 'TongChoo는 상대와 상황, 말투에 맞는 답변을 만들고 대화를 이어 가는 팀 프로젝트입니다. 저는 사용자, 답변, 여러 답변 후보, 후속 대화 사이의 관계를 데이터베이스에 표현하는 일을 맡았습니다.',
    architecture: [
      { label: 'CLIENT', name: '서비스 화면', tech: '답변 작성 · 후속 대화' },
      { label: 'API', name: 'Spring Boot', tech: '도메인 · JPA · 검증' },
      { label: 'DATA', name: 'MySQL', tech: '관계형 스키마 · Flyway' }
    ],
    architectureCaption: '프로젝트의 데이터 흐름을 요약한 구조입니다. 개인 담당 영역은 데이터 모델과 제약 조건입니다.',
    implementation: [
      { title: '답변 후보 분리', text: '답변 후보를 별도 테이블로 분리하고 sort_order와 selected로 표시 순서와 선택 상태를 관리했습니다.' },
      { title: '후속 대화 연결', text: 'reply_to_excuse_id 자기 참조를 사용해 후속 답변이 이전 대화와 이어지도록 모델링했습니다.' },
      { title: '데이터 무결성', text: '이메일·닉네임의 UNIQUE 제약과 외래 키, 답변별 후보 순서의 복합 UNIQUE 제약을 정의했습니다.' }
    ],
    decisions: [
      { label: '설계 결정', title: '한 칸에 여러 답변을 담지 않기', text: '답변 후보의 순서와 선택 상태가 늘어날 수 있어 단일 필드를 확장하는 대신 후보 테이블을 독립시켰습니다.' },
      { label: '문제 해결', title: '연결과 삭제 기준 명확히 하기', text: '후속 대화는 자기 참조로 연결하고, 연관 데이터의 삭제 정책과 기존 답변을 후보 구조로 옮기는 마이그레이션을 정리했습니다.' }
    ],
    learned: '테이블을 만드는 것보다 데이터가 생성·연결·수정·삭제되는 흐름을 먼저 그리는 일이 중요했습니다. 관계와 제약 조건으로 서비스의 규칙을 표현하는 방법을 배웠습니다.'
  },
  gotion: {
    name: 'Gotion',
    index: '02',
    category: 'FRONTEND / TEAM WEB PROJECT',
    subtitle: '팀을 이끌며 학교 구성원을 위한 메모 공유 서비스의 화면을 구현했습니다.',
    role: '팀장 · 프론트엔드',
    stack: ['React', 'Vite', 'Tailwind CSS', 'TipTap'],
    links: [['팀 GitHub · 비공개', 'https://github.com/soshinbalun/gotion']],
    summary: 'Gotion은 학교 구성원이 메모를 작성하고 공유하는 팀 웹 프로젝트입니다. 팀장으로서 요구사항과 진행 과정을 조율하고, 프론트엔드에서 사용자 흐름과 노트 페이지의 AI 채팅 패널 UI를 구현했습니다.',
    architecture: [
      { label: 'CLIENT', name: 'React · TipTap', tech: '메모 작성 · 화면 상호작용' },
      { label: 'SERVER', name: 'Express · Socket.IO', tech: 'API · 실시간 동기화' },
      { label: 'DATA', name: 'PostgreSQL', tech: 'Prisma ORM' }
    ],
    architectureCaption: '팀 프로젝트 전체의 주요 구성입니다. 개인 담당 영역은 React 기반 프론트엔드입니다.',
    implementation: [
      { title: '팀 진행과 사용자 흐름', text: '팀장으로서 요구사항을 조율하고, 메모를 읽고 편집하는 화면에서 필요한 동작과 진입점을 프론트엔드 화면에 연결했습니다.' },
      { title: 'AI 채팅 패널 UI', text: '노트 페이지에서 열 수 있는 채팅 패널과 입력·대화 표시·닫기 동작을 React 컴포넌트로 구현했습니다.' }
    ],
    decisions: [
      { label: '화면 설계', title: '작업 맥락을 유지하는 보조 패널', text: '노트 화면을 떠나지 않고 AI 기능을 열 수 있도록 패널 형태로 구성했습니다. 읽기 화면과 편집 화면에 같은 진입점을 배치했습니다.' },
      { label: '구현 단계', title: '서버 연결과 화면 상태 분리', text: '초기 구현에서는 채팅 UI의 열림 상태, 입력, 메시지 표시를 먼저 구성하고 서버 응답 연동은 별도 단계로 구분했습니다.' }
    ],
    learned: '팀장으로서 공통의 목표를 화면과 구현 단위로 정리하는 과정을 경험했습니다. 기능을 기존 노트 경험에 자연스럽게 연결하고, 개발 결과를 팀과 함께 공유하며 조율의 중요성을 배웠습니다.'
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
    ${projectSection('01', '프로젝트 요약', `<p>${project.summary}</p>`)}
    ${projectSection('02', '시스템 / 인프라', projectArchitecture(project.architecture, project.architectureCaption))}
    ${projectSection('03', '핵심 구현', projectPoints(project.implementation))}
    ${projectSection('04', '설계 결정 · 트러블슈팅', projectDecisions(project.decisions))}
    ${projectSection('05', '배운 점', `<div class="case-result"><p>${project.learned}</p></div>`)}
  </article>`;
}
