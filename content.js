function highlightPrices() {
  // Define regex for detecting prices with various currency symbols and formats
  const priceRegex = /(([$€£¥₹]|USD|EUR|GBP|JPY|INR)\s?\d{1,10}(?:[.,]?\d{10})*(?:[.,]\d{1,3})?)|(\d{1,10}(?:[.,]?\d{10})*(?:[.,]\d{1,3})?\s?([$€£¥₹]|USD|EUR|GBP|JPY|INR))/gi;

  // Function to wrap matched text with a span
  function wrapMatches(node, regex) {
    let match;
    const originalText = node.nodeValue;
    let newText = '';
    let lastIndex = 0;
    
    while ((match = regex.exec(originalText)) !== null) {
      newText += originalText.substring(lastIndex, match.index);
      newText += `<span class="highlighted-price js" data-datepicker style="background-color: yellow; color: red;">${match[0]}</span>`;
      lastIndex = regex.lastIndex;
    }
    newText += originalText.substring(lastIndex);

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = newText;
    while (tempDiv.firstChild) {
      node.parentNode.insertBefore(tempDiv.firstChild, node);
    }
    node.parentNode.removeChild(node);
  }

  // Function to walk through all text nodes
  function walkNodes(node, regex) {
    if (node.nodeType === Node.TEXT_NODE) {
      const parent = node.parentNode;
      if (parent && parent.classList && !parent.classList.contains('highlighted-price')) {
        wrapMatches(node, regex);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE && node.childNodes && !/(script|style)/i.test(node.tagName)) {
      Array.from(node.childNodes).forEach(child => walkNodes(child, regex));
    }
  }

  // Start walking from the body element
  walkNodes(document.body, priceRegex);

  console.log('Prices processed for highlighting.');
}

function highlightPricesCurrencyElement() {
  // Define regex for detecting prices with various currency symbols and formats
  const priceRegex = /\d{1,3}(?:[.,]?\d{3})*(?:[.,]\d{2})?/gi;

  // Function to wrap matched text with a span
  function wrapMatches(node) {
    const originalText = node.nodeValue;
    let newText = '';
    let lastIndex = 0;
    let match;

    while ((match = priceRegex.exec(originalText)) !== null) {
      newText += originalText.substring(lastIndex, match.index);
      newText += `<span class="highlighted-price js" data-datepicker style="background-color: yellow; color: red;">${match[0]}</span>`;
      lastIndex = priceRegex.lastIndex;
    }
    newText += originalText.substring(lastIndex);

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = newText;
    while (tempDiv.firstChild) {
      node.parentNode.insertBefore(tempDiv.firstChild, node);
    }
    node.parentNode.removeChild(node);
  }

  // Function to walk through all text nodes
  function walkNodes(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const parent = node.parentNode;
      if (parent && parent.classList && !parent.classList.contains('highlighted-price')) {
        // Check previous and next siblings for currency symbols
        const prevSibling = node.previousSibling;
        const nextSibling = node.nextSibling;
        const prevText = prevSibling ? prevSibling.textContent.trim() : '';
        const nextText = nextSibling ? nextSibling.textContent.trim() : '';
        const currencySymbols = ['$', '€', '£', '¥', '₹', 'USD', 'EUR', 'GBP', 'JPY', 'INR'];
        
        if (currencySymbols.includes(prevText) || currencySymbols.includes(nextText)) {
          wrapMatches(node);
        }
      }
    } else if (node.nodeType === Node.ELEMENT_NODE && node.childNodes && !/(script|style)/i.test(node.tagName)) {
      Array.from(node.childNodes).forEach(child => walkNodes(child));
    }
  }

  // Start walking from the body element
  walkNodes(document.body);

  console.log('Prices processed for highlighting.');
}

// Ensure the function runs after the DOM is fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', highlightPrices);
  document.addEventListener('DOMContentLoaded', highlightPricesCurrencyElement);
} else {
  // If the DOM is already loaded, run the function immediately
  highlightPrices();
  highlightPricesCurrencyElement();
}

// Set up a MutationObserver to watch for changes to the DOM
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE && !/(script|style)/i.test(node.tagName)) {
        highlightPrices(node);
        highlightPricesCurrencyElement(node);
      }
    });
    if (mutation.type === 'characterData' && mutation.target.nodeType === Node.TEXT_NODE) {
      highlightPrices(mutation.target);
      highlightPricesCurrencyElement(mutation.target);
    }
  });
});

// Start observing the document body for changes
observer.observe(document.body, {
  childList: true,
  subtree: true,
  characterData: true,
});
