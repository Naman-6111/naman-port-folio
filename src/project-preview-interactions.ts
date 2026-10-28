function addShopSenseControls(preview: HTMLElement) {
  const card = preview.querySelector<HTMLElement>('.recommend-card');
  if (!card || card.querySelector('.preview-mini-action')) return;

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'preview-mini-action';
  button.textContent = 'Add to cart';
  button.setAttribute('aria-label', 'Add recommended headphones to the preview cart');
  card.append(button);

  const count = document.createElement('span');
  count.className = 'preview-cart-count';
  count.textContent = 'CART · 0';
  preview.querySelector('.preview-top')?.append(count);

  let cartCount = 0;
  button.addEventListener('click', () => {
    cartCount += 1;
    count.textContent = `CART · ${cartCount}`;
    button.textContent = `Added · ${cartCount}`;
    button.classList.add('is-added');
  });
}

function addPayFlowControls(preview: HTMLElement) {
  const rows = preview.querySelectorAll<HTMLElement>('.tx-row');
  if (!rows.length || preview.querySelector('.preview-transaction-detail')) return;

  const detail = document.createElement('div');
  detail.className = 'preview-transaction-detail';
  detail.setAttribute('aria-live', 'polite');
  detail.textContent = 'Select a transaction to inspect its payment status and risk signal.';
  preview.querySelector('.risk-legend')?.before(detail);

  rows.forEach((row) => {
    if (row.dataset.interactive === 'true') return;
    row.dataset.interactive = 'true';
    row.tabIndex = 0;
    row.setAttribute('role', 'button');
    row.setAttribute('aria-label', `Inspect transaction ${row.querySelector('.tx-name b')?.textContent ?? ''}`);

    const selectRow = () => {
      rows.forEach((item) => {
        item.classList.remove('is-selected');
        item.setAttribute('aria-pressed', 'false');
      });
      row.classList.add('is-selected');
      row.setAttribute('aria-pressed', 'true');
      const merchant = row.querySelector('.tx-name b')?.childNodes[0]?.textContent?.trim() ?? 'Transaction';
      const risk = row.children[1]?.textContent?.trim() ?? 'Risk signal unavailable';
      const status = row.children[2]?.textContent?.trim() ?? 'Status unavailable';
      detail.textContent = `${merchant} · ${status} · Risk signal: ${risk}. Review signals support operator review; they are not a fraud verdict.`;
    };

    row.addEventListener('click', selectRow);
    row.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selectRow();
      }
    });
  });
}

function addRagControls(preview: HTMLElement) {
  const query = preview.querySelector<HTMLElement>('.rag-query > div');
  if (!query || preview.querySelector('.preview-rag-form')) return;

  const form = document.createElement('form');
  form.className = 'preview-rag-form';
  const input = document.createElement('input');
  input.type = 'text';
  input.name = 'query';
  input.placeholder = 'Ask about academic documents…';
  input.setAttribute('aria-label', 'Enter a question for the RAG interface preview');
  input.required = true;
  const button = document.createElement('button');
  button.type = 'submit';
  button.textContent = 'Preview query';
  form.append(input, button);
  query.replaceWith(form);

  const answer = preview.querySelector<HTMLElement>('.llm-answer p');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (answer) {
      answer.textContent = `Query preview: “${input.value.trim()}” · This visual demo does not send requests to a model.`;
    }
  });

  preview.querySelectorAll<HTMLElement>('.retrieval-box').forEach((box) => {
    if (box.dataset.interactive === 'true') return;
    box.dataset.interactive = 'true';
    box.tabIndex = 0;
    box.setAttribute('role', 'button');
    box.setAttribute('aria-pressed', 'false');
    box.addEventListener('click', () => {
      const selected = box.classList.toggle('is-selected');
      box.setAttribute('aria-pressed', String(selected));
    });
    box.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        box.click();
      }
    });
  });
}

export function installProjectPreviewInteractions() {
  const initialize = (root: ParentNode) => {
    if (root instanceof HTMLElement && root.matches('.commerce-preview')) addShopSenseControls(root);
    if (root instanceof HTMLElement && root.matches('.payment-preview')) addPayFlowControls(root);
    if (root instanceof HTMLElement && root.matches('.rag-preview')) addRagControls(root);
    root.querySelectorAll<HTMLElement>('.commerce-preview').forEach(addShopSenseControls);
    root.querySelectorAll<HTMLElement>('.payment-preview').forEach(addPayFlowControls);
    root.querySelectorAll<HTMLElement>('.rag-preview').forEach(addRagControls);
  };

  initialize(document);
  const observer = new MutationObserver((records) => {
    records.forEach((record) => {
      if (record.target instanceof HTMLElement) {
        initialize(record.target);
        const preview = record.target.closest<HTMLElement>('.preview');
        if (preview) initialize(preview);
      }
      record.addedNodes.forEach((node) => {
        if (node instanceof HTMLElement) initialize(node);
      });
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
  return () => observer.disconnect();
}
