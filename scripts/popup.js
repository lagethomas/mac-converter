document.addEventListener('DOMContentLoaded', function () {
    const macInput = document.getElementById('macInput');
    const macError = document.getElementById('macError');
    const resultsContainer = document.getElementById('results');
    const emptyState = document.getElementById('emptyState');
    const clearBtn = document.getElementById('clearBtn');

    const resultElements = {
        formatDashHyphen: document.getElementById('formatDashHyphen'),
        formatColon: document.getElementById('formatColon'),
        formatDot: document.getElementById('formatDot'),
        formatNoSeparator: document.getElementById('formatNoSeparator'),
        formatSpaces: document.getElementById('formatSpaces'),
        formatHP: document.getElementById('formatHP'),
        formatFourByFour: document.getElementById('formatFourByFour')
    };

    const resultCards = document.querySelectorAll('.result-card');

    function normalizeMac(mac) {
        if (!mac) return '';
        // Remove all non-hex characters
        return mac.replace(/[^0-9a-fA-F]/g, '').toUpperCase();
    }

    function isValidNormalizedMac(normalizedMac) {
        return normalizedMac.length === 12 && /^[0-9A-F]{12}$/.test(normalizedMac);
    }

    function formatMac(normalizedMac, separator, groupSize) {
        if (!normalizedMac) return '';
        let formatted = [];
        for (let i = 0; i < normalizedMac.length; i += groupSize) {
            formatted.push(normalizedMac.substring(i, i + groupSize));
        }
        return formatted.join(separator);
    }

    function updateUI(normalizedMac) {
        if (normalizedMac.length === 0) {
            resultsContainer.classList.add('hidden');
            emptyState.classList.remove('hidden');
            macError.classList.remove('show');
            return;
        }

        if (!isValidNormalizedMac(normalizedMac)) {
            if (normalizedMac.length >= 12) {
                macError.classList.add('show');
            } else {
                macError.classList.remove('show');
            }
            resultsContainer.classList.add('hidden');
            emptyState.classList.remove('hidden');
            return;
        }

        macError.classList.remove('show');
        resultsContainer.classList.remove('hidden');
        emptyState.classList.add('hidden');

        const variations = {
            formatDashHyphen: formatMac(normalizedMac, '-', 2),
            formatColon: formatMac(normalizedMac, ':', 2),
            formatDot: formatMac(normalizedMac, '.', 4),
            formatNoSeparator: normalizedMac,
            formatSpaces: formatMac(normalizedMac, ' ', 2),
            formatHP: `${normalizedMac.substring(0, 6)}-${normalizedMac.substring(6)}`,
            formatFourByFour: `${normalizedMac.substring(0, 4)}-${normalizedMac.substring(4, 8)}-${normalizedMac.substring(8, 12)}`
        };

        for (const key in resultElements) {
            resultElements[key].textContent = variations[key];
        }
    }

    function copyToClipboard(text, card) {
        navigator.clipboard.writeText(text).then(() => {
            card.classList.add('copied');
            setTimeout(() => {
                card.classList.remove('copied');
            }, 1500);
        }).catch(err => {
            console.error('Falha ao copiar:', err);
        });
    }

    // Event Listeners
    macInput.addEventListener('input', (e) => {
        const normalized = normalizeMac(e.target.value);
        updateUI(normalized);
    });

    clearBtn.addEventListener('click', () => {
        macInput.value = '';
        updateUI('');
        macInput.focus();
    });

    resultCards.forEach(card => {
        card.addEventListener('click', () => {
            const valueElement = card.querySelector('.result-value');
            if (valueElement && valueElement.textContent) {
                copyToClipboard(valueElement.textContent, card);
            }
        });
    });

    // Initial focus
    macInput.focus();
});