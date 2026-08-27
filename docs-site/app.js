'use strict';

(() => {
  const defaults = {
    pathA: '/workspace-a/node_modules/shared/lib/index.js',
    pathB: '/workspace-b/node_modules/shared/lib/index.js',
    source: 'global.loads = (global.loads || 0) + 1\nmodule.exports = { loads: global.loads }',
    depth: 2
  };
  const pathA = document.querySelector('#path-a');
  const pathB = document.querySelector('#path-b');
  const sourceA = document.querySelector('#source-a');
  const sourceB = document.querySelector('#source-b');
  const depth = document.querySelector('#depth');
  const title = document.querySelector('#result-title');
  const detail = document.querySelector('#result-detail');
  const indicator = document.querySelector('#status-indicator');
  const identity = document.querySelector('#identity-preview');

  document.querySelector('#evaluate-button').addEventListener('click', evaluate);
  document.querySelector('#reset-button').addEventListener('click', () => {
    pathA.value = defaults.pathA;
    pathB.value = defaults.pathB;
    sourceA.value = defaults.source;
    sourceB.value = defaults.source;
    depth.value = String(defaults.depth);
    evaluate();
  });
  for (const element of [pathA, pathB, sourceA, sourceB, depth]) {
    element.addEventListener('input', evaluate);
  }
  for (const button of document.querySelectorAll('[data-copy]')) {
    button.addEventListener('click', async () => {
      const target = document.querySelector(button.dataset.copy);
      const value = target ? target.textContent.trim() : '';
      await navigator.clipboard.writeText(value);
      const previous = button.textContent;
      button.textContent = 'Copied';
      setTimeout(() => { button.textContent = previous; }, 1200);
    });
  }

  async function evaluate() {
    const requestedDepth = Number(depth.value);
    if (!Number.isInteger(requestedDepth) || requestedDepth < 0 || requestedDepth > 12) {
      show(false, 'Invalid parent depth', 'Use a whole number from 0 through 12.');
      identity.textContent = 'configuration rejected';
      return;
    }

    const first = identityParts(pathA.value, sourceA.value, requestedDepth);
    const second = identityParts(pathB.value, sourceB.value, requestedDepth);
    const sourceMatches = first.source === second.source;
    const basenameMatches = first.basename === second.basename;
    const parentsMatch = JSON.stringify(first.parents) === JSON.stringify(second.parents);
    const matches = sourceMatches && basenameMatches && parentsMatch;
    const reasons = [
      `source ${sourceMatches ? 'matches' : 'differs'}`,
      `basename ${basenameMatches ? 'matches' : 'differs'}`,
      `parents ${parentsMatch ? 'match' : 'differ'}`
    ];

    show(matches, matches ? 'Exports will be shared' : 'Modules remain independent', reasons.join(', ') + '.');
    identity.textContent = matches ? await digest(first.framed) : 'different identity inputs';
  }

  function identityParts(filename, source, requestedDepth) {
    const parts = filename.split(/[\\/]+/).filter(Boolean);
    const basename = parts.pop() || '';
    const parents = requestedDepth === 0 ? [] : parts.slice(-requestedDepth);
    const values = [source, basename, String(parents.length), ...parents];
    return { source, basename, parents, framed: values.map(frame).join('') };
  }

  function frame(value) {
    const bytes = new TextEncoder().encode(String(value));
    return `${bytes.length}:${value}`;
  }

  async function digest(value) {
    if (!globalThis.crypto || !globalThis.crypto.subtle) return 'matching SHA-256 inputs';
    const bytes = await globalThis.crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
    return `${Array.from(new Uint8Array(bytes)).map((byte) => byte.toString(16).padStart(2, '0')).join('').slice(0, 20)}...`;
  }

  function show(matches, heading, message) {
    title.textContent = heading;
    detail.textContent = message;
    indicator.classList.toggle('error', !matches);
  }

  evaluate();
})();
